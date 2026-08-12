"use client";

import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export function CapacitorInit() {
  useEffect(() => {
    const initCapacitor = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Set status bar to dark or light depending on theme
          await StatusBar.setStyle({ style: Style.Default });
          // Ensure it overlays the webview for that immersive glass look
          await StatusBar.setOverlaysWebView({ overlay: true });
        } catch (e) {
          console.error("Status bar init failed", e);
        }
      }
    };
    
    initCapacitor();
  }, []);

  return null;
}
