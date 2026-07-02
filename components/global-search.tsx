'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Calendar,
  CheckSquare,
  FolderOpen,
  Search,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import type { Folder } from '@/types/types';
import { format } from 'date-fns';

interface GlobalSearchProps {
  folders: Folder[];
  onSelectTask: (folderId: string, listId: string, taskId: string) => void;
  onSelectList: (folderId: string, listId: string) => void;
}

export function GlobalSearch({
  folders,
  onSelectTask,
  onSelectList,
}: GlobalSearchProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelectTask = useCallback(
    (folderId: string, listId: string, taskId: string) => {
      onSelectTask(folderId, listId, taskId);
      setOpen(false);
    },
    [onSelectTask]
  );

  const handleSelectList = useCallback(
    (folderId: string, listId: string) => {
      onSelectList(folderId, listId);
      setOpen(false);
    },
    [onSelectList]
  );

  const allTasks = folders.flatMap((folder) =>
    folder.lists.flatMap((list) =>
      list.tasks.map((task) => ({ folder, list, task }))
    )
  );

  const allLists = folders.flatMap((folder) =>
    folder.lists.map((list) => ({ folder, list }))
  );

  return (
    <>
      <Button
        variant='outline'
        className='hidden md:flex items-center gap-2 h-9 px-3 text-muted-foreground border-dashed'
        onClick={() => setOpen(true)}
      >
        <Search className='h-4 w-4' />
        <span className='text-sm'>Search tasks...</span>
        <kbd className='pointer-events-none ml-2 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>

      <Button
        variant='ghost'
        size='icon'
        className='md:hidden h-9 w-9'
        onClick={() => setOpen(true)}
        aria-label='Search'
      >
        <Search className='h-4 w-4' />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search tasks, lists, folders...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {allTasks.length > 0 && (
            <CommandGroup heading='Tasks'>
              {allTasks.map(({ folder, list, task }) => (
                <CommandItem
                  key={task.id}
                  value={`${task.title} ${task.description} ${folder.name} ${list.name}`}
                  onSelect={() => handleSelectTask(folder.id, list.id, task.id)}
                >
                  <CheckSquare className='mr-2 h-4 w-4 text-muted-foreground' />
                  <div className='flex flex-col flex-1 min-w-0'>
                    <span className='truncate'>{task.title}</span>
                    <span className='text-xs text-muted-foreground truncate'>
                      {folder.name} / {list.name}
                    </span>
                  </div>
                  {task.dueDate && (
                    <span className='ml-2 text-xs text-muted-foreground flex items-center gap-1 shrink-0'>
                      <Calendar className='h-3 w-3' />
                      {format(new Date(task.dueDate), 'MMM d')}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {allLists.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading='Lists'>
                {allLists.map(({ folder, list }) => (
                  <CommandItem
                    key={list.id}
                    value={`${list.name} ${folder.name} ${list.tags.join(' ')}`}
                    onSelect={() => handleSelectList(folder.id, list.id)}
                  >
                    <FolderOpen className='mr-2 h-4 w-4 text-muted-foreground' />
                    <div className='flex flex-col'>
                      <span>{list.name}</span>
                      <span className='text-xs text-muted-foreground'>
                        {folder.name}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
