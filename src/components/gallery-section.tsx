"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Translate } from "@/components/Translate"

export function GallerySection() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('firebase/firestore').then(({ collection, query, orderBy, limit, onSnapshot }) => {
       const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(12));
       const unsubscribe = onSnapshot(q, (snapshot) => {
         const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         setImages(data);
         setLoading(false);
       }, (error) => {
         console.error("Error fetching gallery:", error);
         setLoading(false);
       });
       return () => unsubscribe();
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // if (images.length === 0) return null;

  return (
    <section className="py-16 bg-white w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
         <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary border-b-4 border-accent pb-2 inline-block tracking-tight drop-shadow-sm">
               <Translate>আমাদের গ্যালারি</Translate>
            </h2>
         </div>
         {images.length === 0 ? (
           <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-100 col-span-full">
             <Translate>গ্যালারিতে এখনো কোনো ছবি যুক্ত করা হয়নি।</Translate>
           </div>
         ) : (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {images.map((img) => (
               <div key={img.id} className="relative h-48 sm:h-64 rounded-xl overflow-hidden shadow-sm group bg-gray-100">
                  <Image 
                    src={img.imageUrl} 
                    alt={img.title || "Gallery Image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized={true}
                  />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium line-clamp-2"><Translate>{img.title}</Translate></p>
                    </div>
                  )}
               </div>
             ))}
           </div>
         )}
      </div>
    </section>
  )
}
