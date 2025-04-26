"use client"

import { useState } from "react"
import type { Task, Status, Priority, Tag } from "@/components/task-manager"
import TaskForm from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronDown, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface ListViewProps {
  tasks: Task[]
  statuses: Status[]
  priorities: Priority[]
  tags: Tag[]
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onMoveTask: (taskId: string, newStatus: string) => void
}

export default function ListView({
  tasks,
  statuses,
  priorities,
  tags,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
}: ListViewProps) {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [sortField, setSortField] = useState<keyof Task>("updatedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleAddTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    onAddTask(task)
    setShowAddTaskForm(false)
  }

  const handleEditTask = (task: Task) => {
    onUpdateTask(task)
    setEditingTask(null)
  }

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle null values
    if (aValue === null) return sortDirection === "asc" ? -1 : 1
    if (bValue === null) return sortDirection === "asc" ? 1 : -1

    // Convert to strings for comparison if not already strings
    if (typeof aValue !== "string") aValue = String(aValue)
    if (typeof bValue !== "string") bValue = String(bValue)

    return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })

  const getStatusById = (statusId: string) => {
    return statuses.find((status) => status.id === statusId)
  }

  const getPriorityById = (priorityId: string | null) => {
    if (!priorityId) return null
    return priorities.find((priority) => priority.id === priorityId)
  }

  const getTagById = (tagId: string) => {
    return tags.find((tag) => tag.id === tagId)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button onClick={() => setShowAddTaskForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                Title
                {sortField === "title" && (
                  <ChevronDown className={`ml-1 h-4 w-4 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                Status
                {sortField === "status" && (
                  <ChevronDown className={`ml-1 h-4 w-4 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("priority")}>
                Priority
                {sortField === "priority" && (
                  <ChevronDown className={`ml-1 h-4 w-4 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("dueDate")}>
                Due Date
                {sortField === "dueDate" && (
                  <ChevronDown className={`ml-1 h-4 w-4 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No tasks found. Add a new task to get started.
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map((task) => {
                const status = getStatusById(task.status)
                const priority = getPriorityById(task.priority)

                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Checkbox
                        checked={task.status === "done"}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onMoveTask(task.id, "done")
                          } else {
                            // Move back to todo if unchecked
                            onMoveTask(task.id, "todo")
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                      )}
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
                      {priority && (
                        <div className="flex items-center gap-1">
                          <span>{priority.emoji}</span>
                          <span
                            className="text-xs rounded-full px-2 py-1"
                            style={{ backgroundColor: `${priority.color}20`, color: priority.color }}
                          >
                            {priority.name}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tagId) => {
                          const tag = getTagById(tagId)
                          if (!tag) return null
                          return (
                            <Badge key={tagId} variant="outline" style={{ borderColor: tag.color, color: tag.color }}>
                              {tag.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTask(task)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddTaskForm} onOpenChange={setShowAddTaskForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            statuses={statuses}
            priorities={priorities}
            tags={tags}
            initialValues={{
              title: "",
              description: "",
              status: statuses[0].id,
              priority: null,
              dueDate: null,
              tags: [],
            }}
            onSubmit={handleAddTask}
            onCancel={() => setShowAddTaskForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              statuses={statuses}
              priorities={priorities}
              tags={tags}
              initialValues={{
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate,
                tags: editingTask.tags,
              }}
              onSubmit={(values) => handleEditTask({ ...editingTask, ...values })}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
