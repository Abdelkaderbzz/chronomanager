"use client"
import FolderListSystem from "@/components/folder-list-system"

export default function TaskManager() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">✨ Whimsical Tasks</h1>
            <p className="text-muted-foreground mt-1">Organize your tasks with folders and lists</p>
          </div>
        </div>

        <FolderListSystem />
      </div>
    </div>
  )
}
