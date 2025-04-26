"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "@/components/task-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TaskFormProps {
  statuses: Array<{ id: string; name: string; emoji: string; color: string }>
  priorities: Array<{ id: string; name: string; emoji: string; color: string }>
  tags: Array<{ id: string; name: string; color: string }>
  initialValues: {
    title: string
    description: string
    status: string
    priority: string | null
    dueDate: string | null
    tags: string[]
  }
  onSubmit: (values: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export default function TaskForm({ statuses, priorities, tags, initialValues, onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState(initialValues)
  const [date, setDate] = useState<Date | undefined>(values.dueDate ? new Date(values.dueDate) : undefined)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setValues({ ...values, [name]: value })
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    setValues({
      ...values,
      dueDate: date ? date.toISOString() : null,
    })
  }

  const handleTagToggle = (tagId: string) => {
    const newTags = values.tags.includes(tagId) ? values.tags.filter((id) => id !== tagId) : [...values.tags, tagId]
    setValues({ ...values, tags: newTags })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={values.title} onChange={handleChange} placeholder="Task title" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Task description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={values.status} onValueChange={(value) => handleSelectChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                <div className="flex items-center gap-2">
                  <span>{status.emoji}</span>
                  <span>{status.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={values.priority || ""} onValueChange={(value) => handleSelectChange("priority", value || null)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <span className="text-muted-foreground">None</span>
            </SelectItem>
            {priorities.map((priority) => (
              <SelectItem key={priority.id} value={priority.id}>
                <div className="flex items-center gap-2">
                  <span>{priority.emoji}</span>
                  <span>{priority.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="grid grid-cols-2 gap-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={values.tags.includes(tag.id)}
                onCheckedChange={() => handleTagToggle(tag.id)}
                style={{ borderColor: tag.color }}
              />
              <Label htmlFor={`tag-${tag.id}`} className="text-sm font-normal" style={{ color: tag.color }}>
                {tag.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
