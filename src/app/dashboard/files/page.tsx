"use client"
import { Button } from "@/components/ui/button"
import { FileText, Image as ImageIcon, FileSpreadsheet, Folder, UploadCloud, MoreVertical } from "lucide-react"

export default function FilesPage() {
  const files = [
    { name: "Q3_Financial_Report.xlsx", type: "spreadsheet", size: "2.4 MB", date: "2 days ago" },
    { name: "Brand_Guidelines.pdf", type: "document", size: "4.1 MB", date: "1 week ago" },
    { name: "Hero_Image_Final.png", type: "image", size: "8.7 MB", date: "2 weeks ago" },
    { name: "Project_Proposal.docx", type: "document", size: "1.2 MB", date: "3 weeks ago" },
  ]

  const getIcon = (type: string) => {
    switch(type) {
      case 'spreadsheet': return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case 'document': return <FileText className="h-8 w-8 text-blue-500" />
      case 'image': return <ImageIcon className="h-8 w-8 text-purple-500" />
      default: return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Files</h2>
          <p className="text-muted-foreground">Manage and organize your documents securely.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
             <Folder className="mr-2 h-4 w-4" /> New Folder
          </Button>
          <Button>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
         <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 text-sm font-medium text-muted-foreground bg-muted/10">
            <div className="col-span-6 md:col-span-5">Name</div>
            <div className="col-span-3 hidden md:block">Date Modified</div>
            <div className="col-span-3 hidden md:block">Size</div>
            <div className="col-span-6 md:col-span-1 text-right">Actions</div>
         </div>
         <div className="divide-y divide-border/50">
            {files.map((file, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors group">
                 <div className="col-span-6 md:col-span-5 flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border shadow-sm">
                       {getIcon(file.type)}
                    </div>
                    <span className="font-medium text-sm truncate">{file.name}</span>
                 </div>
                 <div className="col-span-3 hidden md:block text-sm text-muted-foreground">{file.date}</div>
                 <div className="col-span-3 hidden md:block text-sm text-muted-foreground">{file.size}</div>
                 <div className="col-span-6 md:col-span-1 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}
