'use client';

import { motion } from 'framer-motion';
import {
  getPlantVisualMetrics,
  getNextStageProgress,
  PLANT_STAGE_LABELS,
  type PlantStage,
} from '@/types/pomodoro';

type PlantVisualProps = {
  stage: PlantStage;
  growthPoints: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
};

export function PlantVisual({
  stage,
  growthPoints,
  size = 'md',
  className = '',
  showLabel = true,
}: PlantVisualProps) {
  const metrics = getPlantVisualMetrics(growthPoints);
  const dims = size === 'sm' ? 96 : size === 'lg' ? 220 : 140;
  const stageInfo = PLANT_STAGE_LABELS[stage];
  const topY = 76 - metrics.stemH;

  return (
    <motion.div
      className={`relative flex flex-col items-center justify-end ${className}`}
      style={{ width: dims, height: dims + 20 }}
      animate={{ scale: metrics.scale }}
      transition={{ type: 'spring', stiffness: 100, damping: 12 }}
    >
      {/* Ambient glow — stronger with more sessions */}
      {metrics.glow > 0.15 && (
        <motion.div
          className='absolute inset-4 rounded-full blur-2xl pointer-events-none'
          style={{
            background: `radial-gradient(circle, rgba(251,191,36,${metrics.glow * 0.35}) 0%, rgba(45,212,191,${metrics.glow * 0.15}) 50%, transparent 70%)`,
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <svg viewBox='0 0 120 140' className='w-full h-full drop-shadow-md' aria-hidden>
        {/* Ground shadow */}
        <ellipse cx='60' cy='118' rx='28' ry='4' fill='#000' opacity='0.12' />

        {/* Pot — grows slightly with plant */}
        <path d='M32 98 L44 76 L76 76 L88 98 Z' fill='#92400e' />
        <path d='M36 98 L46 80 L74 80 L84 98 Z' fill='#b45309' opacity='0.9' />
        <rect x='40' y='74' width='40' height='9' rx='2' fill='#d97706' />
        <ellipse cx='60' cy='78' rx='24' ry='4' fill='#78350f' />
        {growthPoints >= 6 && (
          <rect x='38' y='88' width='44' height='3' rx='1' fill='#fbbf24' opacity='0.5' />
        )}

        {/* Soil */}
        <ellipse cx='60' cy='76' rx='18' ry='3.5' fill='#3f2e1f' />

        {/* Seed */}
        {growthPoints === 0 && (
          <ellipse cx='60' cy='73' rx='6' ry='3.5' fill='#a8a29e' />
        )}

        {/* Branches */}
        {Array.from({ length: metrics.branchCount }).map((_, i) => {
          const branchY = topY + 12 + i * 14;
          const side = i % 2 === 0 ? -1 : 1;
          return (
            <line
              key={`branch-${i}`}
              x1='60'
              y1={branchY}
              x2={60 + side * (14 + i * 2)}
              y2={branchY - 8}
              stroke={metrics.leafColor}
              strokeWidth='2.5'
              strokeLinecap='round'
            />
          );
        })}

        {/* Main stem */}
        {metrics.stemH > 0 && (
          <motion.rect
            x='57.5'
            width='5'
            rx='2.5'
            fill={`url(#stemGrad-${growthPoints})`}
            initial={{ height: 0, y: 76 }}
            animate={{ height: metrics.stemH, y: topY }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}

        <defs>
          <linearGradient id={`stemGrad-${growthPoints}`} x1='0' y1='1' x2='0' y2='0'>
            <stop offset='0%' stopColor='#166534' />
            <stop offset='100%' stopColor={metrics.leafColor} />
          </linearGradient>
        </defs>

        {/* Leaves — more leaves with each session */}
        {Array.from({ length: metrics.leafCount }).map((_, i) => {
          const t = i / Math.max(metrics.leafCount - 1, 1);
          const y = topY + 6 + t * (metrics.stemH * 0.75);
          const side = i % 2 === 0 ? -1 : 1;
          const leafW = 8 + Math.min(growthPoints * 0.4, 8);
          const leafH = 4 + Math.min(growthPoints * 0.2, 4);
          return (
            <motion.ellipse
              key={`leaf-${i}`}
              cx={60 + side * (10 + (i % 3) * 2)}
              cy={y}
              rx={leafW}
              ry={leafH}
              fill={metrics.leafColor}
              opacity={0.75 + (i / metrics.leafCount) * 0.25}
              transform={`rotate(${side * (20 + i * 5)} ${60 + side * 10} ${y})`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
            />
          );
        })}

        {/* Flower bud → full bloom */}
        {metrics.flowerPetals > 0 && (
          <g>
            {Array.from({ length: metrics.flowerPetals }).map((_, i) => {
              const angle = (i * 360) / metrics.flowerPetals;
              const rad = (angle * Math.PI) / 180;
              const dist = metrics.flowerPetals >= 8 ? 14 : 8;
              const cx = 60 + Math.cos(rad) * dist;
              const cy = topY - 6 + Math.sin(rad) * dist;
              const colors = ['#fbbf24', '#f59e0b', '#fb923c', '#fde68a'];
              return (
                <motion.ellipse
                  key={`petal-${i}`}
                  cx={cx}
                  cy={cy}
                  rx={metrics.flowerPetals >= 8 ? 7 : 5}
                  ry={metrics.flowerPetals >= 8 ? 4 : 3}
                  fill={colors[i % colors.length]}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.04, type: 'spring' }}
                  transform={`rotate(${angle} ${cx} ${cy})`}
                />
              );
            })}
            <circle cx='60' cy={topY - 6} r={metrics.flowerPetals >= 8 ? 6 : 4} fill='#ea580c' />
          </g>
        )}

        {/* Sparkles at high growth */}
        {growthPoints >= 10 &&
          Array.from({ length: Math.min(growthPoints - 9, 6) }).map((_, i) => {
            const angles = [30, 80, 140, 220, 280, 330];
            const rad = (angles[i] * Math.PI) / 180;
            const r = 38 + (i % 2) * 8;
            return (
              <motion.circle
                key={`spark-${i}`}
                cx={60 + Math.cos(rad) * r}
                cy={topY - 10 + Math.sin(rad) * r * 0.6}
                r='1.5'
                fill='#fde68a'
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            );
          })}
      </svg>

      {showLabel && (
        <div className='absolute -bottom-0 text-center'>
          <p className='text-xs font-medium capitalize'>
            {stageInfo.emoji} {stageInfo.label}
          </p>
          <p className='text-[10px] text-muted-foreground tabular-nums'>
            {growthPoints} pomodoro{growthPoints === 1 ? '' : 's'}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export function PlantGrowthBar({ growthPoints }: { growthPoints: number }) {
  const { current, next, progress, remaining } = getNextStageProgress(growthPoints);
  const currentInfo = PLANT_STAGE_LABELS[current];

  if (!next) {
    return (
      <div className='w-full max-w-xs space-y-1.5'>
        <div className='flex justify-between text-xs'>
          <span className='font-medium'>{currentInfo.emoji} Full bloom reached!</span>
        </div>
        <div className='h-2 rounded-full bg-amber-400/30 overflow-hidden'>
          <div className='h-full w-full bg-gradient-to-r from-amber-400 to-teal-400' />
        </div>
      </div>
    );
  }

  const nextInfo = PLANT_STAGE_LABELS[next];

  return (
    <div className='w-full max-w-xs space-y-1.5'>
      <div className='flex justify-between text-xs text-muted-foreground'>
        <span className='font-medium text-foreground'>
          {currentInfo.emoji} {currentInfo.label}
        </span>
        <span>
          {remaining} to {nextInfo.emoji} {nextInfo.label}
        </span>
      </div>
      <div className='h-2 rounded-full bg-muted overflow-hidden'>
        <motion.div
          className='h-full bg-gradient-to-r from-emerald-500 to-amber-400'
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}

export function GardenRow({
  plants,
}: {
  plants: { id: string; stage: PlantStage; growthPoints: number; name: string }[];
}) {
  if (plants.length === 0) return null;

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
      {plants.map((plant) => (
        <motion.div
          key={plant.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-center gap-2 rounded-xl border bg-gradient-to-b from-amber-400/5 to-teal-400/5 p-3'
        >
          <PlantVisual
            stage={plant.stage}
            growthPoints={plant.growthPoints}
            size='md'
            showLabel={false}
          />
          <div className='text-center'>
            <p className='text-xs font-medium'>{plant.name}</p>
            <p className='text-[10px] text-muted-foreground capitalize'>
              {PLANT_STAGE_LABELS[plant.stage].emoji}{' '}
              {PLANT_STAGE_LABELS[plant.stage].label} · {plant.growthPoints} sessions
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
