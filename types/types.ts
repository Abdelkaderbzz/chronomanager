export type ViewType = "kanban" | "checklist" | "priority"

export type Status = {
  id: string
  name: string
  emoji: string
  color: string
  order: number
}

export type Task = {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string | null
  createdAt: number
  updatedAt: number
}

export type List = {
  id: string
  name: string
  tags: string[]
  viewType: ViewType
  tasks: Task[]
  statuses: Status[]
  isFavorite?: boolean
}

export type Folder = {
  id: string
  name: string
  icon: string
  color: string
  lists: List[]
  isFavorite?: boolean
}
