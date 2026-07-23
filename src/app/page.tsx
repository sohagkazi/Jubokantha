"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DonationForm } from "@/components/donation-form"
import { OtherWaysToDonate } from "@/components/other-ways-to-donate"
import { Translate } from "@/components/Translate"
import { getSettings } from "@/lib/services"

const DEFAULT_SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=2070&auto=format&fit=crop"
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [bannerImages, setBannerImages] = useState(DEFAULT_SLIDER_IMAGES)
  const [bannerTitle, setBannerTitle] = useState("সম্মিলিত প্রচেষ্টাই স্বনির্ভরতা - যুবকণ্ঠ")
  const [bannerSubtitle, setBannerSubtitle] = useState("আপনার ক্ষুদ্র অনুদান একজন অসহায় মানুষের জীবনের গল্প বদলে দিতে পারে")

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSettings();
        if (settings) {
          if (settings.bannerUrl) setBannerImages([settings.bannerUrl]);
          if (settings.bannerTitle) setBannerTitle(settings.bannerTitle);
          if (settings.bannerSubtitle) setBannerSubtitle(settings.bannerSubtitle);
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
    loadSettings();
  }, [])

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [bannerImages])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Banner Slider */}
      <section className="relative w-full h-[400px] md:h-[500px] bg-slate-900 overflow-hidden">
         <AnimatePresence initial={false}>
           <motion.div
             key={currentSlide}
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.5 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 1 }}
             className="absolute inset-0"
           >
             <Image 
               src={bannerImages[currentSlide]} 
               alt="Charity Banner"
               fill
               className="object-cover"
               priority
             />
           </motion.div>
         </AnimatePresence>
         <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center drop-shadow-xl whitespace-nowrap px-4 leading-snug">
              <Translate>{bannerTitle}</Translate>
            </h1>
            <p className="text-white mt-6 text-lg md:text-xl drop-shadow-md max-w-2xl text-center px-4">
              <Translate>{bannerSubtitle}</Translate>
            </p>
            {bannerImages.length > 1 && (
              <div className="flex space-x-2 mt-8">
                {bannerImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${idx === currentSlide ? 'bg-primary' : 'bg-white/50 hover:bg-white'}`}
                  />
                ))}
             </div>
            )}
        </div>
      </section>

      {/* Quick Donation Section */}
      <section className="max-w-5xl mx-auto -mt-16 relative z-20 w-full px-4 mb-16">
        <DonationForm />
      </section>

      {/* Activities/Projects Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 inline-block"><Translate>আমাদের প্রকল্প ও কর্মসূচি</Translate></h2>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop', title: 'আর্তমানবতার সেবায় স্বাস্থ্যসেবা', desc: 'সুবিধাবঞ্চিত মানুষের দোরগোড়ায় ফ্রি মেডিকেল ক্যাম্প ও জরুরি ঔষধ সরবরাহ।', tag: 'স্বাস্থ্যসেবা' },
              { img: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=2070&auto=format&fit=crop', title: 'বঞ্চিত শিশুদের আলোর পাঠশালা', desc: 'পথশিশুদের অক্ষরজ্ঞান ও নৈতিক শিক্ষাদানের মাধ্যমে সুস্থ জীবনের নিশ্চয়তা।', tag: 'শিক্ষা' },
              { img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop', title: 'ক্ষুধামুক্ত সমাজের লক্ষ্যে আহার', desc: 'ক্ষুধার্ত ও ছিন্নমূল মানুষের মাঝে নিয়মিত পুষ্টিকর খাবার তুলে দেওয়া।', tag: 'খাদ্য সহায়তা' },
              { img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop', title: 'স্বাবলম্বীকরণ প্রজেক্ট - স্বপ্ন বুনন', desc: 'অসহায় নারীদের সেলাই মেশিন ও আত্মকর্মসংস্থানের উপকরণ প্রদান।', tag: 'কর্মসংস্থান' },
              { img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2071&auto=format&fit=crop', title: 'শীতবস্ত্র ও কম্বল বিতরণ', desc: 'প্রচণ্ড শীতে শীতার্ত মানুষের উষ্ণতা ছড়াতে শীতবস্ত্র বিতরণ কর্মসূচি।', tag: 'শীতবস্ত্র' },
              { img: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=2070&auto=format&fit=crop', title: 'জরুরি দুর্যোগ ও ত্রাণ সহায়তা', desc: 'বন্যা, ঘূর্ণিঝড়সহ যেকোনো প্রাকৃতিক দুর্যোগে ক্ষতিগ্রস্তদের পাশে দাঁড়ানো।', tag: 'জরুরি ত্রাণ' },
              { img: 'https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=2071&auto=format&fit=crop', title: 'সবুজ পৃথিবী - বৃক্ষরোপণ', desc: 'পরিবেশ রক্ষায় দেশব্যাপী বৃক্ষরোপণ এবং শহর পরিষ্কার-পরিচ্ছন্ন রাখার উদ্যোগ।', tag: 'পরিবেশ' },
              { img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop', title: 'এতিম ও বিশেষ শিশুদের আবাসন', desc: 'অনাথ শিশুদের নিরাপদ আশ্রয়, খাদ্য ও শিক্ষা নিশ্চিত করার নিরলস প্রচেষ্টা।', tag: 'আবাসন' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded overflow-hidden shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
                 <div className="relative h-48 w-full">
                    <Image src={item.img} alt={item.title} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-white/90 text-primary px-2 py-1 text-xs font-bold rounded shadow-sm">
                       <Translate>{item.tag}</Translate>
                    </div>
                 </div>
                 <div className="p-4 flex-1 flex flex-col text-center sm:text-left">
                    <h3 className="font-bold text-gray-800 mb-2"><Translate>{item.title}</Translate></h3>
                    <p className="text-sm text-gray-600 flex-1"><Translate>{item.desc}</Translate></p>
                 </div>
                 <div className="px-4 pb-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-sm text-sm">
                      <Translate>দান করুন</Translate>
                    </Button>
                 </div>
              </div>
            ))}
         </div>
         <div className="flex justify-center mt-12">
            <Link href="/donate">
              <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white px-8 py-6 rounded text-lg font-bold">
                <Translate>আরও দেখুন</Translate>
              </Button>
            </Link>
         </div>
      </section>

      {/* Other ways to donate */}
      <OtherWaysToDonate />
    </div>
  )
}
