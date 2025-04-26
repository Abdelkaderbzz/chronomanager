'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import EnhancedSidebar from '@/components/enhanced-sidebar';
import MainContent from '@/components/main-content';
import AnimatedBackground from '@/components/animated-background';
import confetti from 'canvas-confetti';
import type { Folder, List, Task, ViewType, Status } from '@/types/types';

export default function FolderListSystem() {
  const { toast } = useToast();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeList, setActiveList] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFolders = localStorage.getItem('folders');
    const savedActiveFolder = localStorage.getItem('activeFolder');
    const savedActiveList = localStorage.getItem('activeList');

    if (savedFolders) {
      const parsedFolders = JSON.parse(savedFolders);

      // Add isFavorite property if it doesn't exist
      const foldersWithFavorites = parsedFolders.map((folder: any) => ({
        ...folder,
        isFavorite: folder.isFavorite || false,
        lists: folder.lists.map((list: any) => ({
          ...list,
          isFavorite: list.isFavorite || false,
        })),
      }));

      setFolders(foldersWithFavorites);

      // Set active folder and list if they exist
      if (
        savedActiveFolder &&
        foldersWithFavorites.some(
          (folder: Folder) => folder.id === savedActiveFolder
        )
      ) {
        setActiveFolder(savedActiveFolder);

        if (savedActiveList) {
          const activeFolder = foldersWithFavorites.find(
            (folder: Folder) => folder.id === savedActiveFolder
          );
          if (
            activeFolder &&
            activeFolder.lists.some((list: List) => list.id === savedActiveList)
          ) {
            setActiveList(savedActiveList);
          }
        }
      } else if (foldersWithFavorites.length > 0) {
        // Set first folder as active if no active folder is saved
        setActiveFolder(foldersWithFavorites[0].id);
        if (foldersWithFavorites[0].lists.length > 0) {
          setActiveList(foldersWithFavorites[0].lists[0].id);
        }
      }
    } else {
      // Create default folders and lists if none exist
      const defaultFolders = [
        {
          id: uuidv4(),
          name: 'Work',
          icon: '',
          color: '#3b82f6',
          isFavorite: false,
          lists: [
            {
              id: uuidv4(),
              name: 'Current Tasks',
              tags: ['#priority'],
              viewType: 'kanban' as ViewType,
              isFavorite: false,
              statuses: [
                {
                  id: 'todo',
                  name: 'To Do',
                  emoji: '🚀',
                  color: '#3b82f6',
                  order: 0,
                },
                {
                  id: 'pending',
                  name: 'In Progress',
                  emoji: '⏳',
                  color: '#f59e0b',
                  order: 1,
                },
                {
                  id: 'done',
                  name: 'Done',
                  emoji: '✅',
                  color: '#10b981',
                  order: 2,
                },
              ],
              tasks: [
                {
                  id: uuidv4(),
                  title: 'Complete project proposal',
                  description:
                    'Draft the Q4 project proposal for client review',
                  status: 'todo',
                  priority: 'high',
                  dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                },
                {
                  id: uuidv4(),
                  title: 'Schedule team meeting',
                  description: 'Coordinate with team for weekly sync',
                  status: 'pending',
                  priority: 'medium',
                  dueDate: new Date(Date.now() + 86400000).toISOString(),
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                },
              ],
            },
            {
              id: uuidv4(),
              name: 'Project Ideas',
              tags: ['#brainstorm'],
              viewType: 'checklist' as ViewType,
              isFavorite: false,
              statuses: [
                {
                  id: 'todo',
                  name: 'To Do',
                  emoji: '🚀',
                  color: '#3b82f6',
                  order: 0,
                },
                {
                  id: 'done',
                  name: 'Done',
                  emoji: '✅',
                  color: '#10b981',
                  order: 1,
                },
              ],
              tasks: [],
            },
          ],
        },
        {
          id: uuidv4(),
          name: 'Personal',
          icon: '',
          color: '#8b5cf6',
          isFavorite: false,
          lists: [
            {
              id: uuidv4(),
              name: 'Shopping List',
              tags: ['#errands'],
              viewType: 'checklist' as ViewType,
              isFavorite: false,
              statuses: [
                {
                  id: 'todo',
                  name: 'To Do',
                  emoji: '🚀',
                  color: '#3b82f6',
                  order: 0,
                },
                {
                  id: 'done',
                  name: 'Done',
                  emoji: '✅',
                  color: '#10b981',
                  order: 1,
                },
              ],
              tasks: [
                {
                  id: uuidv4(),
                  title: 'Buy groceries',
                  description: 'Milk, eggs, bread, vegetables',
                  status: 'todo',
                  priority: 'medium',
                  dueDate: null,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                },
              ],
            },
          ],
        },
      ];

      setFolders(defaultFolders);
      setActiveFolder(defaultFolders[0].id);
      setActiveList(defaultFolders[0].lists[0].id);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (folders.length > 0) {
      localStorage.setItem('folders', JSON.stringify(folders));
    }

    if (activeFolder) {
      localStorage.setItem('activeFolder', activeFolder);
    }

    if (activeList) {
      localStorage.setItem('activeList', activeList);
    }
  }, [folders, activeFolder, activeList]);

  const handleCreateFolder = (newFolder: Omit<Folder, 'id' | 'lists'>) => {
    const folder: Folder = {
      id: uuidv4(),
      ...newFolder,
      lists: [],
    };

    const updatedFolders = [...folders, folder];
    setFolders(updatedFolders);
    setActiveFolder(folder.id);

    toast({
      title: 'Folder created',
      description: `${newFolder.name} folder has been created`,
    });
  };

  const handleUpdateFolder = (updatedFolder: Folder) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === updatedFolder.id ? updatedFolder : folder
    );

    setFolders(updatedFolders);

    toast({
      title: 'Folder updated',
      description: `${updatedFolder.name} folder has been updated`,
    });
  };

  const handleDeleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter((folder) => folder.id !== folderId);
    setFolders(updatedFolders);

    // Update active folder if the deleted folder was active
    if (activeFolder === folderId) {
      if (updatedFolders.length > 0) {
        setActiveFolder(updatedFolders[0].id);
        if (updatedFolders[0].lists.length > 0) {
          setActiveList(updatedFolders[0].lists[0].id);
        } else {
          setActiveList(null);
        }
      } else {
        setActiveFolder(null);
        setActiveList(null);
      }
    }

    toast({
      title: 'Folder deleted',
      description: 'The folder has been removed',
    });
  };

  const handleCreateList = (
    folderId: string,
    newList: Omit<List, 'id' | 'tasks'>
  ) => {
    const list: List = {
      id: uuidv4(),
      ...newList,
      tasks: [],
    };

    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: [...folder.lists, list],
        };
      }
      return folder;
    });

    setFolders(updatedFolders);
    setActiveList(list.id);

    toast({
      title: 'List created',
      description: `${newList.name} list has been created`,
    });
  };

  const handleUpdateList = (folderId: string, updatedList: List) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) =>
            list.id === updatedList.id ? updatedList : list
          ),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: 'List updated',
      description: `${updatedList.name} list has been updated`,
    });
  };

  const handleDeleteList = (folderId: string, listId: string) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.filter((list) => list.id !== listId),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    // Update active list if the deleted list was active
    if (activeList === listId) {
      const activeFolder = updatedFolders.find(
        (folder) => folder.id === folderId
      );
      if (activeFolder && activeFolder.lists.length > 0) {
        setActiveList(activeFolder.lists[0].id);
      } else {
        setActiveList(null);
      }
    }

    toast({
      title: 'List deleted',
      description: 'The list has been removed',
    });
  };

  const handleCreateTask = (
    folderId: string,
    listId: string,
    newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const task: Task = {
      id: uuidv4(),
      ...newTask,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: [...list.tasks, task],
              };
            }
            return list;
          }),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: 'Task created',
      description: 'New task has been added',
    });
  };

  const handleUpdateTask = (
    folderId: string,
    listId: string,
    updatedTask: Task
  ) => {
    // Check if the task is being moved to "done" status
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      const list = folder.lists.find((l) => l.id === listId);
      if (list) {
        const task = list.tasks.find((t) => t.id === updatedTask.id);
        if (task) {
          // Find the "done" status in the list
          const doneStatus = list.statuses.find(
            (s) => s.id === 'done' || s.name.toLowerCase() === 'done'
          );

          // If task is being moved to "done" status, trigger confetti
          if (
            doneStatus &&
            task.status !== doneStatus.id &&
            updatedTask.status === doneStatus.id
          ) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        }
      }
    }

    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === updatedTask.id
                    ? { ...updatedTask, updatedAt: Date.now() }
                    : task
                ),
              };
            }
            return list;
          }),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: 'Task updated',
      description: 'Task has been updated',
    });
  };

  const handleDeleteTask = (
    folderId: string,
    listId: string,
    taskId: string
  ) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: list.tasks.filter((task) => task.id !== taskId),
              };
            }
            return list;
          }),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: 'Task deleted',
      description: 'Task has been removed',
    });
  };

  const handleChangeListView = (
    folderId: string,
    listId: string,
    viewType: ViewType
  ) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                viewType,
              };
            }
            return list;
          }),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);
  };

  const handleCreateStatus = (
    folderId: string,
    listId: string,
    newStatus: Omit<Status, 'id' | 'order'>
  ) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) => {
            if (list.id === listId) {
              const maxOrder = Math.max(
                ...list.statuses.map((s) => s.order),
                -1
              );
              const status: Status = {
                id: newStatus.name.toLowerCase().replace(/\s+/g, '-'),
                ...newStatus,
                order: maxOrder + 1,
              };
              return {
                ...list,
                statuses: [...list.statuses, status],
              };
            }
            return list;
          }),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: 'Status created',
      description: `${newStatus.name} status has been created`,
    });
  };

  const handleUpdateStatus = (
    folderId: string,
    listId: string,
    updatedStatus: Status
  ) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                statuses: list.statuses.map((status) =>
                  status.id === updatedStatus.id ? updatedStatus : status
                ),
              };
            }
            return list;
          }),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: 'Status updated',
      description: `${updatedStatus.name} status has been updated`,
    });
  };

  const handleDeleteStatus = (
    folderId: string,
    listId: string,
    statusId: string
  ) => {
    // Find the list
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    const list = folder.lists.find((l) => l.id === listId);
    if (!list) return;

    // Check if there are tasks with this status
    const tasksWithStatus = list.tasks.filter(
      (task) => task.status === statusId
    );

    if (tasksWithStatus.length > 0) {
      toast({
        title: 'Cannot delete status',
        description:
          'There are tasks using this status. Move or delete them first.',
        variant: 'destructive',
      });
      return;
    }

    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                statuses: list.statuses.filter(
                  (status) => status.id !== statusId
                ),
              };
            }
            return list;
          }),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: 'Status deleted',
      description: 'The status has been removed',
    });
  };

  const handleReorderStatuses = (
    folderId: string,
    listId: string,
    reorderedStatuses: Status[]
  ) => {
    // Update the order property based on the new positions
    const updatedStatuses = reorderedStatuses.map((status, index) => ({
      ...status,
      order: index,
    }));

    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                statuses: updatedStatuses,
              };
            }
            return list;
          }),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: 'Columns reordered',
      description: 'Your status columns have been rearranged',
    });
  };

  const handleReorderFolders = (reorderedFolders: Folder[]) => {
    setFolders(reorderedFolders);
  };

  const handleReorderLists = (folderId: string, reorderedLists: List[]) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: reorderedLists,
        };
      }
      return folder;
    });

    setFolders(updatedFolders);
  };

  const handleFavoriteFolder = (folderId: string, isFavorite: boolean) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          isFavorite,
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: isFavorite ? 'Added to favorites' : 'Removed from favorites',
      description: isFavorite
        ? 'Folder added to favorites'
        : 'Folder removed from favorites',
    });
  };

  const handleFavoriteList = (
    folderId: string,
    listId: string,
    isFavorite: boolean
  ) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          lists: folder.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                isFavorite,
              };
            }
            return list;
          }),
        };
      }
      return folder;
    });

    setFolders(updatedFolders);

    toast({
      title: isFavorite ? 'Added to favorites' : 'Removed from favorites',
      description: isFavorite
        ? 'List added to favorites'
        : 'List removed from favorites',
    });
  };

  const getActiveFolder = () => {
    return folders.find((folder) => folder.id === activeFolder) || null;
  };

  const getActiveList = () => {
    const folder = getActiveFolder();
    if (!folder || !activeList) return null;
    return folder.lists.find((list) => list.id === activeList) || null;
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      <AnimatedBackground />

      <EnhancedSidebar
        folders={folders}
        activeFolder={activeFolder}
        activeList={activeList}
        onCreateFolder={handleCreateFolder}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={handleDeleteFolder}
        onCreateList={handleCreateList}
        onSelectFolder={setActiveFolder}
        onSelectList={setActiveList}
        onReorderFolders={handleReorderFolders}
        onReorderLists={handleReorderLists}
        onFavoriteFolder={handleFavoriteFolder}
        onFavoriteList={handleFavoriteList}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <MainContent
        folder={getActiveFolder()}
        list={getActiveList()}
        onUpdateList={handleUpdateList}
        onDeleteList={handleDeleteList}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onChangeListView={handleChangeListView}
        onCreateStatus={handleCreateStatus}
        onUpdateStatus={handleUpdateStatus}
        onDeleteStatus={handleDeleteStatus}
        onReorderStatuses={handleReorderStatuses}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </div>
  );
}
