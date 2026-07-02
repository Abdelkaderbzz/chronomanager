'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import confetti from 'canvas-confetti';
import { toast } from '@/hooks/use-toast';
import {
  createInitialPomodoroState,
  createNewPlant,
  getPlantStage,
  type LinkedTask,
  type PomodoroPhase,
  type PomodoroPersistedState,
  type PomodoroSettings,
} from '@/types/pomodoro';

const STORAGE_KEY = 'pomodoroState';

type PomodoroContextValue = PomodoroPersistedState & {
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  progress: number;
  startFocus: (task?: LinkedTask) => void;
  startBreak: (type: 'shortBreak' | 'longBreak') => void;
  toggleTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipPhase: () => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  resetGarden: () => void;
};

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

function loadState(): PomodoroPersistedState {
  if (typeof window === 'undefined') return createInitialPomodoroState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialPomodoroState();
    const parsed = JSON.parse(raw) as PomodoroPersistedState;
    return {
      ...createInitialPomodoroState(),
      ...parsed,
      settings: {
        ...createInitialPomodoroState().settings,
        ...parsed.settings,
      },
      currentPlant: {
        ...createNewPlant(),
        ...parsed.currentPlant,
        stage: getPlantStage(parsed.currentPlant?.growthPoints ?? 0),
      },
    };
  } catch {
    return createInitialPomodoroState();
  }
}

function phaseDuration(settings: PomodoroSettings, phase: PomodoroPhase): number {
  switch (phase) {
    case 'focus':
      return settings.focusMinutes * 60;
    case 'shortBreak':
      return settings.shortBreakMinutes * 60;
    case 'longBreak':
      return settings.longBreakMinutes * 60;
    default:
      return settings.focusMinutes * 60;
  }
}

