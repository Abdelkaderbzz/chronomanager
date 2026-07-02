'use client';

import { motion } from 'framer-motion';
import type { PlantStage } from '@/types/pomodoro';

const stageConfig: Record<
  PlantStage,
  { scale: number; potH: number; stemH: number; leaves: number; flower: boolean; color: string }
> = {
  seed: { scale: 0.55, potH: 28, stemH: 0, leaves: 0, flower: false, color: '#78716c' },
  sprout: { scale: 0.7, potH: 28, stemH: 18, leaves: 1, flower: false, color: '#84cc16' },
  sapling: { scale: 0.85, potH: 30, stemH: 32, leaves: 2, flower: false, color: '#22c55e' },
  young: { scale: 1, potH: 32, stemH: 48, leaves: 3, flower: false, color: '#16a34a' },
  mature: { scale: 1.1, potH: 34, stemH: 62, leaves: 4, flower: false, color: '#15803d' },
  bloom: { scale: 1.2, potH: 36, stemH: 70, leaves: 5, flower: true, color: '#059669' },
};

type PlantVisualProps = {
  stage: PlantStage;
  growthPoints: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function PlantVisual({
  stage,
  growthPoints,
  size = 'md',
  className = '',
}: PlantVisualProps) {
  const cfg = stageConfig[stage];
  const dims = size === 'sm' ? 80 : size === 'lg' ? 180 : 120;

  return (
    <motion.div
      className={`relative flex flex-col items-center justify-end ${className}`}
      style={{ width: dims, height: dims }}
      animate={{ scale: cfg.scale }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
    >
      <svg
        viewBox='0 0 120 120'
        className='w-full h-full drop-shadow-sm'
        aria-hidden
      >
        {/* Pot */}
        <path
          d='M35 95 L45 78 L75 78 L85 95 Z'
          fill='#92400e'
          opacity='0.9'
        />
        <rect x='42' y='72' width='36' height='8' rx='2' fill='#b45309' />
        <ellipse cx='60' cy='78' rx='22' ry='4' fill='#78350f' />

        {/* Soil */}
        <ellipse cx='60' cy='76' rx='16' ry='3' fill='#3f2e1f' />

        {/* Seed in soil for seed stage */}
        {stage === 'seed' && (
          <ellipse cx='60' cy='73' rx='5' ry='3' fill='#a8a29e' />
        )}

        {/* Stem */}
        {cfg.stemH > 0 && (
          <motion.rect
            x='58'
            width='4'
            rx='2'
            fill={cfg.color}
            initial={{ height: 0, y: 76 }}
            animate={{ height: cfg.stemH, y: 76 - cfg.stemH }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Leaves */}
        {Array.from({ length: cfg.leaves }).map((_, i) => {
          const y = 76 - cfg.stemH + 8 + i * 12;
          const side = i % 2 === 0 ? -1 : 1;
          return (
            <motion.ellipse
              key={i}
              cx={60 + side * 14}
              cy={y}
              rx='12'
              ry='6'
              fill={cfg.color}
              opacity={0.85 + i * 0.03}
              transform={`rotate(${side * 25} ${60 + side * 14} ${y})`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.08 }}
            />
          );
        })}

        {/* Bloom flower */}
        {cfg.flower && (
          <g>
            {Array.from({ length: 6 }).map((_, i) => (
              <ellipse
                key={i}
                cx={60 + Math.cos((i * Math.PI) / 3) * 10}
                cy={76 - cfg.stemH - 4 + Math.sin((i * Math.PI) / 3) * 10}
                rx='7'
                ry='4'
                fill='#fbbf24'
                opacity='0.95'
                transform={`rotate(${i * 60} ${60 + Math.cos((i * Math.PI) / 3) * 10} ${76 - cfg.stemH - 4 + Math.sin((i * Math.PI) / 3) * 10})`}
              />
            ))}
            <circle cx='60' cy={76 - cfg.stemH - 4} r='5' fill='#f59e0b' />
          </g>
        )}
      </svg>

      <div className='absolute -bottom-1 text-[10px] text-muted-foreground tabular-nums'>
        {growthPoints} sessions
      </div>
    </motion.div>
  );
}

export function GardenRow({ plants }: { plants: { id: string; stage: PlantStage; growthPoints: number; name: string }[] }) {
  if (plants.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-3 justify-center'>
      {plants.map((plant) => (
        <div key={plant.id} className='flex flex-col items-center gap-1'>
          <PlantVisual stage={plant.stage} growthPoints={plant.growthPoints} size='sm' />
          <span className='text-[10px] text-muted-foreground'>{plant.name}</span>
        </div>
      ))}
    </div>
  );
}
