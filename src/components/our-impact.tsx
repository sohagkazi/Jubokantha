"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Translate } from "@/components/Translate"

export function OurImpact() {
  return (
    <section className="bg-[#f0f4f2] py-16 px-4 sm:px-6 lg:px-8 mt-12 mb-12">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Text Content */}
          <div className="space-y-6">
            <h4 className="text-primary font-bold text-lg md:text-xl">
              <Translate>আমাদের প্রভাব</Translate>
            </h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              <Translate>ছোট ছোট পদক্ষেপ, বদলে দিচ্ছে অনেক জীবন</Translate>
            </h2>
            <p className="text-gray-600 text-lg max-w-lg">
              <Translate>আমরা বিশ্বাস করি, সামান্য একটি সহায়তাও একটি মানুষের জীবনে বড় পরিবর্তন আনতে পারে।</Translate>
            </p>
            <div className="pt-4">
              <Link href="/projects">
                <Button className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-8 py-6 rounded-md text-lg font-semibold shadow-md transition-all duration-300">
                  <Translate>আরও দেখুন</Translate>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side: Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Image 1 */}
              <div className="relative h-[200px] sm:h-[250px] rounded-tl-3xl rounded-br-lg overflow-hidden shadow-sm">
                <Image 
                  src="/uploads/impact/impact1.jpg" 
                  alt="Impact 1"
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              {/* Image 2 */}
              <div className="relative h-[200px] sm:h-[250px] rounded-tr-3xl rounded-bl-lg overflow-hidden shadow-sm">
                <Image 
                  src="/uploads/impact/impact2.jpg" 
                  alt="Impact 2"
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              {/* Image 3 */}
              <div className="relative h-[200px] sm:h-[250px] rounded-bl-3xl rounded-tr-lg overflow-hidden shadow-sm">
                <Image 
                  src="/uploads/impact/impact3.jpg" 
                  alt="Impact 3"
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              {/* Image 4 */}
              <div className="relative h-[200px] sm:h-[250px] rounded-br-3xl rounded-tl-lg overflow-hidden shadow-sm">
                <Image 
                  src="/uploads/impact/impact4.jpg" 
                  alt="Impact 4"
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
            </div>

            {/* Center Logo/Icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 sm:p-3 shadow-xl">
              <div className="bg-white rounded-full flex items-center justify-center p-2">
                 <Image 
                   src="/logo.jpg"
                   alt="Jubokontha Logo"
                   width={60}
                   height={60}
                   className="rounded-full object-contain"
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
