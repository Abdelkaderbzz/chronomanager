'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronDown,
  ChevronRight,
  FolderPlus,
  ListPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Menu,
  Star,
  StarOff,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Folder as FolderType, List } from '@/types/types';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useMediaQuery } from '@/hooks/use-media-query';

interface EnhancedSidebarProps {
  folders: FolderType[];
  activeFolder: string | null;
  activeList: string | null;
  onCreateFolder: (folder: Omit<FolderType, 'id' | 'lists'>) => void;
  onUpdateFolder: (folder: FolderType) => void;
  onDeleteFolder: (folderId: string) => void;
  onCreateList: (folderId: string, list: Omit<List, 'id' | 'tasks'>) => void;
  onSelectFolder: (folderId: string | null) => void;
  onSelectList: (listId: string | null) => void;
  onReorderFolders: (folders: FolderType[]) => void;
  onReorderLists: (folderId: string, lists: List[]) => void;
  onFavoriteFolder: (folderId: string, isFavorite: boolean) => void;
  onFavoriteList: (
    folderId: string,
    listId: string,
    isFavorite: boolean
  ) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function EnhancedSidebar({
  folders,
  activeFolder,
  activeList,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onCreateList,
  onSelectFolder,
  onSelectList,
  onReorderFolders,
  onReorderLists,
  onFavoriteFolder,
  onFavoriteList,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: EnhancedSidebarProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [newFolder, setNewFolder] = useState({
    name: '',
    icon: '',
    color: '#3b82f6',
    isFavorite: false,
  });
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [newList, setNewList] = useState({
    name: '',
    tags: [] as string[],
    viewType: 'kanban' as const,
    isFavorite: false,
  });
  const [addingListToFolder, setAddingListToFolder] = useState<string | null>(
    null
  );
  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateFolder = () => {
    if (newFolder.name.trim() === '') return;
    onCreateFolder(newFolder);
    setNewFolder({
      name: '',
      icon: '',
      color: '#3b82f6',
      isFavorite: false,
    });
  };

  const handleUpdateFolder = () => {
    if (!editingFolder || editingFolder.name.trim() === '') return;
    onUpdateFolder(editingFolder);
    setEditingFolder(null);
  };

  const handleCreateList = () => {
    if (!addingListToFolder || newList.name.trim() === '') return;

    // Create default statuses based on the view type
    let defaultStatuses = [];

    if (newList.viewType === 'kanban') {
      defaultStatuses = [
        { id: 'todo', name: 'To Do', emoji: '🚀', color: '#3b82f6', order: 0 },
        {
          id: 'pending',
          name: 'In Progress',
          emoji: '⏳',
          color: '#f59e0b',
          order: 1,
        },
        { id: 'done', name: 'Done', emoji: '✅', color: '#10b981', order: 2 },
      ];
    } else {
      defaultStatuses = [
        { id: 'todo', name: 'To Do', emoji: '🚀', color: '#3b82f6', order: 0 },
        { id: 'done', name: 'Done', emoji: '✅', color: '#10b981', order: 1 },
      ];
    }

    onCreateList(addingListToFolder, {
      ...newList,
      statuses: defaultStatuses,
    });

    setNewList({
      name: '',
      tags: [],
      viewType: 'kanban',
      isFavorite: false,
    });
    setAddingListToFolder(null);

    // Ensure the folder is expanded
    setExpandedFolders({
      ...expandedFolders,
      [addingListToFolder]: true,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() === '') return;
    const formattedTag = newTag.startsWith('#') ? newTag : `#${newTag}`;
    setNewList({
      ...newList,
      tags: [...newList.tags, formattedTag],
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setNewList({
      ...newList,
      tags: newList.tags.filter((t) => t !== tag),
    });
  };

  const toggleFolderExpand = (folderId: string) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: !expandedFolders[folderId],
    });
  };

  const handleSelectFolder = (folderId: string) => {
    onSelectFolder(folderId);

    // If folder has lists, select the first one
    const folder = folders.find((f) => f.id === folderId);
    if (folder && folder.lists.length > 0) {
      onSelectList(folder.lists[0].id);
    } else {
      onSelectList(null);
    }

    // Expand the folder
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: true,
    });

    // Close mobile menu after selection
    setIsMobileMenuOpen(false);
  };

  const handleSelectList = (listId: string) => {
    // Find the parent folder of the selected list
    const parentFolder = folders.find((folder) =>
      folder.lists.some((list) => list.id === listId)
    );

    // If parent folder is found, select it first
    if (parentFolder) {
      onSelectFolder(parentFolder.id);

      // Expand the folder
      setExpandedFolders({
        ...expandedFolders,
        [parentFolder.id]: true,
      });
    }

    // Select the list
    onSelectList(listId);

    // Close mobile menu after selection
    setIsMobileMenuOpen(false);
  };

