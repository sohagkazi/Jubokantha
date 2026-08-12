"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { Translate } from "@/components/Translate"

const FacebookIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const TwitterIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
)

const YoutubeIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
)

const LinkedinIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

export function Footer() {
  const pathname = usePathname();
  
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-border pt-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
             <div className="flex items-center gap-3 mb-4">
                <img src="/logo.jpg" alt="Jubokantha Society Logo" className="h-12 w-auto object-contain rounded-full shadow-sm bg-white" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl text-[#138b45] tracking-tight leading-none">JUBOKANTHA</span>
                  <span className="text-sm font-extrabold text-[#d2292d] tracking-widest uppercase mt-0.5">SOCIETY</span>
                </div>
             </div>
             <p className="text-sm text-gray-600 leading-relaxed pr-4">
               <Translate>যুবকণ্ঠ সোসাইটি একটি অলাভজনক, অরাজনৈতিক স্বেচ্ছাসেবী ও দাতব্য সংস্থা। দেশের সুবিধাবঞ্চিত, অসহায় ও দরিদ্র মানুষের জীবনমান উন্নয়নে আমরা নিরলসভাবে কাজ করে যাচ্ছি। আমাদের লক্ষ্য একটি বৈষম্যহীন ও মানবিক সমাজ গড়ে তোলা।</Translate>
             </p>
             <div className="text-sm text-gray-600 space-y-2 mt-6">
               <p className="font-bold text-black text-xs uppercase"><Translate>প্রধান কার্যালয়</Translate></p>
               <p><Translate>হাউজ - ৪/২ , ব্লক - এ , লালমাটিয়া , ঢাকা -১২০৭</Translate></p>
               <p className="mt-4"><span className="font-bold text-black"><Translate>মোবাইল:</Translate></span> +88 01711806060</p>
               <p><span className="font-bold text-black"><Translate>ইমেইল:</Translate></span> jubokantha.jks@gmail.com</p>
             </div>
             
             <div className="flex space-x-3 pt-4">
               <Link href="#" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90">
                 <FacebookIcon size={16} />
               </Link>
               <Link href="#" className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90">
                 <TwitterIcon size={16} />
               </Link>
               <Link href="#" className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90">
                 <YoutubeIcon size={16} />
               </Link>
               <Link href="#" className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90">
                 <LinkedinIcon size={16} />
               </Link>
             </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6 text-black"><Translate>মেনু</Translate></h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-primary transition-colors"><Translate>যুবকণ্ঠ সম্পর্কে</Translate></Link></li>
              <li><Link href="/donate" className="hover:text-primary transition-colors"><Translate>কার্যক্রমসমূহ</Translate></Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors"><Translate>সদস্যবৃন্দ</Translate></Link></li>
              <li><Link href="/news" className="hover:text-primary transition-colors"><Translate>নিউজ & স্টোরিজ</Translate></Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors"><Translate>ভিডিও গ্যালারি</Translate></Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors"><Translate>যুবকণ্ঠ নিউজ</Translate></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-black">যুক্ত হোন</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-primary transition-colors">স্বেচ্ছাসেবক</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">ক্যারিয়ার</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">যাকাত কনফারেন্স</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-black">অন্যান্য</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/contact" className="hover:text-primary transition-colors">যোগাযোগ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">পরিষেবার শর্তাবলী</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">গোপনীয়তা নীতি</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2 pb-8 border-t border-gray-100 pt-8">
         <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="font-bold text-gray-400 text-xs tracking-widest uppercase"><Translate>পেমেন্ট পার্টনার</Translate></h3>
            <img src="/eps-banner.png" alt="Pay with EPS" className="max-w-full h-auto max-h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
         </div>
      </div>

      <div className="bg-[#f4f7fb] py-4 border-t border-gray-200">
        <div className="container mx-auto flex flex-col items-center justify-center space-y-2">
           <div className="flex items-center space-x-2 text-xs text-gray-600">
             <ShieldCheck size={16} className="text-green-600" />
             <span>১৮৬০ সালের সোসাইটিজ রেজিস্ট্রেশন অ্যাক্ট এর অধীনে বাংলাদেশ সরকার দ্বারা নিবন্ধিত।</span>
           </div>
           <p className="text-xs text-gray-500 text-center">
             © {new Date().getFullYear()} যুবকণ্ঠ সোসাইটি। সর্বস্বত্ব সংরক্ষিত।
           </p>
           <p className="text-xs text-gray-500 text-center mt-1">
             Developed By <span className="font-bold text-primary">PieCorn IT</span>
           </p>
        </div>
      </div>
    </footer>
  )
}
