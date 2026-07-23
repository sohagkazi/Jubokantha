"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Bot, 
  Settings, 
  Monitor,
  Files
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'AI Assistant', href: '/dashboard/ai', icon: Bot },
  { name: 'Files', href: '/dashboard/files', icon: Files },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/50">
        <Link href="/" className="flex items-center space-x-2">
          <Monitor className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">Piecorn AI OS</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-3 gap-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          // Strict match for dashboard root to avoid highlighting on other pages
          const isActuallyActive = item.href === '/dashboard' ? pathname === '/dashboard' : isActive

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                isActuallyActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActuallyActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </div>
      <div className="mt-auto p-4 border-t border-border/50">
         <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3 shadow-sm glass">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">Pro Plan</span>
            </div>
         </div>
      </div>
    </div>
  )
}
