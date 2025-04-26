'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  className?: string;
}

export default function AppHeader({ className }: AppHeaderProps) {
  return (
    <header className={cn('border-b px-6 py-3', className)}>
      <div className='max-w-7xl flex items-center justify-between'>
        <Link href='/' className='flex items-center space-x-2'>
          <div className='relative h-8 w-8'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 40 40'
              className='h-8 w-8'
              aria-hidden='true'
            >
              <rect width='40' height='40' rx='8' fill='#171717' />
              <path
                fill='#ffffff'
                fillRule='evenodd'
                d='M10 30l13-23l-3-2L5 30H10Z'
                clipRule='evenodd'
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
            <span className='text-xl font-bold leading-tight'>
              ChronoManager
            </span>
            <span className='text-xs text-muted-foreground leading-none'>
              Task Management
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
