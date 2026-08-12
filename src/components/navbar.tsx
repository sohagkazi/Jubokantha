"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { Bell } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Translate } from '@/components/Translate'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()

  const navLinks = [
    { href: '/', label: 'হোম' },
    { href: '/donate', label: 'কার্যক্রমসমূহ' },
    { href: '/about', label: 'যুবকণ্ঠ সম্পর্কে' },
    { href: '/news', label: 'নিউজ & স্টোরিজ' },
    { href: '/contact', label: 'যোগাযোগ' },
  ]

  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav className="w-full glass sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="container mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.jpg" alt="Jubokantha Society Logo" className="h-9 w-9 sm:h-12 sm:w-auto object-contain rounded-full shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-2xl text-[#138b45] tracking-tight leading-none">JUBOKANTHA</span>
              <span className="text-[10px] sm:text-sm font-extrabold text-[#d2292d] tracking-widest uppercase mt-0.5">SOCIETY</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`transition-colors py-2 ${
                    isActive 
                      ? "text-primary font-bold border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Translate>{link.label}</Translate>
                </Link>
              )
            })}
          </div>
          
          {/* Controls: Language & Notification */}
          <div className="flex items-center space-x-2 sm:space-x-3">
             <div className="flex items-center bg-secondary/80 backdrop-blur-md rounded-md p-0.5 sm:p-1 border border-border">
               <button 
                 onClick={() => setLanguage('bn')}
                 className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-semibold rounded shadow-sm transition-colors ${language === 'bn' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 বাং
               </button>
               <button 
                 onClick={() => setLanguage('en')}
                 className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-semibold rounded shadow-sm transition-colors ${language === 'en' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 EN
               </button>
             </div>
             
             {/* Desktop Donate Button */}
             <Link href="/donate" className="hidden sm:block">
               <Button className="bg-primary text-white hover:bg-primary/90 rounded-md shadow-sm"><Translate>দান করুন</Translate></Button>
             </Link>

             {/* Mobile Notification Icon instead of Menu */}
             <motion.button 
               whileTap={{ scale: 0.9 }}
               className="md:hidden p-2 rounded-full bg-secondary/50 text-foreground"
             >
               <Bell className="h-5 w-5" />
             </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}
