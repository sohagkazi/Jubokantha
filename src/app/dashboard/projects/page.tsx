"use client"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Folder } from "lucide-react"

export default function ProjectsPage() {
  const projects = [
    { id: 1, name: "Website Redesign", status: "Ongoing", progress: 65, team: 4, dueDate: "Oct 24" },
    { id: 2, name: "Q3 Marketing Campaign", status: "Pending", progress: 10, team: 2, dueDate: "Nov 01" },
    { id: 3, name: "Mobile App MVP", status: "Ongoing", progress: 85, team: 6, dueDate: "Sep 30" },
    { id: 4, name: "Customer Portal", status: "Completed", progress: 100, team: 3, dueDate: "Aug 15" },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage and track all your active projects.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Folder className="h-5 w-5 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
               <span>Due {project.dueDate}</span>
               <span className="px-2 py-1 rounded-full bg-secondary text-xs">{project.status}</span>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-xs">
                 <span>Progress</span>
                 <span>{project.progress}%</span>
               </div>
               <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                 <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.progress}%` }} />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
