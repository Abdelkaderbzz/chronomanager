// Add a function to create default statuses for new lists
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import type { ViewType } from "@/types/types"

interface CreateListProps {
  onCreateList: (list: {
    name: string
    tags: string[]
    viewType: ViewType
  }) => void
  onCancel: () => void
}

export default function CreateList({ onCreateList, onCancel }: CreateListProps) {
  const [newList, setNewList] = useState({
    name: "",
    tags: [] as string[],
    viewType: "kanban" as ViewType,
  })
  const [newTag, setNewTag] = useState("")

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

  const handleSubmit = () => {
    if (newList.name.trim() === "") return
    onCreateList(newList)
  }

  return (
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
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => handleRemoveTag(tag)}>
                <span className="sr-only">Remove</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
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
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={handleSubmit}>Create List</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  )
}
