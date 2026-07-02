export type PomodoroPhase = 'idle' | 'focus' | 'shortBreak' | 'longBreak';

export type PlantStage =
  | 'seed'
  | 'sprout'
  | 'sapling'
  | 'young'
  | 'mature'
  | 'bloom';

export type PomodoroSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
};

export type LinkedTask = {
  taskId: string;
  taskTitle: string;
  folderId: string;
  listId: string;
};

export type PomodoroSession = {
  id: string;
  phase: PomodoroPhase;
  durationSeconds: number;
  completedAt: number;
  task?: LinkedTask;
};

export type Plant = {
  id: string;
  stage: PlantStage;
  growthPoints: number;
  sessionsCompleted: number;
  createdAt: number;
  name: string;
};

export type PomodoroPersistedState = {
  settings: PomodoroSettings;
  phase: PomodoroPhase;
  remainingSeconds: number;
  isRunning: boolean;
  sessionsInCycle: number;
  totalSessions: number;
  linkedTask: LinkedTask | null;
  currentPlant: Plant;
  garden: Plant[];
  sessionHistory: PomodoroSession[];
};

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
};

export const PLANT_STAGE_THRESHOLDS: Record<PlantStage, number> = {
  seed: 0,
  sprout: 1,
  sapling: 3,
  young: 6,
  mature: 10,
  bloom: 15,
};

export function getPlantStage(growthPoints: number): PlantStage {
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.bloom) return 'bloom';
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.mature) return 'mature';
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.young) return 'young';
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.sapling) return 'sapling';
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.sprout) return 'sprout';
  return 'seed';
}

export function createNewPlant(): Plant {
  return {
    id: crypto.randomUUID(),
    stage: 'seed',
    growthPoints: 0,
    sessionsCompleted: 0,
    createdAt: Date.now(),
    name: 'Focus Plant',
  };
}

export function createInitialPomodoroState(): PomodoroPersistedState {
  return {
    settings: DEFAULT_POMODORO_SETTINGS,
    phase: 'idle',
    remainingSeconds: DEFAULT_POMODORO_SETTINGS.focusMinutes * 60,
    isRunning: false,
    sessionsInCycle: 0,
    totalSessions: 0,
    linkedTask: null,
    currentPlant: createNewPlant(),
    garden: [],
    sessionHistory: [],
  };
}
