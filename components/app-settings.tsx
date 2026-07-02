'use client';

import { useRef, useState } from 'react';
import {
  Download,
  Upload,
  Settings,
  Trash2,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { Folder } from '@/types/types';

interface AppSettingsProps {
  folders: Folder[];
  onImport: (folders: Folder[]) => void;
  onClearAll: () => void;
}

function getStats(folders: Folder[]) {
  const totalLists = folders.reduce((acc, f) => acc + f.lists.length, 0);
  const totalTasks = folders.reduce(
    (acc, f) => acc + f.lists.reduce((a, l) => a + l.tasks.length, 0),
    0
  );
  const completedTasks = folders.reduce(
    (acc, f) =>
      acc +
      f.lists.reduce(
        (a, l) =>
          a +
          l.tasks.filter(
            (t) =>
              t.status === 'done' ||
              l.statuses.some(
                (s) =>
                  s.id === t.status && s.name.toLowerCase() === 'done'
              )
          ).length,
        0
      ),
    0
  );
  const overdueTasks = folders.reduce(
    (acc, f) =>
      acc +
      f.lists.reduce(
        (a, l) =>
          a +
          l.tasks.filter(
            (t) =>
              t.dueDate &&
              new Date(t.dueDate) < new Date() &&
              t.status !== 'done'
          ).length,
        0
      ),
    0
  );

  return { totalLists, totalTasks, completedTasks, overdueTasks };
}

export function AppSettings({ folders, onImport, onClearAll }: AppSettingsProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const stats = getStats(folders);

  const handleExport = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      folders,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chronomanager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Data exported', description: 'Your backup file has been downloaded.' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const importedFolders: Folder[] = parsed.folders ?? parsed;
        if (!Array.isArray(importedFolders)) throw new Error('Invalid format');
        onImport(importedFolders);
        toast({
          title: 'Data imported',
          description: `${importedFolders.length} folder(s) loaded successfully.`,
        });
      } catch {
        toast({
          title: 'Import failed',
          description: 'Could not read the file. Make sure it is a valid ChronoManager backup.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='ghost' size='icon' className='h-9 w-9' aria-label='Settings'>
            <Settings className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Settings &amp; Data</DialogTitle>
            <DialogDescription>
              Manage your workspace data and view productivity stats.
            </DialogDescription>
          </DialogHeader>

          {/* Stats */}
          <div className='grid grid-cols-2 gap-3 py-2'>
            {[
              { label: 'Folders', value: folders.length, icon: BarChart3 },
              { label: 'Lists', value: stats.totalLists, icon: BarChart3 },
              { label: 'Tasks', value: stats.totalTasks, icon: BarChart3 },
              { label: 'Completed', value: stats.completedTasks, icon: BarChart3 },
            ].map((item) => (
              <div
                key={item.label}
                className='rounded-lg border bg-muted/40 p-3 text-center'
              >
                <div className='text-2xl font-bold'>{item.value}</div>
                <div className='text-xs text-muted-foreground'>{item.label}</div>
              </div>
            ))}
          </div>

          {stats.overdueTasks > 0 && (
            <p className='text-sm text-destructive text-center'>
              {stats.overdueTasks} overdue task{stats.overdueTasks !== 1 ? 's' : ''}
            </p>
          )}

          <div className='flex flex-col gap-2 pt-2'>
            <Button variant='outline' className='justify-start gap-2' onClick={handleExport}>
              <Download className='h-4 w-4' />
              Export backup (JSON)
            </Button>
            <Button
              variant='outline'
              className='justify-start gap-2'
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className='h-4 w-4' />
              Import backup
            </Button>
            <input
              ref={fileInputRef}
              type='file'
              accept='.json'
              className='hidden'
              onChange={handleImport}
            />
            <Button
              variant='outline'
              className='justify-start gap-2 text-destructive hover:text-destructive'
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 className='h-4 w-4' />
              Clear all data
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all folders, lists, and tasks. Export
              a backup first if you want to keep your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={() => {
                onClearAll();
                setShowClearConfirm(false);
                toast({ title: 'All data cleared', description: 'Your workspace has been reset.' });
              }}
            >
              Clear everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
