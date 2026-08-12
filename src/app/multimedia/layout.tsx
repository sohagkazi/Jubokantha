"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings, Image as ImageIcon, Newspaper, Palette, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MultimediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const checkRole = async () => {
        try {
          let role = null;
          
          // First check users collection
          let docRef = doc(db, "users", user.uid);
          let docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            role = docSnap.data().role;
          } else {
            // Fallback to staff collection
            docRef = doc(db, "staff", user.uid);
            docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              role = docSnap.data().role;
            }
          }

          if (role) {
            const cleanRole = role.trim();
            console.log("User role:", cleanRole);
            const allowedRoles = ["Super Admin", "Admin", "Manager", "Supervisor", "Superviser"];
            if (allowedRoles.includes(cleanRole)) {
              setHasAccess(true);
            } else {
              console.log("Access denied for role:", cleanRole);
              setHasAccess(false);
            }
          } else {
            console.log("User document not found in both collections for uid:", user.uid);
            setHasAccess(false);
          }
        } catch (error) {
          console.error("Error checking role:", error);
          setHasAccess(false);
        }
      };
      checkRole();
    }
  }, [user, authLoading, router]);

  const navItems = [
    { name: "Overview", href: "/multimedia", icon: LayoutDashboard },
    { name: "Theme", href: "/multimedia/theme", icon: Palette },
    { name: "Banner", href: "/multimedia/banner", icon: ImageIcon },
    { name: "News", href: "/multimedia/news", icon: Newspaper },
    { name: "Gallery", href: "/multimedia/gallery", icon: ImageIcon },
  ];

  if (authLoading || hasAccess === null) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (hasAccess === false) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to view the Multimedia dashboard.</p>
          <p className="text-sm text-gray-500">Only Super Admin, Admin, Manager, and Supervisor can access this page.</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Return to Home
          </Button>
          <Button variant="outline" onClick={signOut} className="mt-4 ml-2 text-red-600 hover:text-red-700">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6 px-2">Multimedia</h2>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-background/50">
        {children}
      </div>
    </div>
  );
}
