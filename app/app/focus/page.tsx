'use client';

import Link from 'next/link';
import AppHeader from '@/components/app-header';
import AnimatedBackground from '@/components/animated-background';
import { PomodoroWidget } from '@/components/pomodoro/pomodoro-widget';
import { PomodoroPanel } from '@/components/pomodoro/pomodoro-panel';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FocusPage() {
  return (
    <>
      <AnimatedBackground />
      <AppHeader>
        <PomodoroWidget />
      </AppHeader>
      <div className='min-h-[calc(100vh-57px)] bg-gradient-to-b from-background to-muted/20'>
        <div className='max-w-lg mx-auto px-6 py-10'>
          <div className='flex items-center justify-between mb-8'>
            <Link href='/app'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='h-4 w-4 mr-1.5' />
                Back to app
              </Button>
            </Link>
          </div>

          <div className='text-center mb-8'>
            <h1 className='text-2xl font-display font-bold'>Focus Mode</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Stay in the zone. Grow your plant with every completed session.
            </p>
          </div>

          <div className='rounded-2xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm'>
            <PomodoroPanel />
          </div>
        </div>
      </div>
    </>
  );
}
