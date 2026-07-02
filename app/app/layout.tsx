'use client';

import { PomodoroProvider } from '@/hooks/use-pomodoro';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PomodoroProvider>{children}</PomodoroProvider>;
}