  const moveFolder = (dragIndex: number, hoverIndex: number) => {
    const draggedFolder = folders[dragIndex];
    const newFolders = [...folders];
    newFolders.splice(dragIndex, 1);
    newFolders.splice(hoverIndex, 0, draggedFolder);
    onReorderFolders(newFolders);
  };

  const moveLists = (
    folderId: string,
    dragIndex: number,
    hoverIndex: number
  ) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    const draggedList = folder.lists[dragIndex];
    const newLists = [...folder.lists];
    newLists.splice(dragIndex, 1);
    newLists.splice(hoverIndex, 0, draggedList);
    onReorderLists(folderId, newLists);
  };

  // Filter folders and lists based on search term
  const filteredFolders = folders.filter((folder) => {
    if (!searchTerm) return true;

    const folderMatch = folder.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const listsMatch = folder.lists.some(
      (list) =>
        list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return folderMatch || listsMatch;
  });

  // Get favorite folders and lists
  const favoriteFolders = folders.filter((folder) => folder.isFavorite);
  const favoriteLists = folders.flatMap((folder) =>
    folder.lists
      .filter((list) => list.isFavorite)
      .map((list) => ({ ...list, folderId: folder.id }))
  );

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
   

      {/* Sidebar */}
      <div
        className={cn(
          'bg-background border-r w-64 flex-shrink-0 flex flex-col h-full transition-all duration-300 ease-in-out z-20',
          isMobileMenuOpen
            ? 'fixed inset-y-0 left-0'
            : 'fixed inset-y-0 -left-64 md:left-0 md:relative'
        )}
      >
        <div className='p-4 border-b flex flex-col gap-2'>
          <h1 className='font-semibold text-lg'>Folders & Lists</h1>
          <div className='flex items-center gap-2'>
            <Input
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-8'
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <FolderPlus className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='folderName'>Folder Name</Label>
                    <Input
                      id='folderName'
                      value={newFolder.name}
                      onChange={(e) =>
                        setNewFolder({ ...newFolder, name: e.target.value })
                      }
                      placeholder='e.g., Work, Personal, Projects'
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='folderColor'>Color</Label>
                    <div className='flex items-center gap-2'>
                      <Input
                        id='folderColor'
                        type='color'
                        value={newFolder.color}
                        onChange={(e) =>
                          setNewFolder({ ...newFolder, color: e.target.value })
                        }
                        className='w-12 h-9 p-1'
                      />
                      <div
                        className='w-8 h-8 rounded-full'
                        style={{ backgroundColor: newFolder.color }}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleCreateFolder}>Create Folder</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ScrollArea className='flex-1 p-2'>
          {/* Favorites Section */}
          {(favoriteFolders.length > 0 || favoriteLists.length > 0) && (
            <div className='mb-4'>
              <div className='flex items-center px-2 py-1 text-sm font-medium text-muted-foreground'>
                <Star className='h-4 w-4 mr-1 text-yellow-400' />
                Favorites
              </div>

              {/* Favorite Folders */}
              {favoriteFolders.map((folder) => (
                <Button
                  key={`fav-folder-${folder.id}`}
                  variant={activeFolder === folder.id ? 'secondary' : 'ghost'}
                  className={cn(
                    'justify-start w-full h-8 px-2 font-normal ml-2',
                    activeFolder === folder.id && 'font-medium'
                  )}
                  onClick={() => handleSelectFolder(folder.id)}
                >
                  <span className='mr-2' style={{ color: folder.color }}>
                    {folder.icon}
                  </span>
                  <span className='truncate'>{folder.name}</span>
                </Button>
              ))}

              {/* Favorite Lists */}
              {favoriteLists.map((list) => (
                <Button
                  key={`fav-list-${list.id}`}
                  variant={activeList === list.id ? 'secondary' : 'ghost'}
                  className={cn(
                    'justify-start w-full h-8 px-2 font-normal ml-2',
                    activeList === list.id && 'font-medium'
                  )}
                  onClick={() => handleSelectList(list.id)}
                >
                  <span className='truncate'>{list.name}</span>
                  {list.tags.length > 0 && (
                    <span className='ml-2 text-xs text-muted-foreground'>
                      {list.tags[0]}
                    </span>
                  )}
                </Button>
              ))}

              <div className='h-px bg-border my-2' />
            </div>
          )}

          {filteredFolders.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <p>No folders found</p>
              <p className='text-sm'>Create a folder to get started</p>
            </div>
          ) : (
            <div className='space-y-1'>
              {filteredFolders.map((folder, index) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  index={index}
                  isActive={activeFolder === folder.id}
                  isExpanded={!!expandedFolders[folder.id]}
                  activeList={activeList}
                  onToggleExpand={() => toggleFolderExpand(folder.id)}
                  onSelectFolder={() => handleSelectFolder(folder.id)}
                  onSelectList={handleSelectList}
                  onEditFolder={() => setEditingFolder(folder)}
                  onDeleteFolder={() => setFolderToDelete(folder.id)}
                  onAddList={() => setAddingListToFolder(folder.id)}
                  onFavoriteFolder={(isFavorite) =>
                    onFavoriteFolder(folder.id, isFavorite)
                  }
                  onFavoriteList={(listId, isFavorite) =>
                    onFavoriteList(folder.id, listId, isFavorite)
                  }
                  moveFolder={moveFolder}
                  moveLists={moveLists}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Edit Folder Dialog */}
        <Dialog
          open={!!editingFolder}
          onOpenChange={(open) => !open && setEditingFolder(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Folder</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='editFolderName'>Folder Name</Label>
                <Input
                  id='editFolderName'
                  value={editingFolder?.name || ''}
                  onChange={(e) =>
                    setEditingFolder((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='editFolderIcon'>Icon/Emoji</Label>
                <Input
                  id='editFolderIcon'
                  value={editingFolder?.icon || ''}
                  onChange={(e) =>
                    setEditingFolder((prev) =>
                      prev ? { ...prev, icon: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='editFolderColor'>Color</Label>
                <div className='flex items-center gap-2'>
                  <Input
                    id='editFolderColor'
                    type='color'
                    value={editingFolder?.color || ''}
                    onChange={(e) =>
                      setEditingFolder((prev) =>
                        prev ? { ...prev, color: e.target.value } : null
                      )
                    }
                    className='w-12 h-9 p-1'
                  />
                  <div
                    className='w-8 h-8 rounded-full'
                    style={{ backgroundColor: editingFolder?.color || '' }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant='outline'
                  onClick={() => setEditingFolder(null)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleUpdateFolder}>Save Changes</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add List Dialog */}
        <Dialog
          open={!!addingListToFolder}
          onOpenChange={(open) => !open && setAddingListToFolder(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='listName'>List Name</Label>
                <Input
                  id='listName'
                  value={newList.name}
                  onChange={(e) =>
                    setNewList({ ...newList, name: e.target.value })
                  }
                  placeholder='e.g., Project Tasks, Shopping List'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='listTags'>Tags</Label>
                <div className='flex flex-wrap gap-1 mb-2'>
                  {newList.tags.map((tag) => (
                    <div
                      key={tag}
                      className='bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1'
                    >
                      {tag}
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-4 w-4 p-0'
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className='flex gap-2'>
                  <Input
                    id='listTags'
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder='#tag'
                    className='flex-1'
                  />
                  <Button type='button' onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='viewType'>Default View</Label>
                <select
                  id='viewType'
                  value={newList.viewType}
                  onChange={(e) =>
                    setNewList({
                      ...newList,
                      viewType: e.target.value as
                        | 'kanban'
                        | 'checklist'
                        | 'priority',
                    })
                  }
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <option value='kanban'>Kanban Board</option>
                  <option value='checklist'>Checklist</option>
                  <option value='priority'>Priority Table</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant='outline'
                  onClick={() => {
                    setNewList({
                      name: '',
                      tags: [],
                      viewType: 'kanban',
                      isFavorite: false,
                    });
                    setAddingListToFolder(null);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleCreateList}>Create List</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete folder confirmation */}
        <AlertDialog
          open={!!folderToDelete}
          onOpenChange={() => setFolderToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this folder and all its lists and
                tasks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (folderToDelete) {
                    onDeleteFolder(folderToDelete);
                    setFolderToDelete(null);
                  }
                }}
                className='bg-destructive text-destructive-foreground'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className='md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-10'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </DndProvider>
  );
}

interface FolderItemProps {
  folder: FolderType;
  index: number;
  isActive: boolean;
  isExpanded: boolean;
  activeList: string | null;
  onToggleExpand: () => void;
  onSelectFolder: () => void;
  onSelectList: (listId: string) => void;
  onEditFolder: () => void;
  onDeleteFolder: () => void;
  onAddList: () => void;
  onFavoriteFolder: (isFavorite: boolean) => void;
  onFavoriteList: (listId: string, isFavorite: boolean) => void;
  moveFolder: (dragIndex: number, hoverIndex: number) => void;
  moveLists: (folderId: string, dragIndex: number, hoverIndex: number) => void;
}

function FolderItem({
  folder,
  index,
  isActive,
  isExpanded,
  activeList,
  onToggleExpand,
  onSelectFolder,
  onSelectList,
  onEditFolder,
  onDeleteFolder,
  onAddList,
  onFavoriteFolder,
  onFavoriteList,
  moveFolder,
  moveLists,
}: FolderItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'FOLDER',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'FOLDER',
    hover: (item: { index: number }, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      moveFolder(dragIndex, hoverIndex);

      // Update the index for the dragged item
      item.index = hoverIndex;
    },
  });

  // Combine the refs
  const dragDropRef = (el: HTMLDivElement) => {
    drag(el);
    drop(el);
  };

  return (
    <div className={`space-y-1 ${isDragging ? 'opacity-50' : ''}`}>
      <div ref={dragDropRef} className='flex items-center'>
        <Button
          variant='ghost'
          size='sm'
          className='w-6 h-6 p-0 mr-1'
          onClick={onToggleExpand}
        >
          {isExpanded ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </Button>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className={cn(
            'justify-start w-full h-8 px-2 font-normal',
            isActive && 'font-medium'
          )}
          onClick={onSelectFolder}
        >
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: isExpanded ? 0 : -10 }}
            transition={{ duration: 0.2 }}
            className='mr-2'
            style={{ color: folder.color }}
          >
            {isExpanded ? (
              <FolderOpen className='h-4 w-4' />
            ) : (
              <Folder className='h-4 w-4' />
            )}
            {folder.icon}
          </motion.span>
          <span className='truncate'>{folder.name}</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => onFavoriteFolder(!folder.isFavorite)}
            >
              {folder.isFavorite ? (
                <>
                  <StarOff className='h-4 w-4 mr-2' />
                  Remove from Favorites
                </>
              ) : (
                <>
                  <Star className='h-4 w-4 mr-2' />
                  Add to Favorites
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onEditFolder();
              }}
            >
              <Pencil className='h-4 w-4 mr-2' />
              Edit Folder
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onAddList();
              }}
            >
              <ListPlus className='h-4 w-4 mr-2' />
              Add List
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onSelect={onDeleteFolder}
            >
              <Trash2 className='h-4 w-4 mr-2' />
              Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {isExpanded && folder.lists.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='ml-6 space-y-1 overflow-hidden'
          >
            {folder.lists.map((list, listIndex) => (
              <ListItem
                key={list.id}
                list={list}
                index={listIndex}
                isActive={activeList === list.id}
                onSelectList={() => onSelectList(list.id)}
                onFavoriteList={(isFavorite) =>
                  onFavoriteList(list.id, isFavorite)
                }
                folderId={folder.id}
                moveLists={moveLists}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ListItemProps {
  list: List;
  index: number;
  isActive: boolean;
  onSelectList: () => void;
  onFavoriteList: (isFavorite: boolean) => void;
  folderId: string;
  moveLists: (folderId: string, dragIndex: number, hoverIndex: number) => void;
}

function ListItem({
  list,
  index,
  isActive,
  onSelectList,
  onFavoriteList,
  folderId,
  moveLists,
}: ListItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: `LIST-${folderId}`,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: `LIST-${folderId}`,
    hover: (item: { index: number }, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      moveLists(folderId, dragIndex, hoverIndex);

      // Update the index for the dragged item
      item.index = hoverIndex;
    },
  });

  // Combine the refs
  const dragDropRef = (el: HTMLDivElement) => {
    drag(el);
    drop(el);
  };

  return (
    <div
      ref={dragDropRef}
      className={`flex items-center ${isDragging ? 'opacity-50' : ''}`}
    >
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'justify-start w-full h-8 px-2 font-normal',
          isActive && 'font-medium'
        )}
        onClick={onSelectList}
      >
        <span className='truncate'>{list.name}</span>
        {list.tags.length > 0 && (
          <span className='ml-2 text-xs text-muted-foreground'>
            {list.tags[0]}
          </span>
        )}
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='h-6 w-6'
        onClick={() => onFavoriteList(!list.isFavorite)}
      >
        {list.isFavorite ? (
          <Star className='h-3 w-3 text-yellow-400' />
        ) : (
          <Star className='h-3 w-3 text-muted-foreground' />
        )}
      </Button>
    </div>
  );
}
