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

export const PLANT_STAGE_LABELS: Record<
  PlantStage,
  { label: string; emoji: string }
> = {
  seed: { label: 'Seed', emoji: '🌰' },
  sprout: { label: 'Sprout', emoji: '🌱' },
  sapling: { label: 'Sapling', emoji: '🪴' },
  young: { label: 'Young tree', emoji: '🌿' },
  mature: { label: 'Mature tree', emoji: '🌳' },
  bloom: { label: 'Full bloom', emoji: '🌸' },
};

const STAGE_ORDER: PlantStage[] = [
  'seed',
  'sprout',
  'sapling',
  'young',
  'mature',
  'bloom',
];

export function getPlantStage(growthPoints: number): PlantStage {
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.bloom) return 'bloom';
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.mature) return 'mature';
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.young) return 'young';
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.sapling) return 'sapling';
  if (growthPoints >= PLANT_STAGE_THRESHOLDS.sprout) return 'sprout';
  return 'seed';
}

export function getNextStageProgress(growthPoints: number): {
  current: PlantStage;
  next: PlantStage | null;
  progress: number;
  remaining: number;
} {
  const current = getPlantStage(growthPoints);
  const currentIndex = STAGE_ORDER.indexOf(current);
  const next = STAGE_ORDER[currentIndex + 1] ?? null;

  if (!next) {
    return { current, next: null, progress: 100, remaining: 0 };
  }

  const currentThreshold = PLANT_STAGE_THRESHOLDS[current];
  const nextThreshold = PLANT_STAGE_THRESHOLDS[next];
  const progress = Math.round(
    ((growthPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  );
  const remaining = nextThreshold - growthPoints;

  return { current, next, progress: Math.min(100, Math.max(0, progress)), remaining };
}

/** Visual metrics that grow smoothly with every pomodoro session */
export function getPlantVisualMetrics(growthPoints: number) {
  const stage = getPlantStage(growthPoints);
  const stemH = growthPoints === 0 ? 0 : Math.min(8 + growthPoints * 4.8, 78);
  const leafCount = growthPoints === 0 ? 0 : Math.min(2 + Math.floor(growthPoints * 1.2), 14);
  const branchCount = Math.max(0, Math.min(Math.floor((growthPoints - 3) / 2), 4));
  const flowerPetals =
    growthPoints >= PLANT_STAGE_THRESHOLDS.bloom
      ? 8
      : growthPoints >= 12
        ? 4 + (growthPoints - 12)
        : 0;
  const glow = Math.min(growthPoints / PLANT_STAGE_THRESHOLDS.bloom, 1);
  const scale = 0.62 + Math.min(growthPoints * 0.045, 0.85);
  const leafColor =
    growthPoints >= PLANT_STAGE_THRESHOLDS.mature
      ? '#059669'
      : growthPoints >= PLANT_STAGE_THRESHOLDS.young
        ? '#16a34a'
        : growthPoints >= PLANT_STAGE_THRESHOLDS.sapling
          ? '#22c55e'
          : '#84cc16';

  return { stage, stemH, leafCount, branchCount, flowerPetals, glow, scale, leafColor };
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
