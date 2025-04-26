'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Clock, Sparkles, Linkedin, Github } from 'lucide-react';

interface AppHeaderProps {
  className?: string;
}

export default function AppHeader({ className }: AppHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [timeString, setTimeString] = useState('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update time
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
        'sticky top-0 z-30 transition-all duration-300 backdrop-blur-sm',
        scrolled
          ? 'shadow-md bg-white/80 dark:bg-black/80'
          : 'bg-white/95 dark:bg-black/95',
        className
      )}
    >
      <div className='flex items-center justify-between px-6 py-3'>
        <Link href='/' className='group flex items-center space-x-2'>
          <div className='relative h-10 w-10 transition-transform group-hover:rotate-12 duration-300'>
            <div className='absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-lg'></div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 40 40'
              className='h-10 w-10 relative z-10'
              aria-hidden='true'
            >
              <rect width='40' height='40' rx='8' fill='#171717' />
              <path
                fill='#ffffff'
                fillRule='evenodd'
                d='M10 30l13-23l-3-2L5 30H10Z'
                clipRule='evenodd'
                className='animate-pulse'
                style={{ animationDuration: '3s' }}
              />
              <path
                fill='#ffffff'
                fillRule='evenodd'
                d='M16.5 30H31.5L21.5 16.5l-3 5.5l3 5.5H16.5L13.5 30Z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='flex flex-col'>
            <div className='flex items-center'>
              <span className='text-xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600'>
                ChronoManager
              </span>
              <Sparkles className='h-4 w-4 ml-1 text-indigo-500 animate-pulse' />
            </div>
            <span className='text-xs text-muted-foreground leading-none'>
              Task Management
            </span>
          </div>
        </Link>

        <div className='flex items-center gap-3'>
          <div className='hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'>
            <Clock className='h-4 w-4 mr-1 text-indigo-500' />
            <span className='text-sm font-medium'>{timeString}</span>
          </div>

          <div className='flex items-center gap-4'>
            <Link
              href='https://github.com/Abdelkaderbzz/taskly/tree/develop'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
            >
              <Github className='h-5 w-5' />
              <span className='sr-only'>GitHub</span>
            </Link>
            <Link
              href='https://www.linkedin.com/in/bouzomita-abdelkader-928953234/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
            >
              <Linkedin className='h-5 w-5' />
              <span className='sr-only'>LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
    </header>
  );
}
