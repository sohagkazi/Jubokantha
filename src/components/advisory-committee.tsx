"use client"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Translate } from "@/components/Translate"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const advisoryMembers = [
  {
    id: 1,
    name: "Abdus Salam Kazi",
    designation: "President",
    nationality: "Bangladeshi",
    gender: "Male",
    address: "317/2, Jafrabad, Mohammadpur, Dhaka-1207",
    occupation: "Retired Korporal"
  },
  {
    id: 2,
    name: "Shantona Gomez",
    designation: "Vice-president",
    nationality: "Bangladeshi",
    gender: "Female",
    address: "Dhorenda Savar",
    occupation: "House wife"
  },
  {
    id: 3,
    name: "Flory Johana Sarkar",
    designation: "Secretary",
    nationality: "Bangladeshi",
    gender: "Female",
    address: "House: 4/2 Lalmatia, B #A, Mohammadpur, Dhaka -1207",
    occupation: "Business"
  },
  {
    id: 4,
    name: "Kachi Sarkar",
    designation: "Assistance Secretary",
    nationality: "Bangladeshi",
    gender: "Male",
    address: "85 Poolpar, Hossein Shaheb Lane, Mohammadpur, Dhaka-1207",
    occupation: "Business"
  },
  {
    id: 5,
    name: "Sudip Biswas",
    designation: "Treasurer",
    nationality: "Bangladeshi",
    gender: "Male",
    address: "Vill+P.O: Burirdanga, Dist: Mongla",
    occupation: "Business"
  },
  {
    id: 6,
    name: "Nur Ayesha Banu",
    designation: "Office Secretary",
    nationality: "Bangladeshi",
    gender: "Female",
    address: "Jatrabari, Surujnogor Project, Dhaka",
    occupation: "House wife"
  },
  {
    id: 7,
    name: "Tridip Odikari",
    designation: "Executive Member",
    nationality: "Bangladeshi",
    gender: "Male",
    address: "Vill+Post: Digraj, P.S: Mongla",
    occupation: "Business"
  }
];

export function AdvisoryCommittee() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [members, setMembers] = useState<any[]>([]); 

  useEffect(() => {
    const q = query(collection(db, 'advisory_members'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(data);
    });
    return () => unsubscribe();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 mt-12 mb-4 border-t border-gray-100 relative">
      <div className="container mx-auto max-w-7xl relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary border-b-4 border-accent pb-2 inline-block tracking-tight drop-shadow-sm">
            <Translate>উপদেষ্টা মন্ডলী</Translate>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            <Translate>আমাদের সম্মানীয় উপদেষ্টা মন্ডলী</Translate>
          </p>
        </div>

        <div className="relative group">
          {/* Left Arrow */}
          <button 
            onClick={scrollLeft}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg p-2 rounded-full border border-gray-200 text-gray-700 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Horizontal Scroll / Slider */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6"
          >
          {members.map((member) => (
            <div key={member.id} className="min-w-[200px] w-[220px] snap-center flex-shrink-0 bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200">
                 {member.imageUrl ? (
                   <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                 ) : (
                   <Image 
                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name?.replace(/\s+/g, '')}&backgroundColor=c0aede`}
                     alt={member.name || 'Member'}
                     width={96}
                     height={96}
                     className="object-cover w-full h-full"
                     unoptimized
                   />
                 )}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight"><Translate>{member.name}</Translate></h3>
              <p className="text-sm font-semibold text-primary"><Translate>{member.designation}</Translate></p>
            </div>
          ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg p-2 rounded-full border border-gray-200 text-gray-700 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/committee">
            <Button variant="outline" className="text-primary border-2 border-primary hover:bg-primary hover:text-white px-10 py-6 rounded-full text-lg font-bold shadow-sm transition-all duration-300 hover:shadow-lg">
              <Translate>বিস্তারিত দেখুন</Translate>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
