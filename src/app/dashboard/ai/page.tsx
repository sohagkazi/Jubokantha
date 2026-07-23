"use client"
import { Button } from "@/components/ui/button"
import { Bot, Send, Sparkles } from "lucide-react"
import { useState } from "react"

export default function AIAssistantPage() {
  const [input, setInput] = useState("")

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-muted/10 relative overflow-hidden">
      {/* Cool background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none" />

      <div className="flex-1 overflow-y-auto p-8 space-y-6 z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-2 mb-12">
           <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 shadow-lg">
             <Sparkles className="h-8 w-8 text-primary" />
           </div>
           <h2 className="text-3xl font-bold tracking-tight">Piecorn AI Assistant</h2>
           <p className="text-muted-foreground max-w-md">I can help you analyze data, draft emails, manage projects, and provide insights.</p>
        </div>

        {/* Dummy Chat Messages */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="bg-card border border-border p-4 rounded-xl rounded-tl-sm text-sm shadow-sm glass">
              Hello! I'm your Piecorn AI assistant. How can I help you optimize your workflow today?
            </div>
          </div>
          <div className="flex gap-4 flex-row-reverse">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 text-xs shadow-md">
              JD
            </div>
            <div className="bg-primary text-primary-foreground p-4 rounded-xl rounded-tr-sm text-sm shadow-md">
              Can you summarize my project progress for this week?
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="bg-card border border-border p-4 rounded-xl rounded-tl-sm text-sm shadow-sm glass">
              Certainly! You have 4 active projects. The "Mobile App MVP" is at 85% completion, up 10% from last week. The "Website Redesign" is on track at 65%. However, "Q3 Marketing Campaign" is pending at 10% and needs attention soon.
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-background/80 backdrop-blur-md border-t border-border z-10 shrink-0">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask AI anything..." 
            className="w-full bg-card border border-border rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button size="icon" className="absolute right-2 rounded-full h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">AI can make mistakes. Consider verifying important information.</p>
      </div>
    </div>
  )
}
