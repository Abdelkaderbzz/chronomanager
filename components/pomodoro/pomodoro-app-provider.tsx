'use client';

import { PomodoroProvider } from '@/hooks/use-pomodoro';

export function PomodoroAppProvider({ children }: { children: React.ReactNode }) {
  return <PomodoroProvider>{children}</PomodoroProvider>;
}
