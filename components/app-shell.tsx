'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import FolderListSystem from '@/components/folder-list-system';
import AppHeader from '@/components/app-header';
import AnimatedBackground from '@/components/animated-background';
import { GlobalSearch } from '@/components/global-search';
import { AppSettings } from '@/components/app-settings';
import { PomodoroWidget } from '@/components/pomodoro/pomodoro-widget';
import { clearWorkspaceForTemplatePicker } from '@/lib/templates/workspace';
import { ONBOARDING_COMPLETE_KEY } from '@/lib/templates/constants';
import { useToast } from '@/hooks/use-toast';
import type { Folder } from '@/types/types';
import type { TemplateId } from '@/types/templates';

const TemplatePicker = dynamic(
  () =>
    import('@/components/templates/template-picker').then((mod) => ({
      default: mod.TemplatePicker,
    })),
  {
    ssr: false,
    loading: () => (
      <div className='min-h-[calc(100vh-57px)] bg-background flex items-center justify-center'>
        <div className='h-8 w-8 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin' />
      </div>
    ),
  }
);

function AppLoadingSpinner() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='h-8 w-8 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin' />
    </div>
  );
}

export default function AppShell() {
  const { toast } = useToast();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showTemplatePicker, setShowTemplatePicker] = useState<boolean | null>(null);
  const [templatePickerMode, setTemplatePickerMode] = useState<'onboarding' | 'reset'>('onboarding');
  const [workspaceKey, setWorkspaceKey] = useState(0);
  const [navTarget, setNavTarget] = useState<{
    folderId: string;
    listId: string;
    taskId?: string;
  } | null>(null);

  useEffect(() => {
    setShowTemplatePicker(!localStorage.getItem('folders'));
  }, []);

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
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    if (imported[0]) {
      localStorage.setItem('activeFolder', imported[0].id);
      if (imported[0].lists[0]) {
        localStorage.setItem('activeList', imported[0].lists[0].id);
      }
    }
    window.location.reload();
  }, []);

  const handleClearAll = useCallback(() => {
    clearWorkspaceForTemplatePicker();
    setFolders([]);
    setTemplatePickerMode('reset');
    setShowTemplatePicker(true);
    setWorkspaceKey((k) => k + 1);
  }, []);

  const handleChangeTemplate = useCallback(() => {
    clearWorkspaceForTemplatePicker();
    setFolders([]);
    setTemplatePickerMode('reset');
    setShowTemplatePicker(true);
    setWorkspaceKey((k) => k + 1);
  }, []);

  const handleTemplateSelect = useCallback(
    async (templateId: TemplateId) => {
      const [{ applyTemplate }, confetti] = await Promise.all([
        import('@/lib/templates/workspace'),
        import('canvas-confetti'),
      ]);

      const built = applyTemplate(templateId);
      confetti.default({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      toast({
        title: 'Workspace ready!',
        description: `Your ${built.length} folder workspace is set up. Let's go.`,
      });
      setShowTemplatePicker(false);
      setWorkspaceKey((k) => k + 1);
    },
    [toast]
  );

  if (showTemplatePicker === null) {
    return <AppLoadingSpinner />;
  }

  if (showTemplatePicker) {
    return (
      <>
        <AppHeader />
        <main>
          <TemplatePicker mode={templatePickerMode} onSelect={handleTemplateSelect} />
        </main>
      </>
    );
  }

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
          onChangeTemplate={handleChangeTemplate}
        />
      </AppHeader>
      <main className='min-h-[calc(100vh-57px)]'>
        <FolderListSystem
          key={workspaceKey}
          onFoldersChange={handleFoldersChange}
          navTarget={navTarget}
          onNavTargetHandled={() => setNavTarget(null)}
        />
      </main>
    </>
  );
}
