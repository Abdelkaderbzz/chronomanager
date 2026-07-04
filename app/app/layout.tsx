import { PomodoroAppProvider } from '@/components/pomodoro/pomodoro-app-provider';
import { appMetadata } from '@/lib/site-config';

export const metadata = appMetadata;

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PomodoroAppProvider>{children}</PomodoroAppProvider>;
}
