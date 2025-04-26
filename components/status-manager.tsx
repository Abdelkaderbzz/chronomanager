"use client"

import { useState } from "react"
import type { Status } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Edit, Plus, Trash2, X, GripVertical } from "lucide-react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { useMediaQuery } from "@/hooks/use-media-query"

interface StatusManagerProps {
  statuses: Status[]
  onAddStatus: (status: Omit<Status, "id" | "order">) => void
  onUpdateStatus: (status: Status) => void
  onDeleteStatus: (statusId: string) => void
  onClose: () => void
}

export function StatusManager({ statuses, onAddStatus, onUpdateStatus, onDeleteStatus, onClose }: StatusManagerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [newStatus, setNewStatus] = useState<Omit<Status, "id" | "order">>({
    name: "",
    emoji: "📋",
    color: "#6366f1",
  })
  const [editingStatus, setEditingStatus] = useState<Status | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleAddStatus = () => {
    if (newStatus.name.trim() === "") return
    onAddStatus(newStatus)
    setNewStatus({
      name: "",
      emoji: "📋",
      color: "#6366f1",
    })
  }

  const handleUpdateStatus = () => {
    if (!editingStatus || editingStatus.name.trim() === "") return
    onUpdateStatus(editingStatus)
    setEditingStatus(null)
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      onDeleteStatus(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const moveStatus = (dragIndex: number, hoverIndex: number) => {
    const draggedStatus = statuses[dragIndex]

    // Create a new array with the updated order
    const newStatuses = [...statuses]
    newStatuses.splice(dragIndex, 1)
    newStatuses.splice(hoverIndex, 0, draggedStatus)

    // Update the order property based on the new positions
    const updatedStatuses = newStatuses.map((status, index) => ({
      ...status,
      order: index,
    }))

    // Update all statuses with their new order
    updatedStatuses.forEach((status) => {
      onUpdateStatus(status)
    })
  }

  // Sort statuses by order for display
  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order)

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Statuses</CardTitle>
              <CardDescription>Add, edit, or remove task statuses. Drag statuses to reorder them.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {sortedStatuses.map((status, index) => (
                <StatusItem
                  key={status.id}
                  status={status}
                  index={index}
                  onEdit={() => setEditingStatus(status)}
                  onDelete={() => setDeleteConfirmId(status.id)}
                  moveStatus={moveStatus}
                />
              ))}
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">{editingStatus ? "Edit Status" : "Add New Status"}</h3>
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_100px_auto]">
                <div className="space-y-2">
                  <Label htmlFor="statusName">Name</Label>
                  <Input
                    id="statusName"
                    value={editingStatus ? editingStatus.name : newStatus.name}
                    onChange={(e) =>
                      editingStatus
                        ? setEditingStatus({ ...editingStatus, name: e.target.value })
                        : setNewStatus({ ...newStatus, name: e.target.value })
                    }
                    placeholder="Status name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statusEmoji">Emoji</Label>
                  <Input
                    id="statusEmoji"
                    value={editingStatus ? editingStatus.emoji : newStatus.emoji}
                    onChange={(e) =>
                      editingStatus
                        ? setEditingStatus({ ...editingStatus, emoji: e.target.value })
                        : setNewStatus({ ...newStatus, emoji: e.target.value })
                    }
                    placeholder="Emoji"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statusColor">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="statusColor"
                      type="color"
                      value={editingStatus ? editingStatus.color : newStatus.color}
                      onChange={(e) =>
                        editingStatus
                          ? setEditingStatus({ ...editingStatus, color: e.target.value })
                          : setNewStatus({ ...newStatus, color: e.target.value })
                      }
                      className="w-12 h-9 p-1"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  {editingStatus ? (
                    <>
                      <Button onClick={handleUpdateStatus}>Update</Button>
                      <Button variant="outline" onClick={() => setEditingStatus(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleAddStatus}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Status
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </CardFooter>

        <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this status. You cannot delete a status that has tasks assigned to it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </DndProvider>
  )
}

interface StatusItemProps {
  status: Status
  index: number
  onEdit: () => void
  onDelete: () => void
  moveStatus: (dragIndex: number, hoverIndex: number) => void
}

function StatusItem({ status, index, onEdit, onDelete, moveStatus }: StatusItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "STATUS_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "STATUS_ITEM",
    hover: (item: { index: number }, monitor) => {
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
  })

  // Combine the refs
  const dragDropRef = (el: HTMLDivElement) => {
    drag(el)
    drop(el)
  }

  return (
    <div
      ref={dragDropRef}
      className={`flex items-center justify-between p-3 border rounded-md ${isDragging ? "opacity-50" : ""}`}
      style={{ borderLeftColor: status.color, borderLeftWidth: "4px", cursor: "grab" }}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <span className="text-lg">{status.emoji}</span>
        <span className="font-medium">{status.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
