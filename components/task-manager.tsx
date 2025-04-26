'use client';
import FolderListSystem from '@/components/folder-list-system';
import AppHeader from '@/components/app-header';

import AnimatedBackground from '@/components/animated-background';

export default function TaskManager() {
  return (
    <>
      <AnimatedBackground />
      <AppHeader />
      <div className=' mx-auto px-4 py-6'>
        <div className='flex flex-col gap-6'>
          <div className='text-center max-w-3xl mx-auto mb-4'>
            <h1 className='text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600'>
              Your Task Command Center
            </h1>
            <p className='text-gray-600 dark:text-gray-300'>
              Everything you need to stay productive in one beautiful interface
            </p>
          </div>
          <FolderListSystem />
        </div>
      </div>
    </>
  );
}
