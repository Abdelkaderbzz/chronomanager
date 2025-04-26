"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { List, Task } from "@/types/types"
import { Plus, Edit, Trash2, Calendar, ArrowUpDown } from "lucide-react"
import { format } from "date-fns"

interface PriorityViewProps {
  folderId: string
  list: List
  onCreateTask: (folderId: string, listId: string, task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onUpdateTask: (folderId: string, listId: string, task: Task) => void
  onDeleteTask: (folderId: string, listId: string, taskId: string) => void
}

export default function PriorityView({ folderId, list, onCreateTask, onUpdateTask, onDeleteTask }: PriorityViewProps) {
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    status: list.statuses.length > 0 ? list.statuses[0].id : "todo",
    priority: "medium",
    dueDate: null,
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [sortField, setSortField] = useState<keyof Task>("priority")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleCreateTask = () => {
    if (newTask.title.trim() === "") return
    onCreateTask(folderId, list.id, newTask)
    setNewTask({
      title: "",
      description: "",
      status: list.statuses.length > 0 ? list.statuses[0].id : "todo",
      priority: "medium",
      dueDate: null,
    })
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

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedTasks = [...list.tasks].sort((a, b) => {
    if (sortField === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const aValue = priorityOrder[a.priority as keyof typeof priorityOrder]
      const bValue = priorityOrder[b.priority as keyof typeof priorityOrder]
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    if (sortField === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return sortDirection === "asc" ? -1 : 1
      if (!b.dueDate) return sortDirection === "asc" ? 1 : -1
      return sortDirection === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    }

    if (sortField === "status") {
      // Sort by status order from the list's statuses
      const statusOrder: Record<string, number> = {}
      list.statuses.forEach((status, index) => {
        statusOrder[status.id] = index
      })

      const aValue = statusOrder[a.status] ?? 999
      const bValue = statusOrder[b.status] ?? 999
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    // Default sort by title
    return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
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
        <h3 className="font-medium">Tasks by Priority</h3>
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

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%] cursor-pointer" onClick={() => handleSort("title")}>
                Title
                {sortField === "title" && (
                  <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </TableHead>
              <TableHead className="w-[15%] cursor-pointer" onClick={() => handleSort("priority")}>
                Priority
                {sortField === "priority" && (
                  <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </TableHead>
              <TableHead className="w-[15%] cursor-pointer" onClick={() => handleSort("status")}>
                Status
                {sortField === "status" && (
                  <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </TableHead>
              <TableHead className="w-[15%] cursor-pointer" onClick={() => handleSort("dueDate")}>
                Due Date
                {sortField === "dueDate" && (
                  <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </TableHead>
              <TableHead className="w-[15%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No tasks yet. Add a task to get started.
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map((task) => {
                const status = getStatusById(task.status)

                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="text-xs px-2 py-1 rounded-full inline-block"
                        style={{
                          backgroundColor: `${getPriorityColor(task.priority)}20`,
                          color: getPriorityColor(task.priority),
                        }}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {status && (
                        <div className="flex items-center gap-1">
                          <span>{status.emoji}</span>
                          <span
                            className="text-xs rounded-full px-2 py-1"
                            style={{ backgroundColor: `${status.color}20`, color: status.color }}
                          >
                            {status.name}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
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
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
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