function playChime(enabled: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // ignore audio errors
  }
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PomodoroPersistedState>(createInitialPomodoroState);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const completePhase = useCallback(() => {
    const current = stateRef.current;
    const { settings, phase, linkedTask, sessionsInCycle, currentPlant } = current;

    playChime(settings.soundEnabled);

    if (phase === 'focus') {
      const newGrowth = currentPlant.growthPoints + 1;
      const newSessions = currentPlant.sessionsCompleted + 1;
      const newStage = getPlantStage(newGrowth);
      let updatedPlant = {
        ...currentPlant,
        growthPoints: newGrowth,
        sessionsCompleted: newSessions,
        stage: newStage,
      };
      let garden = [...current.garden];
      const newSessionsInCycle = sessionsInCycle + 1;
      const isLongBreak =
        newSessionsInCycle >= settings.sessionsUntilLongBreak;

      if (newStage === 'bloom') {
        garden = [...garden, { ...updatedPlant, name: `Plant #${garden.length + 1}` }];
        updatedPlant = createNewPlant();
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.65 } });
        toast({
          title: '🌸 Plant bloomed!',
          description: 'Your focus plant reached full bloom. A new seed has been planted.',
        });
      } else {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
        toast({
          title: '🌱 Focus session complete!',
          description: `Your plant grew to ${newStage.replace('-', ' ')}.`,
        });
      }

      const nextPhase: PomodoroPhase = isLongBreak ? 'longBreak' : 'shortBreak';
      const nextSeconds = phaseDuration(settings, nextPhase);

      setState((prev) => ({
        ...prev,
        phase: nextPhase,
        remainingSeconds: nextSeconds,
        isRunning: settings.autoStartBreaks,
        sessionsInCycle: isLongBreak ? 0 : newSessionsInCycle,
        totalSessions: prev.totalSessions + 1,
        currentPlant: updatedPlant,
        garden,
        sessionHistory: [
          {
            id: crypto.randomUUID(),
            phase: 'focus',
            durationSeconds: settings.focusMinutes * 60,
            completedAt: Date.now(),
            task: linkedTask ?? undefined,
          },
          ...prev.sessionHistory.slice(0, 49),
        ],
      }));
      return;
    }

    const nextPhase: PomodoroPhase = 'focus';
    const nextSeconds = phaseDuration(settings, nextPhase);

    toast({
      title: phase === 'longBreak' ? '☕ Long break over' : '☕ Break over',
      description: settings.autoStartFocus
        ? 'Starting next focus session…'
        : 'Ready for your next focus session.',
    });

    setState((prev) => ({
      ...prev,
      phase: nextPhase,
      remainingSeconds: nextSeconds,
      isRunning: settings.autoStartFocus,
    }));
  }, []);

  useEffect(() => {
    if (!state.isRunning || state.phase === 'idle') return;

    const id = window.setInterval(() => {
      setState((prev) => {
        if (prev.remainingSeconds <= 1) {
          window.setTimeout(() => completePhase(), 0);
          return { ...prev, remainingSeconds: 0, isRunning: false };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [state.isRunning, state.phase, completePhase]);

  const startFocus = useCallback((task?: LinkedTask) => {
    setState((prev) => {
      const seconds = phaseDuration(prev.settings, 'focus');
      return {
        ...prev,
        phase: 'focus',
        remainingSeconds: seconds,
        isRunning: true,
        linkedTask: task ?? null,
      };
    });
    setPanelOpen(true);
  }, []);

  const startBreak = useCallback((type: 'shortBreak' | 'longBreak') => {
    setState((prev) => ({
      ...prev,
      phase: type,
      remainingSeconds: phaseDuration(prev.settings, type),
      isRunning: true,
      linkedTask: null,
    }));
    setPanelOpen(true);
  }, []);

  const toggleTimer = useCallback(() => {
    setState((prev) => {
      if (prev.phase === 'idle') {
        return {
          ...prev,
          phase: 'focus',
          remainingSeconds: phaseDuration(prev.settings, 'focus'),
          isRunning: true,
        };
      }
      return { ...prev, isRunning: !prev.isRunning };
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'idle',
      remainingSeconds: phaseDuration(prev.settings, 'focus'),
      isRunning: false,
      linkedTask: null,
    }));
  }, []);

  const skipPhase = useCallback(() => {
    completePhase();
  }, [completePhase]);

  const updateSettings = useCallback((partial: Partial<PomodoroSettings>) => {
    setState((prev) => {
      const settings = { ...prev.settings, ...partial };
      const shouldResetRemaining =
        prev.phase === 'idle' ||
        (prev.phase === 'focus' && partial.focusMinutes !== undefined) ||
        (prev.phase === 'shortBreak' && partial.shortBreakMinutes !== undefined) ||
        (prev.phase === 'longBreak' && partial.longBreakMinutes !== undefined);

      return {
        ...prev,
        settings,
        remainingSeconds: shouldResetRemaining
          ? phaseDuration(settings, prev.phase === 'idle' ? 'focus' : prev.phase)
          : prev.remainingSeconds,
      };
    });
  }, []);

  const resetGarden = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPlant: createNewPlant(),
      garden: [],
      sessionHistory: [],
      sessionsInCycle: 0,
      totalSessions: 0,
    }));
    toast({ title: 'Garden reset', description: 'Your plants and session history were cleared.' });
  }, []);

  const totalSeconds =
    state.phase === 'idle'
      ? state.settings.focusMinutes * 60
      : phaseDuration(state.settings, state.phase);
  const progress =
    totalSeconds === 0
      ? 0
      : Math.round(((totalSeconds - state.remainingSeconds) / totalSeconds) * 100);

  const value: PomodoroContextValue = {
    ...state,
    panelOpen,
    setPanelOpen,
    progress,
    startFocus,
    startBreak,
    toggleTimer,
    pauseTimer,
    resetTimer,
    skipPhase,
    updateSettings,
    resetGarden,
  };

  return (
    <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) {
    throw new Error('usePomodoro must be used within PomodoroProvider');
  }
  return ctx;
}
