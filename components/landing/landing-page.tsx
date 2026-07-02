'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CheckSquare,
  Clock,
  FolderOpen,
  Kanban,
  Moon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted || !now) {
    return <ClockPlaceholder />;
  }

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  const timeLabel = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const dateLabel = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className='flex flex-col items-center gap-5'>
      {/* Analog clock */}
      <div className='relative w-52 h-52 md:w-56 md:h-56'>
        <div className='absolute inset-0 rounded-full bg-[#12121a] border border-zinc-700/80 shadow-2xl shadow-amber-400/10'>
          <div className='absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/8 via-transparent to-teal-400/5' />

          {/* Hour markers */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className='absolute left-1/2 top-1/2 h-[88px] w-0 origin-bottom'
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div
                className={`mx-auto rounded-full ${i % 3 === 0 ? 'w-1.5 h-1.5 bg-amber-400/80' : 'w-1 h-1 bg-zinc-600'}`}
              />
            </div>
          ))}

          {/* Clock hands */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div
              className='absolute w-1 h-14 md:h-16 bg-amber-400/90 origin-bottom bottom-1/2 rounded-full shadow-sm'
              style={{ transform: `rotate(${hourAngle}deg)` }}
            />
            <div
              className='absolute w-0.5 h-[4.5rem] md:h-20 bg-teal-400/80 origin-bottom bottom-1/2 rounded-full'
              style={{ transform: `rotate(${minuteAngle}deg)` }}
            />
            <div
              className='absolute w-px h-[4.5rem] md:h-20 bg-red-400/70 origin-bottom bottom-1/2 rounded-full'
              style={{ transform: `rotate(${secondAngle}deg)` }}
            />
            <div className='absolute w-3 h-3 rounded-full bg-amber-400 border-2 border-[#12121a] z-10' />
          </div>
        </div>

        {/* Orbit rings — static, clearer contrast */}
        <div className='absolute -inset-6 rounded-full border border-dashed border-amber-400/25 pointer-events-none' />
        <div className='absolute -inset-12 rounded-full border border-dashed border-teal-400/20 pointer-events-none' />
      </div>

      {/* Digital readout — outside the dial so nothing clips */}
      <div className='text-center space-y-1'>
        <div
          className='font-mono text-2xl md:text-3xl font-medium text-amber-400 tabular-nums tracking-wide'
          suppressHydrationWarning
        >
          {timeLabel}
        </div>
        <div
          className='text-xs text-zinc-500 tracking-widest uppercase'
          suppressHydrationWarning
        >
          {dateLabel}
        </div>
      </div>
    </div>
  );
}

function ClockPlaceholder() {
  return (
    <div className='flex flex-col items-center gap-5'>
      <div className='relative w-52 h-52 md:w-56 md:h-56'>
        <div className='absolute inset-0 rounded-full bg-[#12121a] border border-zinc-700/80 animate-pulse' />
        <div className='absolute -inset-6 rounded-full border border-dashed border-amber-400/10 pointer-events-none' />
        <div className='absolute -inset-12 rounded-full border border-dashed border-teal-400/10 pointer-events-none' />
      </div>
      <div className='text-center space-y-1'>
        <div className='h-8 w-28 rounded bg-zinc-800/60 animate-pulse mx-auto' />
        <div className='h-3 w-36 rounded bg-zinc-800/40 animate-pulse mx-auto' />
      </div>
    </div>
  );
}

function OrbitTask({
  label,
  angle,
  radius,
  delay,
}: {
  label: string;
  angle: number;
  radius: number;
  delay: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <div
      className='absolute left-1/2 top-[42%] z-20'
      style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
        transition={{
          opacity: { delay, duration: 0.4 },
          scale: { delay, duration: 0.4 },
          y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        className='px-3 py-2 rounded-xl bg-[#12121a]/95 border border-zinc-700/80 text-xs text-zinc-200 backdrop-blur-md shadow-xl whitespace-nowrap'
      >
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-teal-400 shrink-0' />
          {label}
        </div>
      </motion.div>
    </div>
  );
}

function HeroClockVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='relative flex items-center justify-center w-full max-w-[420px] mx-auto aspect-square'>
        <ClockPlaceholder />
      </div>
    );
  }

  return (
    <div className='relative flex items-center justify-center w-full max-w-[420px] mx-auto aspect-square'>
      {/* Soft glow behind */}
      <div className='absolute inset-8 rounded-full bg-amber-400/5 blur-3xl' />

      {/* Task cards — placed on outer ring, away from the dial */}
      <OrbitTask label='Design review' angle={-130} radius={168} delay={0.3} />
      <OrbitTask label='Ship feature' angle={-20} radius={175} delay={0.5} />
      <OrbitTask label='Team sync' angle={170} radius={168} delay={0.7} />

      <LiveClock />
    </div>
  );
}

