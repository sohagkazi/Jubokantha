"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileText, 
  Briefcase, 
  HeartHandshake, 
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ImageIcon
} from 'lucide-react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push('/admin/login');
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50">Loading...</div>;
  }

  // Do not show sidebar on login page
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Prevent rendering admin layout if not authenticated
  if (!user) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Donations', href: '/admin/donations', icon: HeartHandshake },
    { name: 'Our Projects and Activities', href: '/admin/projects', icon: Briefcase },
    { name: 'Our Campaigns', href: '/admin/campaigns', icon: Briefcase },
    { name: 'HR & Payroll', href: '/admin/hr', icon: Users },
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Executive Committee', href: '/admin/committee', icon: Users },
    { name: 'Volunteers', href: '/admin/volunteers', icon: Users },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Finance', href: '/admin/finance', icon: Wallet },
    { name: 'User Management', href: '/admin/users', icon: ShieldCheck },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-primary">Jubokantha Society</span>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center px-4 py-3 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Super Admin
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 md:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-gray-900">Jubokantha Society</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
