"use client";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { getSettings } from "@/lib/services";

export function GlobalSettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    async function initSettings() {
      try {
        const settings = await getSettings();
        if (settings?.theme) {
          setTheme(settings.theme);
        }
      } catch (e) {
        console.error("Failed to sync global settings", e);
      }
    }
    initSettings();
  }, [setTheme]);

  return <>{children}</>;
}
