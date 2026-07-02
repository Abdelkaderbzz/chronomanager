'use client';

import { useState, useCallback } from 'react';
import FolderListSystem from '@/components/folder-list-system';
import AppHeader from '@/components/app-header';
import AnimatedBackground from '@/components/animated-background';
import { GlobalSearch } from '@/components/global-search';
import { AppSettings } from '@/components/app-settings';
import { PomodoroWidget } from '@/components/pomodoro/pomodoro-widget';
import type { Folder } from '@/types/types';

export default function AppShell() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [navTarget, setNavTarget] = useState<{
    folderId: string;
    listId: string;
    taskId?: string;
  } | null>(null);

  const handleFoldersChange = useCallback((updated: Folder[]) => {
    setFolders(updated);
  }, []);

  const handleSelectTask = useCallback(
    (folderId: string, listId: string, _taskId: string) => {
      setNavTarget({ folderId, listId, taskId: _taskId });
    },
    []
  );

  const handleSelectList = useCallback((folderId: string, listId: string) => {
    setNavTarget({ folderId, listId });
  }, []);

  const handleImport = useCallback((imported: Folder[]) => {
    localStorage.setItem('folders', JSON.stringify(imported));
    if (imported[0]) {
      localStorage.setItem('activeFolder', imported[0].id);
      if (imported[0].lists[0]) {
        localStorage.setItem('activeList', imported[0].lists[0].id);
      }
    }
    window.location.reload();
  }, []);

  const handleClearAll = useCallback(() => {
    localStorage.removeItem('folders');
    localStorage.removeItem('activeFolder');
    localStorage.removeItem('activeList');
    window.location.reload();
  }, []);

  return (
    <>
      <AnimatedBackground />
      <AppHeader>
        <PomodoroWidget />
        <GlobalSearch
          folders={folders}
          onSelectTask={handleSelectTask}
          onSelectList={handleSelectList}
        />
        <AppSettings
          folders={folders}
          onImport={handleImport}
          onClearAll={handleClearAll}
        />
      </AppHeader>
      <main className='min-h-[calc(100vh-57px)]'>
        <FolderListSystem
          onFoldersChange={handleFoldersChange}
          navTarget={navTarget}
          onNavTargetHandled={() => setNavTarget(null)}
        />
      </main>
    </>
  );
}
