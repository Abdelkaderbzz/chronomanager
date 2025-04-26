"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { List, Task } from "@/types/types"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import { format } from "date-fns"

interface ChecklistViewProps {
  folderId: string
  list: List
  onCreateTask: (folderId: string, listId: string, task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onUpdateTask: (folderId: string, listId: string, task: Task) => void
  onDeleteTask: (folderId: string, listId: string, taskId: string) => void
}

export default function ChecklistView({
  folderId,
  list,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: ChecklistViewProps) {
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    status: list.statuses.length > 0 ? list.statuses[0].id : "todo",
    priority: "medium",
    dueDate: null,
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)

  // Find the "done" status ID or use the last status as "done"
  const doneStatusId =
    list.statuses.find((s) => s.id === "done")?.id ||
    (list.statuses.length > 0 ? list.statuses[list.statuses.length - 1].id : "done")

  // Find the first status ID to use as "todo"
  const todoStatusId = list.statuses.length > 0 ? list.statuses[0].id : "todo"

  const handleCreateTask = () => {
    if (newTask.title.trim() === "") return
    onCreateTask(folderId, list.id, newTask)
    setNewTask({
      title: "",
      description: "",
      status: todoStatusId,
      priority: "medium",
      dueDate: null,
    })
    setShowAddTask(false)
  }

  const handleUpdateTask = () => {
    if (!editingTask) return
    onUpdateTask(folderId, list.id, editingTask)
    setEditingTask(null)
  }

  const handleDeleteTask = () => {
    if (!taskToDelete) return
    onDeleteTask(folderId, list.id, taskToDelete)
    setTaskToDelete(null)
  }

  const handleToggleTaskStatus = (task: Task) => {
    const newStatus = task.status === doneStatusId ? todoStatusId : doneStatusId
    onUpdateTask(folderId, list.id, { ...task, status: newStatus })
  }

  const sortedTasks = [...list.tasks].sort((a, b) => {
    // Sort by status (done tasks at the bottom)
    if (a.status === doneStatusId && b.status !== doneStatusId) return 1
    if (a.status !== doneStatusId && b.status === doneStatusId) return -1

    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return (
      priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
    )
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  // Get status by ID
  const getStatusById = (statusId: string) => {
    return list.statuses.find((status) => status.id === statusId)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Tasks</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="taskTitle">Title</Label>
                <Input
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskDescription">Description</Label>
                <Input
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskStatus">Status</Label>
                <select
                  id="taskStatus"
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {list.statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskPriority">Priority</Label>
                <select
                  id="taskPriority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskDueDate">Due Date (Optional)</Label>
                <Input
                  id="taskDueDate"
                  type="date"
                  value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md divide-y">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No tasks yet. Add a task to get started.</div>
        ) : (
          sortedTasks.map((task) => {
            const status = getStatusById(task.status)
            const isDone = task.status === doneStatusId

            return (
              <div key={task.id} className={`p-3 flex items-start gap-3 ${isDone ? "bg-muted/50" : ""}`}>
                <Checkbox checked={isDone} onCheckedChange={() => handleToggleTaskStatus(task)} className="mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className={`text-sm ${isDone ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingTask(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setTaskToDelete(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${getPriorityColor(task.priority)}20`,
                        color: getPriorityColor(task.priority),
                      }}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </div>

                    {status && (
                      <div
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${status.color}20`,
                          color: status.color,
                        }}
                      >
                        {status.emoji} {status.name}
                      </div>
                    )}

                    {task.dueDate && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(task.dueDate), "MMM d")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editTaskTitle">Title</Label>
              <Input
                id="editTaskTitle"
                value={editingTask?.title || ""}
                onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                placeholder="Task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editTaskDescription">Description</Label>
              <Input
                id="editTaskDescription"
                value={editingTask?.description || ""}
                onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                placeholder="Task description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editTaskStatus">Status</Label>
              <select
                id="editTaskStatus"
                value={editingTask?.status || ""}
                onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, status: e.target.value } : null))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {list.statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editTaskPriority">Priority</Label>
              <select
                id="editTaskPriority"
                value={editingTask?.priority || "medium"}
                onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, priority: e.target.value } : null))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editTaskDueDate">Due Date (Optional)</Label>
              <Input
                id="editTaskDueDate"
                type="date"
                value={editingTask?.dueDate ? new Date(editingTask.dueDate).toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setEditingTask((prev) =>
                    prev
                      ? {
                          ...prev,
                          dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                        }
                      : null,
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleUpdateTask}>Save Changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirmation */}
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this task.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
