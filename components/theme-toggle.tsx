'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='h-9 w-9' disabled>
        <Sun className='h-4 w-4' />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant='ghost'
      size='icon'
      className='h-9 w-9 text-muted-foreground hover:text-foreground'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label='Toggle theme'
    >
      {isDark ? (
        <Sun className='h-4 w-4' />
      ) : (
        <Moon className='h-4 w-4' />
      )}
    </Button>
  );
}
