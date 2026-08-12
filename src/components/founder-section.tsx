"use client"

import { useState } from "react"
import Image from "next/image"
import { Translate } from "@/components/Translate"
import { Button } from "@/components/ui/button"

export function FounderSection() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 mt-8 border-t border-gray-100">
      <div className="container mx-auto max-w-6xl">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary border-b-4 border-accent pb-2 inline-block tracking-tight drop-shadow-sm">
            <Translate>প্রতিষ্ঠাতা</Translate>
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-2/5 relative h-[450px] lg:h-auto bg-gray-100">
              <Image 
                src="/founder.jpg" 
                alt="Late Engineer M Zakaria" 
                fill 
                className="object-cover object-top"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:hidden" />
              <div className="absolute bottom-6 left-6 lg:hidden pr-6">
                <h3 className="text-white text-2xl font-bold leading-tight"><Translate>প্রয়াত ইঞ্জিনিয়ার এম জাকারিয়া</Translate></h3>
                <p className="text-gray-200 text-sm mt-1 font-medium"><Translate>'যুবকন্ঠ সোসাইটি'র রূপকার</Translate></p>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-2 leading-snug hidden lg:block">
                <Translate>প্রয়াত ইঞ্জিনিয়ার এম জাকারিয়া</Translate>
              </h3>
              
              <h4 className="text-lg font-semibold text-gray-600 mb-6 hidden lg:block">
                <Translate>'যুবকন্ঠ সোসাইটি'র রূপকার এবং এক নিবেদিতপ্রাণ সমাজসেবক</Translate>
              </h4>

              <div className="space-y-5 text-gray-700 leading-relaxed text-justify">
                <p className="text-lg">
                  <Translate>ইঞ্জিনিয়ার এম জাকারিয়া হলেন এমন এক মহৎ ব্যক্তিত্ব, যার নিরলস প্রচেষ্টা এবং সুদূরপ্রসারী চিন্তার ফসল আজকের সুপ্রতিষ্ঠিত সেবামূলক সংগঠন 'যুবকন্ঠ সোসাইটি'। ছবিতে দেখা যায় অভিজ্ঞ এবং মার্জিত এই মানুষটিকে, যার সুদৃঢ় নেতৃত্বে সমাজের অবহেলিত মানুষের কল্যাণে নিবেদিত এই সংগঠনটি আজ এক আস্থার নাম। তিনি আজ সশরীরে আমাদের মাঝে নেই, কিন্তু তার রেখে যাওয়া আদর্শ ও মানবকল্যাণের ব্রত তাকে চিরস্মরণীয় করে রাখবে।</Translate>
                </p>

                {isExpanded && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3 border-b-2 border-accent inline-block pb-1">
                        <Translate>সমাজসেবায় তার অবদান ও যুবকন্ঠ সোসাইটির লক্ষ্য:</Translate>
                      </h4>
                      <p>
                        <Translate>পেশায় একজন ইঞ্জিনিয়ার হলেও, তার হৃদয় জুড়ে ছিল দেশ ও সমাজের পিছিয়ে পড়া মানুষের জন্য কাজ করার প্রবল আকাঙ্ক্ষা। তার এই নিঃস্বার্থ সেবার মানসিকতা থেকেই জন্ম নেয় 'যুবকন্ঠ সোসাইটি'। এই সেবামূলক প্রতিষ্ঠানটি গড়ে তোলার পেছনে তার মূল উদ্দেশ্য ছিল সমাজের ভিত্তিগুলোকে মজবুত করা। আর তাই, তার দূরদর্শী চিন্তাধারায় যুবকন্ঠ সোসাইটির প্রধান লক্ষ্য হিসেবে নির্ধারণ করা হয় চারটি গুরুত্বপূর্ণ স্তম্ভ— শিক্ষা, স্বাস্থ্য, সেবা এবং নারী উন্নয়ন।</Translate>
                      </p>
                    </div>

                    <p className="mt-5">
                      <Translate>তিনি গভীরভাবে বিশ্বাস করতেন যে, একটি সুস্থ ও শিক্ষিত সমাজ গঠনের পাশাপাশি নারীদের ক্ষমতায়ন ছাড়া একটি জাতির সার্বিক উন্নয়ন কখনোই সম্ভব নয়। ছবিতে তার শান্ত অথচ দৃঢ় ব্যক্তিত্ব এবং বুকের কাছে ভাঁজ করা হাতগুলো যেন তার এই মহৎ লক্ষ্যগুলোর প্রতি অবিচল অঙ্গীকারেরই প্রতিচ্ছবি। তার নির্দেশিত পথ ধরেই এই সেবামূলক সংগঠনটি আজ সমাজের সুবিধাবঞ্চিতদের মাঝে শিক্ষা বিস্তার, চিকিৎসা ও স্বাস্থ্যসেবা নিশ্চিতকরণ, সাধারণ মানুষের কল্যাণে নিরবচ্ছিন্ন সেবা প্রদান এবং নারীদের স্বাবলম্বী করার মহৎ কার্যক্রমে নিজেদের নিয়োজিত রেখেছে।</Translate>
                    </p>

                    <div className="bg-primary/5 p-5 rounded-xl border-l-4 border-primary mt-6">
                      <p className="font-medium text-gray-900 italic">
                        "<Translate>সংগঠনের প্রতিষ্ঠালগ্নে তিনি যে কঠোর পরিশ্রম ও 'নিরলস প্রচেষ্টা' চালিয়েছিলেন, তা আজ একটি পূর্ণাঙ্গ সেবামূলক প্রতিষ্ঠানে পরিণত হয়ে তার আজীবনের স্বপ্নের সফল বাস্তবায়ন ঘটিয়েছে। প্রয়াত ইঞ্জিনিয়ার এম জাকারিয়া এমন একজন মহৎ প্রাণ ছিলেন, যিনি নিজের জীবন ও মেধা মানবতার কল্যাণে উৎসর্গ করে গেছেন। যুবকন্ঠ সোসাইটির প্রতিটি জনকল্যাণমূলক কাজ এবং প্রচারণার মাঝেই তিনি বেঁচে থাকবেন অনন্তকাল।</Translate>"
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="outline" 
                    className="text-primary border-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Translate>{isExpanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত দেখুন'}</Translate>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
