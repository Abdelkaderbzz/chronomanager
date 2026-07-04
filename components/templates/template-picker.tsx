'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  FolderOpen,
  LayoutList,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getTemplateStats,
  ROLE_TEMPLATES,
} from '@/lib/templates/data';
import type { RoleTemplate, TemplateId } from '@/types/templates';

interface TemplatePickerProps {
  onSelect: (templateId: TemplateId) => void;
  mode?: 'onboarding' | 'reset';
}

function TemplateCard({
  template,
  selected,
  onClick,
}: {
  template: RoleTemplate;
  selected: boolean;
  onClick: () => void;
}) {
  const stats = getTemplateStats(template);

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'group relative w-full text-left rounded-2xl border p-4 transition-all duration-300',
        'bg-card/80 backdrop-blur-sm hover:-translate-y-0.5 active:scale-[0.98]',
        selected
          ? 'border-opacity-100 shadow-lg'
          : 'border-border hover:border-muted-foreground/25'
      )}
      style={{
        borderColor: selected ? template.accent : undefined,
        boxShadow: selected ? `0 0 0 1px ${template.accent}40, 0 12px 40px -12px ${template.accent}30` : undefined,
      }}
    >
      {selected && (
        <div
          className='absolute inset-0 rounded-2xl opacity-20 pointer-events-none'
          style={{ background: `radial-gradient(circle at 30% 20%, ${template.accent}, transparent 70%)` }}
        />
      )}

      <div className='relative flex items-start gap-3'>
        <div
          className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl'
          style={{ background: template.accentMuted }}
        >
          {template.icon}
        </div>
        <div className='min-w-0 flex-1'>
          <p className='font-semibold text-[15px]'>{template.label}</p>
          <p className='text-xs text-muted-foreground mt-0.5 line-clamp-2'>{template.tagline}</p>
        </div>
      </div>

      <div className='relative mt-3 flex flex-wrap gap-1.5'>
        <Badge variant='secondary' className='text-[10px] h-5 px-1.5 gap-1'>
          <FolderOpen className='h-2.5 w-2.5' />
          {stats.folderCount}
        </Badge>
        <Badge variant='secondary' className='text-[10px] h-5 px-1.5 gap-1'>
          <LayoutList className='h-2.5 w-2.5' />
          {stats.listCount}
        </Badge>
        {stats.taskCount > 0 && (
          <Badge variant='secondary' className='text-[10px] h-5 px-1.5 gap-1'>
            <ListChecks className='h-2.5 w-2.5' />
            {stats.taskCount}
          </Badge>
        )}
      </div>
    </button>
  );
}

export function TemplatePicker({ onSelect, mode = 'onboarding' }: TemplatePickerProps) {
  const [selectedId, setSelectedId] = useState<TemplateId>('developer');
  const selected = ROLE_TEMPLATES.find((t) => t.id === selectedId) ?? ROLE_TEMPLATES[0];
  const stats = getTemplateStats(selected);

  return (
    <div className='relative min-h-[calc(100vh-57px)] overflow-hidden bg-background'>
      {/* Background atmosphere */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br to-background transition-all duration-700',
          'dark:to-[#06060c]',
          selected.gradient,
          'opacity-40 dark:opacity-60'
        )}
      />
      <div
        className='absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20 dark:opacity-30 transition-colors duration-700 pointer-events-none'
        style={{ background: selected.accent }}
      />
      <div
        className='fixed inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03] z-0'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className='relative z-10 mx-auto max-w-6xl px-4 py-10 md:py-14'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-10 md:mb-12'
        >
          <div className='inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 dark:bg-amber-400/5 dark:border-amber-400/20 px-3 py-1 text-xs text-amber-700 dark:text-amber-400/90 mb-4'>
            <Sparkles className='h-3 w-3' />
            {mode === 'onboarding' ? 'Welcome to ChronoManager' : 'Choose a new workspace'}
          </div>
          <h1 className='font-display text-3xl md:text-4xl font-bold tracking-tight'>
            What best describes you?
          </h1>
          <p className='text-muted-foreground mt-2 max-w-lg mx-auto text-sm md:text-base'>
            Pick a role template to get folders, lists, and starter tasks tailored to how you work.
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-[1fr_340px] gap-8 items-start'>
          {/* Template grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className='grid sm:grid-cols-2 gap-3'
          >
            {ROLE_TEMPLATES.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <TemplateCard
                  template={template}
                  selected={selectedId === template.id}
                  onClick={() => setSelectedId(template.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Preview panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='lg:sticky lg:top-8'
          >
            <div
              className='rounded-2xl border border-border bg-card/95 backdrop-blur-md p-6 space-y-5 shadow-sm dark:shadow-none'
              style={{ boxShadow: `0 24px 60px -20px ${selected.accent}20` }}
            >
              <AnimatePresence mode='wait'>
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className='space-y-5'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className='flex h-14 w-14 items-center justify-center rounded-2xl text-2xl'
                      style={{ background: selected.accentMuted }}
                    >
                      {selected.icon}
                    </div>
                    <div>
                      <h2 className='text-xl font-bold'>{selected.label}</h2>
                      <p className='text-sm text-muted-foreground'>{selected.tagline}</p>
                    </div>
                  </div>

                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    {selected.description}
                  </p>

                  <div className='space-y-2'>
                    <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                      Includes
                    </p>
                    <ul className='space-y-1.5'>
                      {selected.highlights.map((item) => (
                        <li
                          key={item}
                          className='flex items-center gap-2 text-sm'
                        >
                          <span
                            className='h-1.5 w-1.5 rounded-full shrink-0'
                            style={{ background: selected.accent }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='flex gap-4 pt-1 text-center'>
                    <div className='flex-1 rounded-xl bg-muted/50 border border-border py-3'>
                      <p className='text-2xl font-bold tabular-nums' style={{ color: selected.accent }}>
                        {stats.folderCount}
                      </p>
                      <p className='text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5'>
                        Folders
                      </p>
                    </div>
                    <div className='flex-1 rounded-xl bg-muted/50 border border-border py-3'>
                      <p className='text-2xl font-bold tabular-nums' style={{ color: selected.accent }}>
                        {stats.listCount}
                      </p>
                      <p className='text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5'>
                        Lists
                      </p>
                    </div>
                    <div className='flex-1 rounded-xl bg-muted/50 border border-border py-3'>
                      <p className='text-2xl font-bold tabular-nums' style={{ color: selected.accent }}>
                        {stats.taskCount}
                      </p>
                      <p className='text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5'>
                        Tasks
                      </p>
                    </div>
                  </div>

                  {/* Folder preview */}
                  <div className='rounded-xl border border-border bg-muted/40 p-3 space-y-2 max-h-36 overflow-y-auto'>
                    {selected.folders.map((folder) => (
                      <div key={folder.name} className='text-xs'>
                        <p className='font-medium flex items-center gap-1.5'>
                          <span style={{ color: folder.color }}>{folder.icon}</span>
                          {folder.name}
                        </p>
                        <div className='ml-5 mt-1 space-y-0.5 text-muted-foreground'>
                          {folder.lists.map((list) => (
                            <p key={list.name}>· {list.name}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <Button
                size='lg'
                className='w-full gap-2 font-semibold text-[#080810] hover:opacity-90 transition-opacity'
                style={{ background: selected.accent }}
                onClick={() => onSelect(selectedId)}
              >
                Start with {selected.label}
                <ArrowRight className='h-4 w-4' />
              </Button>

              {mode === 'onboarding' && (
                <p className='text-[11px] text-center text-muted-foreground'>
                  You can always export, import, or reset your workspace later in Settings.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
