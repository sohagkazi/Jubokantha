"use client"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Translate } from "@/components/Translate"
import { Button } from "@/components/ui/button"

export function DonationBanner() {
  return (
    <section className="relative bg-[#114B24] overflow-hidden py-12 lg:py-16 mt-8 mb-16">
      {/* Background Image with Gradient Fade */}
      <div className="absolute top-0 left-0 w-full h-full lg:w-1/2 opacity-30 lg:opacity-100 z-0">
         <Image 
           src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
           alt="Hands holding heart"
           fill
           className="object-cover"
           unoptimized={true}
         />
         <div className="absolute inset-0 bg-gradient-to-r from-[#114B24]/40 via-[#114B24]/80 to-[#114B24] hidden lg:block" />
         <div className="absolute inset-0 bg-[#114B24]/70 lg:hidden" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-5 text-white space-y-4">
             <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                <Translate>আপনার অনুদান</Translate> <br/>
                <Translate>কারও জীবনে আশার আলো</Translate>
             </h2>
             <p className="text-gray-200 mt-4 text-sm md:text-base max-w-sm">
                <Translate>আপনার সামান্য সহযোগিতা একজন অসহায় মানুষের হাসি ফোটাতে পারে। আজই অনুদান দিন।</Translate>
             </p>
             <div className="pt-2">
               <Link href="/donate">
                 <Button className="bg-white text-green-800 hover:bg-gray-100 font-bold px-6 py-5 rounded-md shadow-lg transition-transform hover:scale-105 active:scale-95">
                    <Heart className="w-5 h-5 mr-2 fill-green-700 text-green-700" />
                    <Translate>অনুদান দিন এখনই</Translate>
                 </Button>
               </Link>
             </div>
          </div>

          {/* Right Cards */}
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-6 lg:gap-8">
             
             {/* Bank Card */}
             <div className="flex flex-col">
               <h4 className="text-white text-sm font-semibold mb-3">
                 <Translate>অনুদান পাঠানোর নিয়ম</Translate>
               </h4>
               <div className="bg-white rounded-lg p-5 flex-1 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-green-700 rounded-sm flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-700 rounded-full"></div>
                        </div>
                      </div>
                      <span className="font-bold text-green-800 tracking-tight text-lg">PUBALI BANK PLC.</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-800 font-medium">
                      <p><Translate>হিসাব নাম</Translate>: <span className="font-normal"><Translate>JUBOKANTHA Society</Translate></span></p>
                      <p><Translate>হিসাব নং</Translate>: <span className="font-normal">2584901020126</span></p>
                      <p><Translate>শাখা</Translate>: <span className="font-normal"><Translate>ELEPHANT ROAD Branch</Translate></span></p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/donate?method=bank">
                       <button className="border border-green-600 text-green-700 hover:bg-green-50 px-4 py-1.5 rounded-md text-sm font-bold transition-colors w-full sm:w-auto">
                         <Translate>বিস্তারিত দেখুন</Translate>
                       </button>
                    </Link>
                  </div>
               </div>
             </div>

             {/* QR Code Card */}
             <div className="flex flex-col">
               <h4 className="text-white text-sm font-semibold mb-3">
                 <Translate>QR কোড স্ক্যান করে অনুদান দিন</Translate>
               </h4>
               <div className="bg-white rounded-lg p-5 flex-1 shadow-xl flex flex-col items-center justify-between">
                  <div className="relative w-32 h-32 mb-4">
                     <Image 
                       src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.jubokantha.org"
                       alt="QR Code"
                       fill
                       className="object-contain"
                       unoptimized
                     />
                  </div>
                  <div className="flex items-center justify-center space-x-3 w-full border-t border-gray-100 pt-3">
                    {/* Fake Logos for bKash, Nagad, Rocket */}
                    <div className="text-xs font-bold text-pink-600"><Translate>bKash</Translate></div>
                    <div className="text-xs font-bold text-orange-600"><Translate>নগদ</Translate></div>
                    <div className="text-xs font-bold text-purple-700"><Translate>Rocket</Translate></div>
                  </div>
               </div>
             </div>

          </div>
        </div>
      </div>
    </section>
  )
}
