import FolderListSystem from '@/components/folder-list-system';
import AppHeader from '@/components/app-header';
import AnimatedBackground from '@/components/animated-background';

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <AppHeader />
      <main className='min-h-screen'>
        <FolderListSystem />
      </main>
    </>
  );
}
