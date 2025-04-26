"use client"

import { useState } from "react"
import { useDrag } from "react-dnd"
import type { Task, Status, Priority, Tag } from "@/components/task-manager"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import TaskForm from "@/components/task-form"
import { Calendar, Edit, Trash2, GripVertical } from "lucide-react"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
  statuses: Status[]
  priorities: Priority[]
  tags: Tag[]
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export default function TaskCard({ task, statuses, priorities, tags, onUpdate, onDelete }: TaskCardProps) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const handleUpdate = (updatedValues: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    onUpdate({ ...task, ...updatedValues })
    setShowEditForm(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    setShowDeleteConfirm(false)
  }

  const getPriorityById = (priorityId: string | null) => {
    if (!priorityId) return null
    return priorities.find((priority) => priority.id === priorityId)
  }

  const getTagById = (tagId: string) => {
    return tags.find((tag) => tag.id === tagId)
  }

  const priority = getPriorityById(task.priority)

  return (
    <>
      <div
        ref={drag}
        className={`bg-card rounded-lg border p-3 shadow-sm transition-all duration-200 hover:shadow-md cursor-grab ${
          isDragging ? "opacity-50" : ""
        }`}
        style={{
          borderLeft: priority ? `4px solid ${priority.color}` : undefined,
        }}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <h3 className="font-medium line-clamp-2">{task.title}</h3>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowEditForm(true)}>
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>

          {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}

          <div className="flex flex-wrap gap-1 pt-1">
            {priority && (
              <div className="flex items-center gap-1 text-xs">
                <span>{priority.emoji}</span>
                <span
                  className="rounded-full px-2 py-0.5"
                  style={{ backgroundColor: `${priority.color}20`, color: priority.color }}
                >
                  {priority.name}
                </span>
              </div>
            )}

            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), "MMM d")}</span>
              </div>
            )}
          </div>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {task.tags.map((tagId) => {
                const tag = getTagById(tagId)
                if (!tag) return null
                return (
                  <Badge
                    key={tagId}
                    variant="outline"
                    className="text-xs py-0 px-2"
                    style={{ borderColor: tag.color, color: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            statuses={statuses}
            priorities={priorities}
            tags={tags}
            initialValues={{
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              dueDate: task.dueDate,
              tags: task.tags,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setShowEditForm(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the task "{task.title}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
