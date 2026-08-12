"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, Heart, LayoutDashboard, User } from "lucide-react";
import { motion } from "framer-motion";
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/donate", label: "Donate", icon: Heart },
  ];

  const handleTap = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (e) {
        // ignore if not supported
      }
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] glass">
      <nav className="flex justify-around items-center h-16 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleTap}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`p-1.5 rounded-full ${isActive ? "bg-primary/10" : ""}`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
                {link.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute bottom-0 w-8 h-1 bg-primary rounded-t-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
