'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePomodoro } from '@/hooks/use-pomodoro';
import { PomodoroPanel } from '@/components/pomodoro/pomodoro-panel';
import { PlantVisual } from '@/components/pomodoro/plant-visual';
import { Timer } from 'lucide-react';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PomodoroWidget() {
  const {
    panelOpen,
    setPanelOpen,
    phase,
    remainingSeconds,
    isRunning,
    currentPlant,
  } = usePomodoro();

  const isActive = phase !== 'idle' || isRunning;

  return (
    <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={`gap-2 h-9 rounded-full border-zinc-700/50 ${
            isActive ? 'border-amber-400/40 bg-amber-400/5' : ''
          }`}
        >
          <div className='scale-[0.35] -my-4 -mr-2 -ml-1 pointer-events-none'>
            <PlantVisual
              stage={currentPlant.stage}
              growthPoints={currentPlant.growthPoints}
              size='sm'
            />
          </div>
          <Timer className={`h-3.5 w-3.5 ${isActive ? 'text-amber-500' : ''}`} />
          <span className='tabular-nums text-xs font-medium hidden sm:inline'>
            {isActive ? formatTime(remainingSeconds) : 'Focus'}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className='w-full sm:max-w-md overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Timer className='h-5 w-5 text-amber-500' />
            Pomodoro Focus
          </SheetTitle>
        </SheetHeader>
        <div className='mt-6'>
          <PomodoroPanel compact />
        </div>
      </SheetContent>
    </Sheet>
  );
}