const features = [
  {
    icon: Kanban,
    title: 'Kanban Boards',
    description:
      'Drag tasks across custom columns. Build workflows that match how you actually work.',
    accent: '#00d4aa',
  },
  {
    icon: BarChart3,
    title: 'Priority Matrix',
    description:
      'See urgency at a glance. Sort and filter by priority to focus on what matters most.',
    accent: '#f5a623',
  },
  {
    icon: CheckSquare,
    title: 'Checklist View',
    description:
      'Simple, satisfying check-offs for errands, shopping lists, and quick wins.',
    accent: '#7c6af7',
  },
  {
    icon: FolderOpen,
    title: 'Folder Hierarchy',
    description:
      'Organize projects into folders and lists. Favorites keep your go-tos one click away.',
    accent: '#ff6b6b',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description:
      'Easy on the eyes, day or night. Toggle themes without losing your flow.',
    accent: '#a78bfa',
  },
  {
    icon: Zap,
    title: 'Instant Search',
    description:
      'Press ⌘K to find any task across all folders. No more hunting through lists.',
    accent: '#34d399',
  },
];

const stats = [
  { value: '3', label: 'Powerful views' },
  { value: '∞', label: 'Folders & lists' },
  { value: '0ms', label: 'Cloud latency' },
  { value: '100%', label: 'Your data, local' },
];

