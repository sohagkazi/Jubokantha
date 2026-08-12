"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlayCircle, X, Target, TrendingUp, Calendar, ArrowRight } from "lucide-react"
import { Translate } from "@/components/Translate"
import { useState, useEffect } from "react"
import { getNews, NewsItem } from "@/lib/services"
import { collection, query, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getApiUrl } from "@/lib/utils"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  useEffect(() => {
    // Load news
    getNews().then(setNewsItems).catch(console.error)

    // Load projects
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"))
    getDocs(q).then((snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    }).catch(console.error)
  }, [])

  const videoItems = [
    {
      img: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=2070&auto=format&fit=crop",
      title: "ডকুমেন্টারি: কীভাবে একটি সেলাই মেশিন বদলে দিল রহিমা বেগমের জীবন"
    },
    {
      img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
      title: "মাঠপর্যায়ে যুবকণ্ঠের ফ্রি মেডিকেল ক্যাম্পের এক ঝলক"
    },
    {
      img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2071&auto=format&fit=crop",
      title: "আলোর পাঠশালা: হাসিমুখে পড়াশোনা করছে সুবিধাবঞ্চিত শিশুরা"
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
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-md">
            <Translate>নিউজ &amp; স্টোরিজ</Translate>
          </h1>
        </div>
      </div>

      <main className="flex-1 py-16">

        {/* ── Projects Section ─────────────────────────────── */}
        {projects.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-16">
            <div className="flex flex-col items-center justify-center mb-10">
              <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 inline-block">
                <Translate>আমাদের প্রকল্প ও কার্যক্রম</Translate>
              </h2>
              <p className="text-gray-500 mt-2 text-sm text-center">
                <Translate>প্রতিটি প্রকল্পের বিস্তারিত জানতে কার্ডে ক্লিক করুন</Translate>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {projects.map((project) => {
                const pct = project.targetAmount > 0
                  ? Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100))
                  : 0
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                  >
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      {project.imageUrl ? (
                        <img
                          src={getApiUrl(project.imageUrl)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Target className="w-12 h-12 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs font-bold rounded-full shadow">
                        <Translate>প্রকল্প</Translate>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 leading-snug">{project.title}</h3>
                      {project.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 flex-1 mb-3">{project.description}</p>
                      )}
                      {/* Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span className="text-green-600 font-semibold">৳{(project.raisedAmount || 0).toLocaleString()}</span>
                          <span>৳{(project.targetAmount || 0).toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                        <Translate>বিস্তারিত দেখুন</Translate>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── News Section ──────────────────────────────────── */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-16">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 inline-block">
              <Translate>নিউজ &amp; স্টোরিজ</Translate>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <div
                key={i}
                onClick={() => setSelectedNews(item)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {item.imageUrl ? (
                    <Image src={getApiUrl(item.imageUrl)} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-xs text-gray-400 mb-2">{new Date(item.date).toLocaleDateString('bn-BD')}</span>
                  <h3 className="font-bold text-gray-800 mb-2 leading-tight line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 flex-1 line-clamp-3">{item.content}</p>
                </div>
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                    <Translate>বিস্তারিত পড়ুন</Translate>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {newsItems.length === 0 && (
            <div className="text-center py-12 text-gray-400">কোনো নিউজ পাওয়া যায়নি।</div>
          )}
        </section>

        {/* Video Gallery Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-16">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 inline-block">
              <Translate>আমাদের কার্যক্রম সম্পর্কে ভিডিও</Translate>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoItems.map((item, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 group cursor-pointer">
                <div className="relative h-48 w-full flex items-center justify-center">
                  <Image src={item.img} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <PlayCircle className="text-white w-12 h-12 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-sm text-center leading-tight">
                    <Translate>{item.title}</Translate>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>



      {/* ── Project Detail Modal ──────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Image */}
              {selectedProject.imageUrl && (
                <div className="relative h-56 w-full flex-shrink-0">
                  <img src={getApiUrl(selectedProject.imageUrl)} alt={selectedProject.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-12">
                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">প্রকল্প</span>
                  </div>
                </div>
              )}

              {/* Close btn */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{selectedProject.title}</h2>

                {selectedProject.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{selectedProject.description}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">সংগৃহীত</p>
                    <p className="font-bold text-green-700 text-sm">৳{(selectedProject.raisedAmount || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">লক্ষ্যমাত্রা</p>
                    <p className="font-bold text-blue-700 text-sm">৳{(selectedProject.targetAmount || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">অবস্থা</p>
                    <p className="font-bold text-purple-700 text-sm">{selectedProject.status || 'সক্রিয়'}</p>
                  </div>
                </div>

                {/* Progress bar */}
                {selectedProject.targetAmount > 0 && (
                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>অগ্রগতি</span>
                      <span>{Math.min(100, Math.round((selectedProject.raisedAmount / selectedProject.targetAmount) * 100))}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.round((selectedProject.raisedAmount / selectedProject.targetAmount) * 100))}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}

                <Link href={`/donate?project=${selectedProject.id}`} onClick={() => setSelectedProject(null)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl text-base shadow-md">
                    <Translate>এই প্রকল্পে দান করুন</Translate>
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── News Detail Modal ─────────────────────────────── */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedNews(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {selectedNews.imageUrl && (
                <div className="relative h-52 w-full flex-shrink-0">
                  <Image src={getApiUrl(selectedNews.imageUrl)} alt={selectedNews.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              <div className="p-6 overflow-y-auto flex-1">
                <span className="text-xs text-gray-400 block mb-2">{new Date(selectedNews.date).toLocaleDateString('bn-BD')}</span>
                <h2 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{selectedNews.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{selectedNews.content}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
