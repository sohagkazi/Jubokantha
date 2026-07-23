"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { OtherWaysToDonate } from "@/components/other-ways-to-donate"
import { PlayCircle } from "lucide-react"
import { Translate } from "@/components/Translate"
import { useState, useEffect } from "react"
import { getNews, NewsItem } from "@/lib/services"

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  
  useEffect(() => {
    async function loadNews() {
      try {
        const data = await getNews()
        setNewsItems(data)
      } catch (e) {
        console.error("Failed to fetch news", e)
      }
    }
    loadNews()
  }, [])


  const videoItems = [
    {
      img: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=2070&auto=format&fit=crop",
      title: "ডকুমেন্টারি: কীভাবে একটি সেলাই মেশিন বদলে দিল রহিমা বেগমের জীবন"
    },
    {
      img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
      title: "মাঠপর্যায়ে যুবকণ্ঠের ফ্রি মেডিকেল ক্যাম্পের এক ঝলক"
    },
    {
      img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2071&auto=format&fit=crop",
      title: "আলোর পাঠশালা: হাসিমুখে পড়াশোনা করছে সুবিধাবঞ্চিত শিশুরা"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image 
          src="https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=2070&auto=format&fit=crop" 
          alt="News Banner" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
           <h1 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-md"><Translate>নিউজ & স্টোরিজ</Translate></h1>
        </div>
      </div>

      <main className="flex-1 py-16">
        {/* News Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-16">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 inline-block"><Translate>নিউজ & স্টোরিজ</Translate></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <div key={i} className="bg-white rounded overflow-hidden shadow-sm border border-gray-200 flex flex-col">
                 <div className="relative h-48 w-full">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">No Image</div>
                    )}
                 </div>
                 <div className="p-4 flex-1 flex flex-col">
                    <span className="text-xs text-gray-500 mb-2">{new Date(item.date).toLocaleDateString()}</span>
                    <h3 className="font-bold text-gray-800 mb-2 leading-tight">{item.title}</h3>
                    <p className="text-sm text-gray-600 flex-1 line-clamp-3">{item.content}</p>
                 </div>
                 <div className="px-4 pb-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-sm text-sm">
                      <Translate>বিস্তারিত পড়ুন</Translate>
                    </Button>
                 </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
             <Button className="bg-accent hover:bg-accent/90 text-white font-bold rounded-full px-8"><Translate>আরও দেখুন</Translate></Button>
          </div>
        </section>

        {/* Video Gallery Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-16">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 inline-block"><Translate>আমাদের কার্যক্রম সম্পর্কে ভিডিও</Translate></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoItems.map((item, i) => (
              <div key={i} className="bg-white rounded overflow-hidden shadow-sm border border-gray-200 group cursor-pointer">
                 <div className="relative h-48 w-full flex items-center justify-center">
                    <Image src={item.img} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <PlayCircle className="text-white w-12 h-12 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-sm text-center leading-tight"><Translate>{item.title}</Translate></h3>
                 </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
             <Button className="bg-accent hover:bg-accent/90 text-white font-bold rounded-full px-8"><Translate>আরও দেখুন</Translate></Button>
          </div>
        </section>

      </main>

      {/* Other ways to donate */}
      <OtherWaysToDonate />
    </div>
  )
}