export default function LandingPage() {
  return (
    <div className='landing-page min-h-screen bg-[#080810] text-[#f0ede6] overflow-x-hidden'>
      {/* Grain overlay */}
      <div
        className='fixed inset-0 pointer-events-none z-50 opacity-[0.035]'
        suppressHydrationWarning
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow */}
      <div className='fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] pointer-events-none' />
      <div className='fixed bottom-0 right-0 w-[600px] h-[400px] bg-teal-500/5 blur-[100px] pointer-events-none' />

      {/* Navigation */}
      <nav className='relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto'>
        <Link href='/' className='flex items-center gap-3 group'>
          <div className='relative w-9 h-9'>
            <div className='absolute inset-0 rounded-lg bg-amber-400/20 rotate-6 group-hover:rotate-12 transition-transform duration-300' />
            <div className='relative w-9 h-9 rounded-lg bg-[#12121a] border border-amber-400/30 flex items-center justify-center'>
              <Clock className='w-4 h-4 text-amber-400' />
            </div>
          </div>
          <span className='font-display text-lg font-bold tracking-tight'>
            Chrono<span className='text-amber-400'>Manager</span>
          </span>
        </Link>

        <div className='hidden md:flex items-center gap-8 text-sm text-zinc-400'>
          <a href='#features' className='hover:text-amber-400 transition-colors'>
            Features
          </a>
          <a href='#how-it-works' className='hover:text-amber-400 transition-colors'>
            How it works
          </a>
        </div>

        <div className='flex items-center gap-3'>
          <Link href='/app'>
            <Button
              variant='ghost'
              className='text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 hidden sm:flex'
            >
              Open App
            </Button>
          </Link>
          <Link href='/app'>
            <Button className='bg-amber-400 text-[#080810] hover:bg-amber-300 font-semibold rounded-full px-5'>
              Get Started
              <ArrowRight className='w-4 h-4 ml-1' />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className='relative z-10 px-6 md:px-12 pt-12 pb-24 max-w-7xl mx-auto'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-8 items-center'>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs font-medium mb-8'>
              <Sparkles className='w-3 h-3' />
              Free &amp; open source task management
            </div>

            <h1 className='font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6'>
              Master your{' '}
              <span className='relative inline-block'>
                <span className='text-amber-400'>time</span>
                <svg
                  className='absolute -bottom-1 left-0 w-full'
                  height='8'
                  viewBox='0 0 200 8'
                  fill='none'
                >
                  <path
                    d='M1 5.5C40 1.5 80 1.5 120 5.5C160 9.5 180 3.5 199 5.5'
                    stroke='#f5a623'
                    strokeWidth='2'
                    strokeLinecap='round'
                    opacity='0.6'
                  />
                </svg>
              </span>
              ,<br />
              command your tasks.
            </h1>

            <p className='text-lg text-zinc-400 leading-relaxed max-w-lg mb-10'>
              ChronoManager turns scattered to-dos into organized momentum.
              Folders, kanban boards, and priority views — all stored locally,
              always under your control.
            </p>

            <div className='flex flex-wrap items-center gap-4'>
              <Link href='/app'>
                <Button
                  size='lg'
                  className='bg-amber-400 text-[#080810] hover:bg-amber-300 font-semibold rounded-full px-8 h-12 text-base'
                >
                  Start organizing
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </Link>
              <a href='#features'>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 hover:text-amber-400 rounded-full px-8 h-12 text-base'
                >
                  Explore features
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Clock visual */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className='relative flex items-center justify-center min-h-[420px] lg:min-h-[480px]'
          >
            <HeroClockVisual />
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className='relative z-10 border-y border-zinc-800/60 bg-[#0c0c14]/80 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-8'>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className='text-center'
            >
              <div className='font-display text-3xl md:text-4xl font-bold text-amber-400 mb-1'>
                {stat.value}
              </div>
              <div className='text-sm text-zinc-500'>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id='features' className='relative z-10 px-6 md:px-12 py-24 max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='font-display text-3xl md:text-5xl font-bold mb-4'>
            Everything you need,{' '}
            <span className='text-teal-400'>nothing you don&apos;t</span>
          </h2>
          <p className='text-zinc-400 max-w-xl mx-auto'>
            Built for people who want powerful organization without the bloat of
            enterprise tools.
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className='group relative p-6 rounded-2xl bg-[#0c0c14] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1'
            >
              <div
                className='w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110'
                style={{ backgroundColor: `${feature.accent}15` }}
              >
                <feature.icon
                  className='w-5 h-5'
                  style={{ color: feature.accent }}
                />
              </div>
              <h3 className='font-display text-lg font-semibold mb-2'>
                {feature.title}
              </h3>
              <p className='text-sm text-zinc-400 leading-relaxed'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id='how-it-works'
        className='relative z-10 px-6 md:px-12 py-24 bg-[#0c0c14]/50 border-y border-zinc-800/60'
      >
        <div className='max-w-7xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='font-display text-3xl md:text-5xl font-bold mb-4'>
              Up and running in{' '}
              <span className='text-amber-400'>seconds</span>
            </h2>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8 md:gap-12'>
            {[
              {
                step: '01',
                title: 'Create folders',
                desc: 'Group your projects — Work, Personal, Side Projects — each with its own color and icon.',
              },
              {
                step: '02',
                title: 'Add lists & tasks',
                desc: 'Break folders into focused lists. Add tasks with priorities, due dates, and descriptions.',
              },
              {
                step: '03',
                title: 'Pick your view',
                desc: 'Switch between Kanban, Checklist, or Priority table — per list, on the fly.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className='relative'
              >
                <div className='font-display text-6xl font-bold text-zinc-800 mb-4'>
                  {item.step}
                </div>
                <h3 className='font-display text-xl font-semibold mb-2'>
                  {item.title}
                </h3>
                <p className='text-zinc-400 text-sm leading-relaxed'>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='relative z-10 px-6 md:px-12 py-24 max-w-7xl mx-auto text-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className='relative rounded-3xl overflow-hidden p-12 md:p-16'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-teal-400/10' />
          <div className='absolute inset-0 border border-zinc-800 rounded-3xl' />

          <div className='relative'>
            <h2 className='font-display text-3xl md:text-5xl font-bold mb-4'>
              Your time is finite.
              <br />
              <span className='text-amber-400'>Make it count.</span>
            </h2>
            <p className='text-zinc-400 mb-8 max-w-md mx-auto'>
              No sign-up. No subscription. Just open the app and start
              organizing.
            </p>
            <Link href='/app'>
              <Button
                size='lg'
                className='bg-amber-400 text-[#080810] hover:bg-amber-300 font-semibold rounded-full px-10 h-14 text-base'
              >
                Launch ChronoManager
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 border-t border-zinc-800/60 px-6 md:px-12 py-8'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500'>
          <div className='flex items-center gap-2'>
            <Clock className='w-4 h-4 text-amber-400/60' />
            <span>
              ChronoManager &mdash; {new Date().getFullYear()}
            </span>
          </div>
          <div className='flex items-center gap-6'>
            <Link href='/app' className='hover:text-amber-400 transition-colors'>
              Open App
            </Link>
            <a
              href='https://abdelkader.work'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-amber-400 transition-colors'
            >
              abdelkader.work
            </a>
            <a
              href='https://github.com/Abdelkaderbzz/taskly/tree/develop'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-amber-400 transition-colors'
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
