'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Clock, Sparkles, Linkedin, Github } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface AppHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export default function AppHeader({ className, children }: AppHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 transition-all duration-300 backdrop-blur-sm border-b border-transparent',
        scrolled
          ? 'shadow-md bg-white/80 dark:bg-zinc-950/80 border-border/50'
          : 'bg-white/95 dark:bg-zinc-950/95',
        className
      )}
    >
      <div className='flex items-center justify-between px-4 md:px-6 py-2.5 gap-4'>
        <Link href='/app' className='group flex items-center space-x-2 shrink-0'>
          <div className='relative h-9 w-9 transition-transform group-hover:rotate-12 duration-300'>
            <div className='absolute inset-0 bg-gradient-to-br from-amber-400 to-teal-400 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-lg opacity-80' />
            <div className='absolute inset-0 rounded-lg bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center'>
              <Clock className='h-4 w-4 text-amber-400' />
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='flex items-center'>
              <span className='text-lg font-display font-bold leading-tight'>
                Chrono<span className='text-amber-500'>Manager</span>
              </span>
              <Sparkles className='h-3.5 w-3.5 ml-1 text-amber-400 animate-pulse' />
            </div>
            <span className='text-[10px] text-muted-foreground leading-none hidden sm:block'>
              Task Management
            </span>
          </div>
        </Link>

        <div className='flex items-center gap-1 md:gap-2 flex-1 justify-end'>
          {children}

          <div className='hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-muted text-muted-foreground'>
            <Clock className='h-3.5 w-3.5 mr-1 text-amber-500' />
            <span className='text-sm font-medium tabular-nums'>{timeString}</span>
          </div>

          <ThemeToggle />

          <div className='flex items-center gap-3 ml-1'>
            <Link
              href='https://github.com/Abdelkaderbzz/taskly/tree/develop'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-amber-500 transition-colors'
            >
              <Github className='h-4 w-4' />
              <span className='sr-only'>GitHub</span>
            </Link>
            <Link
              href='https://www.linkedin.com/in/bouzomita-abdelkader-928953234/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-amber-500 transition-colors'
            >
              <Linkedin className='h-4 w-4' />
              <span className='sr-only'>LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
