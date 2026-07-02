'use client';

import { Button } from '@/components/ui/button';
import { usePomodoro } from '@/hooks/use-pomodoro';
import type { LinkedTask } from '@/types/pomodoro';
import { Timer } from 'lucide-react';

type TaskFocusButtonProps = {
  task: LinkedTask;
  size?: 'icon' | 'sm';
};

export function TaskFocusButton({ task, size = 'icon' }: TaskFocusButtonProps) {
  const { startFocus, linkedTask, phase, isRunning } = usePomodoro();

  const isActive =
    linkedTask?.taskId === task.taskId && phase === 'focus' && isRunning;

  if (size === 'sm') {
    return (
      <Button
        variant={isActive ? 'default' : 'outline'}
        size='sm'
        className={
          isActive
            ? 'bg-amber-400 text-[#080810] hover:bg-amber-300'
            : 'text-xs'
        }
        onClick={() => startFocus(task)}
      >
        <Timer className='h-3 w-3 mr-1' />
        {isActive ? 'Focusing…' : 'Focus'}
      </Button>
    );
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className={`h-6 w-6 ${isActive ? 'text-amber-500' : ''}`}
      title='Start pomodoro for this task'
      onClick={() => startFocus(task)}
    >
      <Timer className='h-3 w-3' />
    </Button>
  );
}
