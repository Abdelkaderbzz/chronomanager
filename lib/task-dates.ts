import {
  addDays,
  endOfDay,
  format,
  isBefore,
  isToday,
  isTomorrow,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import type { Folder, List, Task } from '@/types/types';

export type TaskWithContext = {
  task: Task;
  folderId: string;
  folderName: string;
  folderColor: string;
  listId: string;
  listName: string;
  statusName: string;
  statusEmoji: string;
  isDone: boolean;
};

export type GroupedTasks = {
  overdue: TaskWithContext[];
  today: TaskWithContext[];
  tomorrow: TaskWithContext[];
  thisWeek: TaskWithContext[];
  later: TaskWithContext[];
  noDueDate: TaskWithContext[];
};

export function getDoneStatusId(list: List): string {
  return (
    list.statuses.find((s) => s.id === 'done')?.id ??
    list.statuses.find((s) => s.name.toLowerCase() === 'done')?.id ??
    (list.statuses.length > 0 ? list.statuses[list.statuses.length - 1].id : 'done')
  );
}

export function getTodoStatusId(list: List): string {
  return list.statuses.length > 0 ? list.statuses[0].id : 'todo';
}

export function isTaskDone(task: Task, list: List): boolean {
  const doneStatusId = getDoneStatusId(list);
  if (task.status === doneStatusId || task.status === 'done') return true;
  return list.statuses.some(
    (s) => s.id === task.status && s.name.toLowerCase() === 'done'
  );
}

export function flattenTasksWithContext(folders: Folder[]): TaskWithContext[] {
  const items: TaskWithContext[] = [];

  for (const folder of folders) {
    for (const list of folder.lists) {
      for (const task of list.tasks) {
        const status = list.statuses.find((s) => s.id === task.status);
        items.push({
          task,
          folderId: folder.id,
          folderName: folder.name,
          folderColor: folder.color,
          listId: list.id,
          listName: list.name,
          statusName: status?.name ?? task.status,
          statusEmoji: status?.emoji ?? '',
          isDone: isTaskDone(task, list),
        });
      }
    }
  }

  return items;
}

function sortByDueDate(a: TaskWithContext, b: TaskWithContext): number {
  const aDate = a.task.dueDate ? new Date(a.task.dueDate).getTime() : Infinity;
  const bDate = b.task.dueDate ? new Date(b.task.dueDate).getTime() : Infinity;
  if (aDate !== bDate) return aDate - bDate;

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const aPriority = priorityOrder[a.task.priority as keyof typeof priorityOrder] ?? 1;
  const bPriority = priorityOrder[b.task.priority as keyof typeof priorityOrder] ?? 1;
  return aPriority - bPriority;
}

export function groupTasksByDueDate(tasks: TaskWithContext[]): GroupedTasks {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekEnd = endOfDay(addDays(todayStart, 7));

  const open = tasks.filter((item) => !item.isDone);
  const grouped: GroupedTasks = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    noDueDate: [],
  };

  for (const item of open) {
    if (!item.task.dueDate) {
      grouped.noDueDate.push(item);
      continue;
    }

    const due = new Date(item.task.dueDate);

    if (isBefore(due, todayStart)) {
      grouped.overdue.push(item);
    } else if (isToday(due)) {
      grouped.today.push(item);
    } else if (isTomorrow(due)) {
      grouped.tomorrow.push(item);
    } else if (isWithinInterval(due, { start: addDays(todayStart, 2), end: weekEnd })) {
      grouped.thisWeek.push(item);
    } else {
      grouped.later.push(item);
    }
  }

  grouped.overdue.sort(sortByDueDate);
  grouped.today.sort(sortByDueDate);
  grouped.tomorrow.sort(sortByDueDate);
  grouped.thisWeek.sort(sortByDueDate);
  grouped.later.sort(sortByDueDate);
  grouped.noDueDate.sort((a, b) => a.task.title.localeCompare(b.task.title));

  return grouped;
}

export function getTodayViewCounts(folders: Folder[]): {
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
} {
  const grouped = groupTasksByDueDate(flattenTasksWithContext(folders));
  return {
    overdue: grouped.overdue.length,
    dueToday: grouped.today.length,
    dueThisWeek:
      grouped.today.length +
      grouped.tomorrow.length +
      grouped.thisWeek.length,
  };
}

export function formatDueLabel(dueDate: string): string {
  const due = new Date(dueDate);
  if (isToday(due)) return 'Today';
  if (isTomorrow(due)) return 'Tomorrow';
  return format(due, 'EEE, MMM d');
}
