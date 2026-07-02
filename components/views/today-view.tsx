'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CalendarRange,
  Clock,
  Menu,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import type { Folder, Task } from '@/types/types';
import {
  flattenTasksWithContext,
  formatDueLabel,
  getDoneStatusId,
  getTodoStatusId,
  groupTasksByDueDate,
  type TaskWithContext,
} from '@/lib/task-dates';
import { TaskFocusButton } from '@/components/pomodoro/task-focus-button';
import { cn } from '@/lib/utils';

interface TodayViewProps {
  folders: Folder[];
  onUpdateTask: (folderId: string, listId: string, task: Task) => void;
  onNavigateToTask: (folderId: string, listId: string, taskId: string) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const priorityStyles: Record<string, string> = {
  high: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  medium: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  low: 'border-slate-500/20 bg-slate-500/10 text-muted-foreground',
};

function TaskRow({
  item,
  onToggleDone,
  onNavigate,
  accent,
}: {
  item: TaskWithContext;
  onToggleDone: (item: TaskWithContext) => void;
  onNavigate: (item: TaskWithContext) => void;
  accent?: 'overdue' | 'today' | 'default';
}) {
  const { task, folderName, folderColor, listName } = item;

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-lg border bg-card/60 p-3 transition-colors hover:bg-card',
        accent === 'overdue' && 'border-red-500/20',
        accent === 'today' && 'border-primary/20'
      )}
    >
      <Checkbox
        checked={false}
        onCheckedChange={() => onToggleDone(item)}
        className='mt-0.5'
        aria-label={`Mark "${task.title}" as done`}
      />
      <div className='min-w-0 flex-1 space-y-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <p className='font-medium leading-snug'>{task.title}</p>
          <Badge
            variant='outline'
            className={cn('text-[10px] capitalize', priorityStyles[task.priority])}
          >
            {task.priority}
          </Badge>
        </div>
        {task.description ? (
          <p className='line-clamp-1 text-sm text-muted-foreground'>{task.description}</p>
        ) : null}
        <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground'>
          <span style={{ color: folderColor }} className='font-medium'>
            {folderName}
          </span>
          <span>·</span>
          <span>{listName}</span>
          {task.dueDate ? (
            <>
              <span>·</span>
              <span
                className={cn(
                  accent === 'overdue' && 'font-medium text-red-600 dark:text-red-400'
                )}
              >
                {formatDueLabel(task.dueDate)}
              </span>
            </>
          ) : null}
        </div>
      </div>
      <div className='flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100'>
        <TaskFocusButton
          task={{
            taskId: task.id,
            taskTitle: task.title,
            folderId: item.folderId,
            listId: item.listId,
          }}
        />
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8'
          title='Open in list'
          onClick={() => onNavigate(item)}
        >
          <ArrowRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

