"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import type { Folder, List, Task, ViewType } from "@/types/types"
import KanbanView from "@/components/views/kanban-view"
import ChecklistView from "@/components/views/checklist-view"
import PriorityView from "@/components/views/priority-view"
import { Menu, KanbanIcon as LayoutKanban, CheckSquare, BarChart3, Plus, Pencil, Trash2 } from "lucide-react"
import { StatusManager } from "@/components/status-manager"
import type { Status } from "@/types/types"

// Update the MainContentProps interface to include status management functions
interface MainContentProps {
  folder: Folder | null
  list: List | null
  onUpdateList: (folderId: string, list: List) => void
  onDeleteList: (folderId: string, listId: string) => void
  onCreateTask: (folderId: string, listId: string, task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onUpdateTask: (folderId: string, listId: string, task: Task) => void
  onDeleteTask: (folderId: string, listId: string, taskId: string) => void
  onChangeListView: (folderId: string, listId: string, viewType: ViewType) => void
  onCreateStatus: (folderId: string, listId: string, status: Omit<Status, "id" | "order">) => void
  onUpdateStatus: (folderId: string, listId: string, status: Status) => void
  onDeleteStatus: (folderId: string, listId: string, statusId: string) => void
  onReorderStatuses: (folderId: string, listId: string, statuses: Status[]) => void
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

// Update the MainContent component to include status management
export default function MainContent({
  folder,
  list,
  onUpdateList,
  onDeleteList,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onChangeListView,
  onCreateStatus,
  onUpdateStatus,
  onDeleteStatus,
  onReorderStatuses,
  setIsMobileMenuOpen,
}: MainContentProps) {
  const [editingList, setEditingList] = useState<List | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [showAddTask, setShowAddTask] = useState(false)
  const [showStatusManager, setShowStatusManager] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: null,
  })

  const handleUpdateList = () => {
    if (!folder || !editingList) return
    onUpdateList(folder.id, editingList)
    setEditingList(null)
  }

  const handleDeleteList = () => {
    if (!folder || !list) return
    onDeleteList(folder.id, list.id)
    setShowDeleteConfirm(false)
  }

  const handleAddTag = () => {
    if (!editingList || newTag.trim() === "") return
    const formattedTag = newTag.startsWith("#") ? newTag : `#${newTag}`
    setEditingList({
      ...editingList,
      tags: [...editingList.tags, formattedTag],
    })
    setNewTag("")
  }

  const handleRemoveTag = (tag: string) => {
    if (!editingList) return
    setEditingList({
      ...editingList,
      tags: editingList.tags.filter((t) => t !== tag),
    })
  }

  const handleCreateTask = () => {
    if (!folder || !list || newTask.title.trim() === "") return
    onCreateTask(folder.id, list.id, newTask)
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: null,
    })
    setShowAddTask(false)
  }

  // Add renderListView function to pass status management functions to views
  const renderListView = () => {
    if (!folder || !list) return null

    switch (list.viewType) {
      case "kanban":
        return (
          <KanbanView
            folderId={folder.id}
            list={list}
            onCreateTask={onCreateTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onReorderStatuses={(statuses) => onReorderStatuses(folder.id, list.id, statuses)}
          />
        )
      case "checklist":
        return (
          <ChecklistView
            folderId={folder.id}
            list={list}
            onCreateTask={onCreateTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        )
      case "priority":
        return (
          <PriorityView
            folderId={folder.id}
            list={list}
            onCreateTask={onCreateTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        )
      default:
        return null
    }
  }

  if (!folder || !list) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No list selected</h2>
          <p className="text-muted-foreground mb-4">Select a list from the sidebar or create a new one</p>
          <Button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden">
            <Menu className="h-4 w-4 mr-2" />
            Open Sidebar
          </Button>
        </div>
      </div>
    )
  }

  // Add status manager button to the header
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{list?.name}</h2>
              <div className="flex gap-1">
                {list?.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <span style={{ color: folder?.color }}>{folder?.icon}</span> {folder?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {list?.viewType === "kanban" && (
            <Button variant="outline" size="sm" onClick={() => setShowStatusManager(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Manage Statuses
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                {list?.viewType === "kanban" && <LayoutKanban className="h-4 w-4 mr-1" />}
                {list?.viewType === "checklist" && <CheckSquare className="h-4 w-4 mr-1" />}
                {list?.viewType === "priority" && <BarChart3 className="h-4 w-4 mr-1" />}
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => list && folder && onChangeListView(folder.id, list.id, "kanban")}>
                <LayoutKanban className="h-4 w-4 mr-2" />
                Kanban Board
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => list && folder && onChangeListView(folder.id, list.id, "checklist")}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Checklist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => list && folder && onChangeListView(folder.id, list.id, "priority")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Priority Table
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setEditingList(list)
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit List
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit List</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="editListName">List Name</Label>
                      <Input
                        id="editListName"
                        value={editingList?.name || ""}
                        onChange={(e) => setEditingList((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                        placeholder="List name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editListTags">Tags</Label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {editingList?.tags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1"
                          >
                            {tag}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="editListTags"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="#tag"
                          className="flex-1"
                        />
                        <Button type="button" onClick={handleAddTag}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={() => setEditingList(null)}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleUpdateList}>Save Changes</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {showStatusManager && folder && list ? (
          <StatusManager
            statuses={list.statuses}
            onAddStatus={(status) => onCreateStatus(folder.id, list.id, status)}
            onUpdateStatus={(status) => onUpdateStatus(folder.id, list.id, status)}
            onDeleteStatus={(statusId) => onDeleteStatus(folder.id, list.id, statusId)}
            onClose={() => setShowStatusManager(false)}
          />
        ) : (
          renderListView()
        )}
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this list and all its tasks.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteList} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
