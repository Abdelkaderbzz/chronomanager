'use client';
import FolderListSystem from '@/components/folder-list-system';
import AppHeader from '@/components/app-header';

export default function TaskManager() {
  return (
    <>
      <AppHeader />
      <div className='max-w-7xl mx-auto p-4'>
        <div className='flex flex-col gap-6'>
          <FolderListSystem />
        </div>
      </div>
    </>
  );
}
