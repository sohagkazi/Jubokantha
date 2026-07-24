"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { User, Menu, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Translate } from '@/components/Translate'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    <nav className="w-full border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.jpg" alt="Jubokantha Society Logo" className="h-10 w-10 sm:h-12 sm:w-auto object-contain rounded-full shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl text-[#138b45] tracking-tight leading-none">JUBOKANTHA</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#d2292d] tracking-widest uppercase mt-0.5">SOCIETY</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-6">
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
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  <Translate>{link.label}</Translate>
                </Link>
              )
            })}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
             <div className="flex items-center bg-gray-100 rounded-md p-0.5 sm:p-1 border border-border">
               <button 
                 onClick={() => setLanguage('bn')}
                 className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-semibold rounded shadow-sm ${language === 'bn' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'}`}
               >
                 বাং
               </button>
               <button 
                 onClick={() => setLanguage('en')}
                 className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-semibold rounded shadow-sm ${language === 'en' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'}`}
               >
                 EN
               </button>
             </div>
             
             {/* Profile Icon */}
             <Button variant="ghost" size="icon" className="hidden sm:flex text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full h-9 w-9">
               <User className="h-5 w-5" />
             </Button>

             <Link href="/donate" className="hidden sm:block">
               <Button className="bg-primary text-white hover:bg-primary/90 rounded-md shadow-sm"><Translate>দান করুন</Translate></Button>
             </Link>

             {/* Mobile Menu Toggle */}
             <Button 
               variant="ghost" 
               size="icon" 
               className="md:hidden text-gray-600 hover:text-primary hover:bg-gray-100 ml-1"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white shadow-md absolute w-full">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <Translate>{link.label}</Translate>
                </Link>
              )
            })}
            <div className="pt-4 pb-2 border-t border-gray-100 sm:hidden flex flex-col gap-3">
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary">
                <User className="h-5 w-5" />
                <span className="font-medium"><Translate>প্রোফাইল</Translate></span>
              </Link>
              <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-md shadow-sm">
                  <Translate>দান করুন</Translate>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
