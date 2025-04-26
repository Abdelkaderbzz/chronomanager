import FolderListSystem from '@/components/folder-list-system';
import AppHeader from '@/components/app-header';

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className='min-h-screen p-4'>
        <FolderListSystem />
      </main>
    </>
  );
}
