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
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight, FolderPlus, ListPlus, MoreHorizontal, Pencil, Trash2, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Folder, List } from "@/types/types"

interface SidebarProps {
  folders: Folder[]
  activeFolder: string | null
  activeList: string | null
  onCreateFolder: (folder: Omit<Folder, "id" | "lists">) => void
  onUpdateFolder: (folder: Folder) => void
  onDeleteFolder: (folderId: string) => void
  onCreateList: (folderId: string, list: Omit<List, "id" | "tasks">) => void
  onSelectFolder: (folderId: string | null) => void
  onSelectList: (listId: string | null) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export default function Sidebar({
  folders,
  activeFolder,
  activeList,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onCreateList,
  onSelectFolder,
  onSelectList,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: SidebarProps) {
  const [newFolder, setNewFolder] = useState({
    name: "",
    icon: "📁",
    color: "#3b82f6",
  })
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [newList, setNewList] = useState({
    name: "",
    tags: [] as string[],
    viewType: "kanban" as const,
  })
  const [addingListToFolder, setAddingListToFolder] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")

  const handleCreateFolder = () => {
    if (newFolder.name.trim() === "") return
    onCreateFolder(newFolder)
    setNewFolder({
      name: "",
      icon: "📁",
      color: "#3b82f6",
    })
  }

  const handleUpdateFolder = () => {
    if (!editingFolder || editingFolder.name.trim() === "") return
    onUpdateFolder(editingFolder)
    setEditingFolder(null)
  }

  // Update the handleCreateList function to include default statuses
  const handleCreateList = () => {
    if (!addingListToFolder || newList.name.trim() === "") return

    // Create default statuses based on the view type
    let defaultStatuses = []

    if (newList.viewType === "kanban") {
      defaultStatuses = [
        { id: "todo", name: "To Do", emoji: "🚀", color: "#3b82f6", order: 0 },
        { id: "pending", name: "In Progress", emoji: "⏳", color: "#f59e0b", order: 1 },
        { id: "done", name: "Done", emoji: "✅", color: "#10b981", order: 2 },
      ]
    } else {
      defaultStatuses = [
        { id: "todo", name: "To Do", emoji: "🚀", color: "#3b82f6", order: 0 },
        { id: "done", name: "Done", emoji: "✅", color: "#10b981", order: 1 },
      ]
    }

    onCreateList(addingListToFolder, {
      ...newList,
      statuses: defaultStatuses,
    })

    setNewList({
      name: "",
      tags: [],
      viewType: "kanban",
    })
    setAddingListToFolder(null)

    // Ensure the folder is expanded
    setExpandedFolders({
      ...expandedFolders,
      [addingListToFolder]: true,
    })
  }

  const handleAddTag = () => {
    if (newTag.trim() === "") return
    const formattedTag = newTag.startsWith("#") ? newTag : `#${newTag}`
    setNewList({
      ...newList,
      tags: [...newList.tags, formattedTag],
    })
    setNewTag("")
  }

  const handleRemoveTag = (tag: string) => {
    setNewList({
      ...newList,
      tags: newList.tags.filter((t) => t !== tag),
    })
  }

  const toggleFolderExpand = (folderId: string) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: !expandedFolders[folderId],
    })
  }

  const handleSelectFolder = (folderId: string) => {
    onSelectFolder(folderId)

    // If folder has lists, select the first one
    const folder = folders.find((f) => f.id === folderId)
    if (folder && folder.lists.length > 0) {
      onSelectList(folder.lists[0].id)
    } else {
      onSelectList(null)
    }

    // Expand the folder
    setExpandedFolders({
      ...expandedFolders,
      [folderId]: true,
    })

    // Close mobile menu after selection
    setIsMobileMenuOpen(false)
  }

  const handleSelectList = (listId: string) => {
    onSelectList(listId)

    // Close mobile menu after selection
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-background border-r w-64 flex-shrink-0 flex flex-col h-full transition-all duration-300 ease-in-out z-20",
          isMobileMenuOpen ? "fixed inset-y-0 left-0" : "fixed inset-y-0 -left-64 md:left-0 md:relative",
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-semibold text-lg">Folders & Lists</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <FolderPlus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolder.name}
                    onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                    placeholder="e.g., Work, Personal, Projects"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="folderIcon">Icon/Emoji</Label>
                  <Input
                    id="folderIcon"
                    value={newFolder.icon}
                    onChange={(e) => setNewFolder({ ...newFolder, icon: e.target.value })}
                    placeholder="e.g., 📁, 💼, 🏠"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="folderColor">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="folderColor"
                      type="color"
                      value={newFolder.color}
                      onChange={(e) => setNewFolder({ ...newFolder, color: e.target.value })}
                      className="w-12 h-9 p-1"
                    />
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: newFolder.color }} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleCreateFolder}>Create Folder</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1 p-2">
          {folders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No folders yet</p>
              <p className="text-sm">Create a folder to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {folders.map((folder) => (
                <div key={folder.id} className="space-y-1">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0 mr-1"
                      onClick={() => toggleFolderExpand(folder.id)}
                    >
                      {expandedFolders[folder.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant={activeFolder === folder.id ? "secondary" : "ghost"}
                      className={cn(
                        "justify-start w-full h-8 px-2 font-normal",
                        activeFolder === folder.id && "font-medium",
                      )}
                      onClick={() => handleSelectFolder(folder.id)}
                    >
                      <span className="mr-2" style={{ color: folder.color }}>
                        {folder.icon}
                      </span>
                      <span className="truncate">{folder.name}</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Folder
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Folder</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="editFolderName">Folder Name</Label>
                                <Input
                                  id="editFolderName"
                                  value={editingFolder?.name || folder.name}
                                  onChange={(e) => setEditingFolder({ ...folder, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="editFolderIcon">Icon/Emoji</Label>
                                <Input
                                  id="editFolderIcon"
                                  value={editingFolder?.icon || folder.icon}
                                  onChange={(e) => setEditingFolder({ ...folder, icon: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="editFolderColor">Color</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id="editFolderColor"
                                    type="color"
                                    value={editingFolder?.color || folder.color}
                                    onChange={(e) => setEditingFolder({ ...folder, color: e.target.value })}
                                    className="w-12 h-9 p-1"
                                  />
                                  <div
                                    className="w-8 h-8 rounded-full"
                                    style={{ backgroundColor: editingFolder?.color || folder.color }}
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline" onClick={() => setEditingFolder(null)}>
                                  Cancel
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => {
                                    setEditingFolder(folder)
                                    handleUpdateFolder()
                                  }}
                                >
                                  Save Changes
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <ListPlus className="h-4 w-4 mr-2" />
                              Add List
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New List</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="listName">List Name</Label>
                                <Input
                                  id="listName"
                                  value={newList.name}
                                  onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                                  placeholder="e.g., Project Tasks, Shopping List"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="listTags">Tags</Label>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {newList.tags.map((tag) => (
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
                                    id="listTags"
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
                              <div className="grid gap-2">
                                <Label htmlFor="viewType">Default View</Label>
                                <select
                                  id="viewType"
                                  value={newList.viewType}
                                  onChange={(e) =>
                                    setNewList({
                                      ...newList,
                                      viewType: e.target.value as "kanban" | "checklist" | "priority",
                                    })
                                  }
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <option value="kanban">Kanban Board</option>
                                  <option value="checklist">Checklist</option>
                                  <option value="priority">Priority Table</option>
                                </select>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setNewList({
                                      name: "",
                                      tags: [],
                                      viewType: "kanban",
                                    })
                                    setAddingListToFolder(null)
                                  }}
                                >
                                  Cancel
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => {
                                    setAddingListToFolder(folder.id)
                                    handleCreateList()
                                  }}
                                >
                                  Create List
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={() => setFolderToDelete(folder.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Folder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {expandedFolders[folder.id] && folder.lists.length > 0 && (
                    <div className="ml-6 space-y-1">
                      {folder.lists.map((list) => (
                        <Button
                          key={list.id}
                          variant={activeList === list.id ? "secondary" : "ghost"}
                          className={cn(
                            "justify-start w-full h-8 px-2 font-normal",
                            activeList === list.id && "font-medium",
                          )}
                          onClick={() => handleSelectList(list.id)}
                        >
                          <span className="truncate">{list.name}</span>
                          {list.tags.length > 0 && (
                            <span className="ml-2 text-xs text-muted-foreground">{list.tags[0]}</span>
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Delete folder confirmation */}
      <AlertDialog open={!!folderToDelete} onOpenChange={() => setFolderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this folder and all its lists and tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (folderToDelete) {
                  onDeleteFolder(folderToDelete)
                  setFolderToDelete(null)
                }
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