function TaskSection({
  title,
  icon: Icon,
  items,
  emptyMessage,
  onToggleDone,
  onNavigate,
  accent,
}: {
  title: string;
  icon: LucideIcon;
  items: TaskWithContext[];
  emptyMessage?: string;
  onToggleDone: (item: TaskWithContext) => void;
  onNavigate: (item: TaskWithContext) => void;
  accent?: 'overdue' | 'today' | 'default';
}) {
  if (items.length === 0 && !emptyMessage) return null;

  return (
    <section className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Icon
          className={cn(
            'h-4 w-4',
            accent === 'overdue' && 'text-red-500',
            accent === 'today' && 'text-primary'
          )}
        />
        <h3 className='text-sm font-semibold tracking-wide uppercase text-muted-foreground'>
          {title}
        </h3>
        <Badge variant='secondary' className='text-xs'>
          {items.length}
        </Badge>
      </div>
      {items.length === 0 ? (
        <p className='rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground'>
          {emptyMessage}
        </p>
      ) : (
        <div className='space-y-2'>
          {items.map((item) => (
            <TaskRow
              key={`${item.folderId}-${item.listId}-${item.task.id}`}
              item={item}
              onToggleDone={onToggleDone}
              onNavigate={onNavigate}
              accent={accent}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function TodayView({
  folders,
  onUpdateTask,
  onNavigateToTask,
  setIsMobileMenuOpen,
}: TodayViewProps) {
  const grouped = useMemo(() => {
    return groupTasksByDueDate(flattenTasksWithContext(folders));
  }, [folders]);

  const totalOpen =
    grouped.overdue.length +
    grouped.today.length +
    grouped.tomorrow.length +
    grouped.thisWeek.length +
    grouped.later.length;

  const handleToggleDone = (item: TaskWithContext) => {
    const folder = folders.find((f) => f.id === item.folderId);
    const list = folder?.lists.find((l) => l.id === item.listId);
    if (!folder || !list) return;

    const doneStatusId = getDoneStatusId(list);
    const todoStatusId = getTodoStatusId(list);
    const nextStatus = item.isDone ? todoStatusId : doneStatusId;

    onUpdateTask(item.folderId, item.listId, {
      ...item.task,
      status: nextStatus,
      updatedAt: Date.now(),
    });
  };

  const handleNavigate = (item: TaskWithContext) => {
    onNavigateToTask(item.folderId, item.listId, item.task.id);
  };

  return (
    <div className='flex h-full flex-1 flex-col overflow-hidden'>
      <div className='flex items-center justify-between border-b p-4'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className='h-5 w-5' />
          </Button>
          <div>
            <div className='flex items-center gap-2'>
              <CalendarDays className='h-5 w-5 text-primary' />
              <h2 className='text-xl font-semibold'>Today</h2>
            </div>
            <p className='text-sm text-muted-foreground'>{format(new Date(), 'EEEE, MMMM d')}</p>
          </div>
        </div>
        <div className='hidden gap-2 sm:flex'>
          {grouped.overdue.length > 0 ? (
            <Badge variant='destructive' className='gap-1'>
              <AlertCircle className='h-3 w-3' />
              {grouped.overdue.length} overdue
            </Badge>
          ) : null}
          <Badge variant='secondary' className='gap-1'>
            <Sun className='h-3 w-3' />
            {grouped.today.length} due today
          </Badge>
        </div>
      </div>

      <div className='flex-1 overflow-auto p-4'>
        {totalOpen === 0 && grouped.noDueDate.length === 0 ? (
          <div className='flex h-full min-h-[280px] flex-col items-center justify-center text-center'>
            <div className='mb-4 rounded-full bg-primary/10 p-4'>
              <CalendarDays className='h-8 w-8 text-primary' />
            </div>
            <h3 className='text-lg font-semibold'>You&apos;re all caught up</h3>
            <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
              No open tasks with due dates. Add due dates to tasks in your lists to see them here.
            </p>
          </div>
        ) : (
          <div className='mx-auto max-w-3xl space-y-8'>
            <TaskSection
              title='Overdue'
              icon={AlertCircle}
              items={grouped.overdue}
              onToggleDone={handleToggleDone}
              onNavigate={handleNavigate}
              accent='overdue'
            />
            <TaskSection
              title='Due today'
              icon={Sun}
              items={grouped.today}
              emptyMessage='Nothing due today — nice work.'
              onToggleDone={handleToggleDone}
              onNavigate={handleNavigate}
              accent='today'
            />
            <TaskSection
              title='Tomorrow'
              icon={Clock}
              items={grouped.tomorrow}
              onToggleDone={handleToggleDone}
              onNavigate={handleNavigate}
            />
            <TaskSection
              title='This week'
              icon={CalendarRange}
              items={grouped.thisWeek}
              onToggleDone={handleToggleDone}
              onNavigate={handleNavigate}
            />
            <TaskSection
              title='Later'
              icon={CalendarDays}
              items={grouped.later}
              onToggleDone={handleToggleDone}
              onNavigate={handleNavigate}
            />
            {grouped.noDueDate.length > 0 ? (
              <TaskSection
                title='No due date'
                icon={CalendarDays}
                items={grouped.noDueDate.slice(0, 8)}
                onToggleDone={handleToggleDone}
                onNavigate={handleNavigate}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
