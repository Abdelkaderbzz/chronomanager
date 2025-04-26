"use client"

import { useState } from "react"
import { useDrop, useDrag } from "react-dnd"
import type { Task, Status, Priority, Tag } from "@/components/task-manager"
import TaskCard from "@/components/task-card"
import TaskForm from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface KanbanBoardProps {
  tasks: Task[]
  statuses: Status[]
  priorities: Priority[]
  tags: Tag[]
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onMoveTask: (taskId: string, newStatus: string) => void
  onReorderTasks: (tasks: Task[]) => void
  onReorderStatuses: (statuses: Status[]) => void
}

export default function KanbanBoard({
  tasks,
  statuses,
  priorities,
  tags,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onReorderTasks,
  onReorderStatuses,
}: KanbanBoardProps) {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false)
  const [addingToStatus, setAddingToStatus] = useState<string | null>(null)

  const handleAddTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    onAddTask(task)
    setShowAddTaskForm(false)
    setAddingToStatus(null)
  }

  const moveTask = (taskId: string, newStatus: string) => {
    onMoveTask(taskId, newStatus)
  }

  const getTasksByStatus = (statusId: string) => {
    return tasks.filter((task) => task.status === statusId)
  }

  const getCompletionPercentage = (statusId: string) => {
    const totalTasks = tasks.length
    if (totalTasks === 0) return 0

    const tasksInStatus = getTasksByStatus(statusId).length
    return (tasksInStatus / totalTasks) * 100
  }

  const moveStatus = (dragIndex: number, hoverIndex: number) => {
    const draggedStatus = statuses[dragIndex]

    // Create a new array with the updated order
    const newStatuses = [...statuses]
    newStatuses.splice(dragIndex, 1)
    newStatuses.splice(hoverIndex, 0, draggedStatus)

    onReorderStatuses(newStatuses)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {statuses.map((status, index) => {
        const statusTasks = getTasksByStatus(status.id)
        const completionPercentage = getCompletionPercentage(status.id)

        return (
          <StatusColumn
            key={status.id}
            index={index}
            status={status}
            tasks={statusTasks}
            priorities={priorities}
            tags={tags}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={moveTask}
            onAddTask={() => {
              setShowAddTaskForm(true)
              setAddingToStatus(status.id)
            }}
            completionPercentage={completionPercentage}
            moveStatus={moveStatus}
          />
        )
      })}

      {showAddTaskForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <TaskForm
              statuses={statuses}
              priorities={priorities}
              tags={tags}
              initialValues={{
                title: "",
                description: "",
                status: addingToStatus || statuses[0].id,
                priority: null,
                dueDate: null,
                tags: [],
              }}
              onSubmit={handleAddTask}
              onCancel={() => {
                setShowAddTaskForm(false)
                setAddingToStatus(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface StatusColumnProps {
  index: number
  status: Status
  tasks: Task[]
  priorities: Priority[]
  tags: Tag[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onMoveTask: (taskId: string, newStatus: string) => void
  onAddTask: () => void
  completionPercentage: number
  moveStatus: (dragIndex: number, hoverIndex: number) => void
}

function StatusColumn({
  index,
  status,
  tasks,
  priorities,
  tags,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onAddTask,
  completionPercentage,
  moveStatus,
}: StatusColumnProps) {
  // For tasks being dropped into this column
  const [{ isOver }, drop] = useDrop({
    accept: ["TASK", "STATUS"],
    drop: (item: { id?: string; type?: string; index?: number }, monitor) => {
      if (item.type === "STATUS") {
        return // Handled by the drag logic
      }

      if (item.id) {
        onMoveTask(item.id, status.id)
      }
    },
    hover: (item: { type?: string; index?: number }, monitor) => {
      if (item.type !== "STATUS" || item.index === undefined) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      moveStatus(dragIndex, hoverIndex)

      // Update the index for the dragged item
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  // For the column itself being dragged
  const [{ isDragging }, drag] = useDrag({
    type: "STATUS",
    item: { type: "STATUS", id: status.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  // Combine the refs
  const dragDropRef = (el: HTMLDivElement) => {
    drag(el)
    drop(el)
  }

  return (
    <div
      ref={dragDropRef}
      className={`flex flex-col h-full min-h-[50vh] rounded-lg border ${isOver ? "border-primary border-dashed" : ""} ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{
        borderColor: isOver ? status.color : undefined,
        borderWidth: isOver ? "2px" : undefined,
        cursor: "grab",
      }}
    >
      <div
        className="p-3 font-medium flex items-center justify-between rounded-t-lg"
        style={{ backgroundColor: `${status.color}20` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{status.emoji}</span>
          <h3 className="font-semibold">{status.name}</h3>
          <span className="text-xs bg-background rounded-full px-2 py-0.5">{tasks.length}</span>
        </div>
        <Button size="sm" variant="ghost" onClick={onAddTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-3 py-2">
        <Progress value={completionPercentage} className="h-1.5" />
      </div>

      <div className="flex-1 p-3 space-y-3 overflow-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-sm border border-dashed rounded-md">
            <p>No tasks yet</p>
            <Button variant="ghost" size="sm" onClick={onAddTask} className="mt-2">
              <Plus className="h-3 w-3 mr-1" />
              Add task
            </Button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              statuses={[status]}
              priorities={priorities}
              tags={tags}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  )
}
