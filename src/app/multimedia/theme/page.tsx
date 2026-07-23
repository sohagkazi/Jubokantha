"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSettings, updateSettings } from "@/lib/services";

export default function ThemePage() {
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  
  const handleSave = async (newTheme: string) => {
    setSaving(true);
    setTheme(newTheme);
    try {
      await updateSettings({ theme: newTheme });
    } catch (e) {
      console.error("Failed to save theme", e);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Theme Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how your site looks. These settings will be applied globally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <button
              onClick={() => handleSave("light")}
              className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                theme === "light" ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white border border-gray-200 mb-3 shadow-sm"></div>
              <span className="font-medium">Light</span>
            </button>
            <button
              onClick={() => handleSave("dark")}
              className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                theme === "dark" ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 mb-3 shadow-sm"></div>
              <span className="font-medium">Dark</span>
            </button>
            <button
              onClick={() => handleSave("system")}
              className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                theme === "system" ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-zinc-950 border border-zinc-200 mb-3 shadow-sm"></div>
              <span className="font-medium">System</span>
            </button>
          </div>
          {saving && <p className="text-sm text-muted-foreground animate-pulse">Saving settings...</p>}
        </CardContent>
      </Card>
    </div>
  );
}
