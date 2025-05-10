'use client';

import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import type { List, Task, Status } from '@/types/types';
import { Plus, Edit, Trash2, Calendar, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useMediaQuery } from '@/hooks/use-media-query';

interface KanbanViewProps {
  folderId: string;
  list: List;
  onCreateTask: (
    folderId: string,
    listId: string,
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  onUpdateTask: (folderId: string, listId: string, task: Task) => void;
  onDeleteTask: (folderId: string, listId: string, taskId: string) => void;
  onReorderStatuses: (statuses: Status[]) => void;
}

export default function KanbanView({
  folderId,
  list,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onReorderStatuses,
}: KanbanViewProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [newTask, setNewTask] = useState<
    Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  >({
    title: '',
    description: '',
    status: list.statuses.length > 0 ? list.statuses[0].id : 'todo',
    priority: 'medium',
    dueDate: null,
  });
  const [addingToStatus, setAddingToStatus] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleCreateTask = () => {
    if (newTask.title.trim() === '' || !addingToStatus) return;
    onCreateTask(folderId, list.id, { ...newTask, status: addingToStatus });
    setNewTask({
      title: '',
      description: '',
      status: list.statuses.length > 0 ? list.statuses[0].id : 'todo',
      priority: 'medium',
      dueDate: null,
    });
    setAddingToStatus(null);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    onUpdateTask(folderId, list.id, editingTask);
    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    onDeleteTask(folderId, list.id, taskToDelete);
    setTaskToDelete(null);
  };

  const getTasksByStatus = (statusId: string) => {
    return list.tasks.filter((task) => task.status === statusId);
  };

  const getCompletionPercentage = (statusId: string) => {
    const totalTasks = list.tasks.length;
    if (totalTasks === 0) return 0;

    const tasksInStatus = getTasksByStatus(statusId).length;
    return (tasksInStatus / totalTasks) * 100;
  };

  const moveStatus = (dragIndex: number, hoverIndex: number) => {
    const draggedStatus = list.statuses[dragIndex];

    // Create a new array with the updated order
    const newStatuses = [...list.statuses];
    newStatuses.splice(dragIndex, 1);
    newStatuses.splice(hoverIndex, 0, draggedStatus);

    onReorderStatuses(newStatuses);
  };

  // Sort statuses by order
  const sortedStatuses = [...list.statuses].sort((a, b) => a.order - b.order);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {sortedStatuses.map((status, index) => {
          const statusTasks = getTasksByStatus(status.id);
          const completionPercentage = getCompletionPercentage(status.id);

          return (
            <StatusColumn
              key={status.id}
              index={index}
              status={status}
              tasks={statusTasks}
              onUpdateTask={(task) => onUpdateTask(folderId, list.id, task)}
              onDeleteTask={(taskId) => onDeleteTask(folderId, list.id, taskId)}
              onMoveTask={(taskId, newStatus) => {
                const task = list.tasks.find((t) => t.id === taskId);
                if (task) {
                  onUpdateTask(folderId, list.id, {
                    ...task,
                    status: newStatus,
                  });
                }
              }}
              onAddTask={() => setAddingToStatus(status.id)}
              completionPercentage={completionPercentage}
              moveStatus={moveStatus}
              setEditingTask={setEditingTask}
              setTaskToDelete={setTaskToDelete}
            />
          );
        })}
      </div>

      {/* Add Task Dialog */}
      <Dialog
        open={!!addingToStatus}
        onOpenChange={(open) => !open && setAddingToStatus(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='taskTitle'>Title</Label>
              <Input
                id='taskTitle'
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder='Task title'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='taskDescription'>Description</Label>
              <Input
                id='taskDescription'
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder='Task description'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='taskPriority'>Priority</Label>
              <select
                id='taskPriority'
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='taskDueDate'>Due Date (Optional)</Label>
              <Input
                id='taskDueDate'
                type='date'
                value={
                  newTask.dueDate
                    ? new Date(newTask.dueDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    dueDate: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='editTaskTitle'>Title</Label>
              <Input
                id='editTaskTitle'
                value={editingTask?.title || ''}
                onChange={(e) =>
                  setEditingTask((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                placeholder='Task title'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='editTaskDescription'>Description</Label>
              <Input
                id='editTaskDescription'
                value={editingTask?.description || ''}
                onChange={(e) =>
                  setEditingTask((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                placeholder='Task description'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='editTaskStatus'>Status</Label>
              <select
                id='editTaskStatus'
                value={editingTask?.status || ''}
                onChange={(e) =>
                  setEditingTask((prev) =>
                    prev ? { ...prev, status: e.target.value } : null
                  )
                }
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {sortedStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='editTaskPriority'>Priority</Label>
              <select
                id='editTaskPriority'
                value={editingTask?.priority || 'medium'}
                onChange={(e) =>
                  setEditingTask((prev) =>
                    prev ? { ...prev, priority: e.target.value } : null
                  )
                }
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='editTaskDueDate'>Due Date (Optional)</Label>
              <Input
                id='editTaskDueDate'
                type='date'
                value={
                  editingTask?.dueDate
                    ? new Date(editingTask.dueDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setEditingTask((prev) =>
                    prev
                      ? {
                          ...prev,
                          dueDate: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : null,
                        }
                      : null
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleUpdateTask}>Save Changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirmation */}
      <AlertDialog
        open={!!taskToDelete}
        onOpenChange={() => setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className='bg-destructive text-destructive-foreground'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndProvider>
  );
}

interface StatusColumnProps {
  index: number;
  status: Status;
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: string) => void;
  onAddTask: () => void;
  completionPercentage: number;
  moveStatus: (dragIndex: number, hoverIndex: number) => void;
  setEditingTask: (task: Task) => void;
  setTaskToDelete: (taskId: string) => void;
}

function StatusColumn({
  index,
  status,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onAddTask,
  completionPercentage,
  moveStatus,
  setEditingTask,
  setTaskToDelete,
}: StatusColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ['TASK', 'STATUS'],
    drop: (item: { id?: string; type?: string; index?: number }, monitor) => {
      if (item.type === 'STATUS') {
        return; // Handled by the hover logic
      }

      if (item.id) {
        onMoveTask(item.id, status.id);
      }
    },
    hover: (item: { type?: string; index?: number }, monitor) => {
      if (item.type !== 'STATUS' || item.index === undefined) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      moveStatus(dragIndex, hoverIndex);

      // Update the index for the dragged item
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // For the column itself being dragged
  const [{ isDragging }, drag] = useDrag({
    type: 'STATUS',
    item: { type: 'STATUS', id: status.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Combine the refs
  const dragDropRef = (el: HTMLDivElement) => {
    drag(el);
    drop(el);
  };

  return (
    <div
      ref={dragDropRef}
      className={`flex flex-col h-full min-h-[50vh] rounded-lg border ${
        isOver ? 'border-primary border-dashed' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{
        borderColor: isOver ? status.color : undefined,
        borderWidth: isOver ? '2px' : undefined,
        cursor: 'grab',
      }}
    >
      <div
        className='p-3 font-medium flex items-center justify-between rounded-t-lg'
        style={{ backgroundColor: `${status.color}20` }}
      >
        <div className='flex items-center gap-2'>
          <GripVertical className='h-4 w-4 text-muted-foreground cursor-grab' />
          <span className='text-lg'>{status.emoji}</span>
          <h3 className='font-semibold'>{status.name}</h3>
          <span className='text-xs bg-background rounded-full px-2 py-0.5'>
            {tasks.length}
          </span>
        </div>
        <Button size='sm' variant='ghost' onClick={onAddTask}>
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      <div className='px-3 py-2'>
        <Progress value={completionPercentage} className='h-1.5' />
      </div>

      <div className='flex-1 p-3 space-y-3 overflow-auto'>
        {tasks.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-24 text-muted-foreground text-sm border border-dashed rounded-md'>
            <p>No tasks yet</p>
            <Button
              variant='ghost'
              size='sm'
              onClick={onAddTask}
              className='mt-2'
            >
              <Plus className='h-3 w-3 mr-1' />
              Add task
            </Button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => setTaskToDelete(task.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-background rounded-md border p-3 shadow-sm cursor-grab ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{
        borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
      }}
    >
      <div className='flex justify-between items-start'>
        <h4 className='font-medium text-sm'>{task.title}</h4>
        <div className='flex gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6'
            onClick={onEdit}
          >
            <Edit className='h-3 w-3' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 text-destructive'
            onClick={onDelete}
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className='text-xs text-muted-foreground mt-1'>{task.description}</p>
      )}

      <div className='flex items-center justify-between mt-2'>
        <div
          className='text-xs font-medium'
          style={{ color: getPriorityColor(task.priority) }}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </div>

        {task.dueDate && (
          <div className='flex items-center text-xs text-muted-foreground'>
            <Calendar className='h-3 w-3 mr-1' />
            {format(new Date(task.dueDate), 'MMM d')}
          </div>
        )}
      </div>
    </div>
  );
}
