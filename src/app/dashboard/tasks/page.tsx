"use client"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical } from "lucide-react"

export default function TasksPage() {
  const columns = [
    { name: "To Do", count: 3, tasks: ["Design System", "Setup Database", "User Authentication"] },
    { name: "In Progress", count: 2, tasks: ["Dashboard Layout", "API Integration"] },
    { name: "Review", count: 1, tasks: ["Landing Page"] },
    { name: "Done", count: 4, tasks: ["Project Setup", "Repo Config", "CI/CD Setup", "Documentation"] },
  ]

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between space-y-2 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Kanban board for team tasks.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full pb-4">
          {columns.map((column, i) => (
            <div key={i} className="flex flex-col flex-shrink-0 w-80 rounded-xl bg-muted/30 border border-border/50">
              <div className="p-4 flex items-center justify-between border-b border-border/50">
                <h3 className="font-semibold">{column.name}</h3>
                <span className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground">{column.count}</span>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {column.tasks.map((task, j) => (
                  <div key={j} className="bg-card border border-border rounded-lg p-4 shadow-sm cursor-grab hover:border-primary/50 transition-colors group">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium">{task}</h4>
                      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="bg-secondary px-2 py-1 rounded">Feature</span>
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                        JD
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
