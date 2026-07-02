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
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className='font-mono text-right'>
      <div className='text-3xl md:text-4xl font-light tracking-widest text-amber-400 tabular-nums'>
        {time}
      </div>
      <div className='text-xs text-zinc-500 mt-1 tracking-wide uppercase'>
        {date}
      </div>
    </div>
  );
}

function OrbitRing({
  size,
  duration,
  delay,
  color,
}: {
  size: number;
  duration: number;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      className='absolute rounded-full border border-dashed opacity-30'
      style={{
        width: size,
        height: size,
        borderColor: color,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    />
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
            initial={{ opacity: 0, y: 30 }}
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className='relative flex items-center justify-center h-[400px] lg:h-[480px]'
          >
            <div className='relative w-72 h-72 md:w-80 md:h-80'>
              <OrbitRing size={320} duration={60} delay={0} color='#f5a623' />
              <OrbitRing size={260} duration={45} delay={5} color='#00d4aa' />
              <OrbitRing size={200} duration={30} delay={2} color='#7c6af7' />

              {/* Center clock face */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-36 h-36 md:w-44 md:h-44 rounded-full bg-[#12121a] border border-zinc-800 shadow-2xl shadow-amber-400/10 flex flex-col items-center justify-center relative overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent' />
                  <LiveClock />

                  {/* Clock hands decoration */}
                  <motion.div
                    className='absolute w-0.5 h-12 bg-amber-400/60 origin-bottom bottom-1/2 rounded-full'
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className='absolute w-0.5 h-8 bg-teal-400/60 origin-bottom bottom-1/2 rounded-full'
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3600, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>

              {/* Floating task cards */}
              {[
                { label: 'Design review', x: -120, y: -60, delay: 0.4 },
                { label: 'Ship feature', x: 100, y: -80, delay: 0.6 },
                { label: 'Team sync', x: -100, y: 80, delay: 0.8 },
              ].map((card) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: card.delay, duration: 0.5 }}
                  className='absolute px-3 py-2 rounded-lg bg-[#12121a]/90 border border-zinc-800 text-xs text-zinc-300 backdrop-blur-sm shadow-lg'
                  style={{ left: `calc(50% + ${card.x}px)`, top: `calc(50% + ${card.y}px)` }}
                >
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-teal-400' />
                    {card.label}
                  </div>
                </motion.div>
              ))}
            </div>
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
