"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DonationForm } from "@/components/donation-form"
import { OurImpact } from "@/components/our-impact"
import { StatsBar } from "@/components/stats-bar"
import { FounderSection } from "@/components/founder-section"
import { InspirationSection } from "@/components/inspiration-section"
import { ExecutiveCommittee } from "@/components/executive-committee"
import { AdvisoryCommittee } from "@/components/advisory-committee"
import { GallerySection } from "@/components/gallery-section"
import { Translate } from "@/components/Translate"
import { getSettings } from "@/lib/services"
import { getApiUrl } from "@/lib/utils"

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
  const [projects, setProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
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

    // Fetch live projects
    import('firebase/firestore').then(({ collection, query, getDocs, orderBy, limit }) => {
      import('@/lib/firebase').then(({ db }) => {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(8));
        getDocs(q).then((snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProjects(data);
          setLoadingProjects(false);
        }).catch(err => {
          console.error("Error fetching projects:", err);
          setLoadingProjects(false);
        });
      });
    });
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
               src={bannerImages[currentSlide] ? getApiUrl(bannerImages[currentSlide]) : getApiUrl('https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2071&auto=format&fit=crop')} 
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

      {/* Stats Bar */}
      <StatsBar />

      {/* Quick Donation Section */}
      <section className="max-w-5xl mx-auto mt-4 relative z-20 w-full px-4 mb-16">
        <Suspense fallback={<div>Loading...</div>}>
          <DonationForm />
        </Suspense>
      </section>

      {/* Activities/Projects Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
         <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary border-b-4 border-accent pb-2 inline-block tracking-tight drop-shadow-sm"><Translate>আমাদের প্রকল্প ও কর্মসূচি</Translate></h2>
         </div>
         {loadingProjects ? (
           <div className="flex justify-center items-center py-12">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
           </div>
         ) : projects.length === 0 ? (
           <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
             <Translate>কোনো প্রজেক্ট পাওয়া যায়নি।</Translate>
           </div>
         ) : (
           <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {projects.map((item, i) => (
                <div key={item.id || i} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col group hover:shadow-xl transition-all duration-300 min-w-[280px] sm:min-w-0 snap-center">
                   <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                      <Image 
                        src={item.imageUrl ? getApiUrl(item.imageUrl) : getApiUrl('https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=2070&auto=format&fit=crop')} 
                        alt={item.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        unoptimized={true}
                      />
                      <div className="absolute top-3 left-3 bg-white/95 text-primary px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-sm">
                         <Translate>প্রজেক্ট</Translate>
                      </div>
                   </div>
                   <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors"><Translate>{item.title}</Translate></h3>
                      <p className="text-sm text-gray-600 flex-1 line-clamp-3 mb-4"><Translate>{item.description || ''}</Translate></p>
                      <Link href={`/donate?project=${item.id}`} className="mt-auto block">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-5 rounded-lg text-sm shadow-sm hover:shadow-md transition-all active:scale-95">
                          <Translate>দান করুন</Translate>
                        </Button>
                      </Link>
                   </div>
                </div>
              ))}
           </div>
         )}
         <div className="flex justify-center mt-14">
            <Link href="/projects">
              <Button variant="outline" className="text-primary border-2 border-primary hover:bg-primary hover:text-white px-10 py-6 rounded-full text-lg font-bold shadow-sm transition-all duration-300 hover:shadow-lg">
                <Translate>আরও দেখুন</Translate>
              </Button>
            </Link>
         </div>
      </section>

      {/* Founder Section */}
      <FounderSection />

      {/* Inspiration Section */}
      <InspirationSection />

      {/* Executive Committee Section */}
      <ExecutiveCommittee />

      {/* Advisory Committee Section */}
      <AdvisoryCommittee />

      {/* Our Impact Section */}
      <OurImpact />

      {/* Donation Banner */}

      {/* Gallery Section */}
      <GallerySection />
    </div>
  )
}
