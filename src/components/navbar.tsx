"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { User } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Translate } from '@/components/Translate'

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

  return (
    <nav className="w-full border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Jubokantha Society Logo" className="h-12 w-auto object-contain rounded-full shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl text-[#138b45] tracking-tight leading-none">JUBOKANTHA</span>
              <span className="text-sm font-extrabold text-[#d2292d] tracking-widest uppercase mt-0.5">SOCIETY</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center space-x-6">
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
          <div className="flex items-center space-x-3">
             <div className="flex items-center bg-gray-100 rounded-md p-1 border border-border">
               <button 
                 onClick={() => setLanguage('bn')}
                 className={`px-2 py-1 text-xs font-semibold rounded shadow-sm ${language === 'bn' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'}`}
               >
                 বাং
               </button>
               <button 
                 onClick={() => setLanguage('en')}
                 className={`px-2 py-1 text-xs font-semibold rounded shadow-sm ${language === 'en' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'}`}
               >
                 EN
               </button>
             </div>
             
             {/* Profile Icon */}
             <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full h-9 w-9">
               <User className="h-5 w-5" />
             </Button>

             <Link href="/donate">
               <Button className="bg-primary text-white hover:bg-primary/90 rounded-md shadow-sm"><Translate>দান করুন</Translate></Button>
             </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
