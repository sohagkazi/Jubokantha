"use client"

import { useState } from "react"
import Image from "next/image"
import { Translate } from "@/components/Translate"
import { Button } from "@/components/ui/button"

export function InspirationSection() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="container mx-auto max-w-6xl">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary border-b-4 border-accent pb-2 inline-block tracking-tight drop-shadow-sm">
            <Translate>অনুপ্রেরণার বাতিঘর</Translate>
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row-reverse">
            {/* Image Section */}
            <div className="lg:w-2/5 relative h-[450px] lg:h-auto bg-gray-100">
              <Image 
                src="/inspiration.jpg" 
                alt="Late Dr. Zafrullah Chowdhury" 
                fill 
                className="object-cover object-top"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:hidden" />
              <div className="absolute bottom-6 left-6 lg:hidden pr-6">
                <h3 className="text-white text-2xl font-bold leading-tight"><Translate>পরম শ্রদ্ধেয় প্রয়াত ডা. জাফরুল্লাহ চৌধুরী</Translate></h3>
                <p className="text-gray-200 text-sm mt-1 font-medium"><Translate>দিকনির্দেশনা ও অনুপ্রেরণার বাতিঘর</Translate></p>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-2 leading-snug hidden lg:block">
                <Translate>পরম শ্রদ্ধেয় প্রয়াত ডা. জাফরুল্লাহ চৌধুরী</Translate>
              </h3>
              
              <h4 className="text-lg font-semibold text-gray-600 mb-6 hidden lg:block">
                <Translate>দিকনির্দেশনা ও অনুপ্রেরণার বাতিঘর</Translate>
              </h4>

              <div className="space-y-5 text-gray-700 leading-relaxed text-justify">
                <p className="text-lg">
                  <Translate>একটি মহৎ উদ্যোগ বা সেবামূলক প্রতিষ্ঠান কেবল প্রতিষ্ঠাতার শ্রমেই পূর্ণতা পায় না, এর পেছনে প্রয়োজন হয় এমন কোনো মহান ব্যক্তিত্বের আদর্শ ও দিকনির্দেশনা, যিনি তার পুরো জীবন মানবতার সেবায় উৎসর্গ করেছেন। 'যুবকণ্ঠ সোসাইটি'-এর পথচলায় সেই পরম শ্রদ্ধেয় ও অনুকরণীয় বাতিঘর হলেন প্রয়াত ডা. জাফরুল্লাহ চৌধুরী। ছবিতে আমরা দেখতে পাচ্ছি সেই চিরচেনা, সাদাসিধে ও অমায়িক হাসিমাখা মুখটি—যিনি আজীবন এদেশের সাধারণ, সুবিধাবঞ্চিত ও খেটে খাওয়া মানুষের অধিকার আদায়ের জন্য সংগ্রাম করে গেছেন। তিনি আজ সশরীরে আমাদের মাঝে নেই, কিন্তু তার রেখে যাওয়া মানবকল্যাণের আদর্শ যুবকণ্ঠ সোসাইটির প্রতিটি পদক্ষেপে এক অসীম অনুপ্রেরণা হিসেবে কাজ করছে।</Translate>
                </p>

                {isExpanded && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3 border-b-2 border-accent inline-block pb-1">
                        <Translate>যুবকণ্ঠ সোসাইটির পথচলায় তার প্রভাব:</Translate>
                      </h4>
                      <p>
                        <Translate>প্রয়াত ইঞ্জিনিয়ার এম জাকারিয়া যখন শিক্ষা, স্বাস্থ্য, সেবা এবং নারী উন্নয়নের মহান লক্ষ্য নিয়ে 'যুবকণ্ঠ সোসাইটি' প্রতিষ্ঠা করেছিলেন, তখন তার সামনে অন্যতম বড় অনুপ্রেরণা ছিলেন ডা. জাফরুল্লাহ চৌধুরী। ডা. জাফরুল্লাহ আজীবন বিশ্বাস করতেন এবং কাজের মাধ্যমে প্রমাণ করে গেছেন যে—স্বাস্থ্যসেবা ও শিক্ষা কেবল সুবিধাভোগীদের জন্য নয়, বরং তা সমাজের প্রান্তিক মানুষের দোরগোড়ায় পৌঁছানো উচিত। পাশাপাশি, নারীদের স্বাবলম্বী করার ক্ষেত্রেও তার ভূমিকা ছিল এ দেশে পথিকৃতের মতো।</Translate>
                      </p>
                    </div>

                    <div className="mt-5">
                      <p className="mb-3 font-semibold text-gray-800"><Translate>যুবকণ্ঠ সোসাইটি তাদের মূল চারটি লক্ষ্য বাস্তবায়নে সবসময় এই মহান সমাজসেবকের দর্শনকে পাথেয় হিসেবে গ্রহণ করেছে:</Translate></p>
                      
                      <ul className="space-y-3 ml-2">
                        <li className="flex items-start">
                          <span className="text-accent mr-2 mt-1">●</span>
                          <span><strong><Translate>স্বাস্থ্য ও সেবা:</Translate></strong> <Translate>গণস্বাস্থ্য কেন্দ্রের প্রতিষ্ঠাতা হিসেবে তিনি যেভাবে সাধারণ মানুষের দোরগোড়ায় চিকিৎসাসেবা পৌঁছে দিয়েছিলেন, যুবকণ্ঠ সোসাইটিও সেই প্রেরণায় সমাজের অবহেলিত মানুষের স্বাস্থ্য ও সেবায় কাজ করে যাচ্ছে।</Translate></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-accent mr-2 mt-1">●</span>
                          <span><strong><Translate>শিক্ষা ও নারী উন্নয়ন:</Translate></strong> <Translate>নারীদের আত্মনির্ভরশীল ও শিক্ষিত করে তোলার বিষয়ে তার যে সুদূরপ্রসারী চিন্তাধারা ছিল, যুবকণ্ঠ সোসাইটি ঠিক সেই আদর্শ বুকে ধারণ করেই নারীদের ক্ষমতায়নে নিজেদের নিয়োজিত রেখেছে।</Translate></span>
                        </li>
                      </ul>
                    </div>
                    
                    <p className="mt-5">
                      <Translate>তার সাদামাটা জীবনযাপন, মানুষের প্রতি নিঃস্বার্থ ভালোবাসা এবং সততা—যুবকণ্ঠ সোসাইটির প্রতিটি স্বেচ্ছাসেবকের জন্য এক বিশাল শক্তির উৎস। প্রয়াত ইঞ্জিনিয়ার এম জাকারিয়ার গড়া এই সংগঠনটি আজ ডা. জাফরুল্লাহ চৌধুরীর মতো একজন কিংবদন্তির অদৃশ্য দিকনির্দেশনা ও আশীর্বাদ বুকে ধারণ করে দুর্বার গতিতে এগিয়ে যাচ্ছে।</Translate>
                    </p>

                    <div className="bg-primary/5 p-5 rounded-xl border-l-4 border-primary mt-6">
                      <p className="font-medium text-gray-900 italic">
                        "<Translate>আমরা পরম করুণাময়ের কাছে মানবতার এই মহান সেবকের বিদেহী আত্মার চিরশান্তি কামনা করি। তিনি শারীরিকভাবে আমাদের ছেড়ে গেলেও, তার আদর্শ ও অনুপ্রেরণার আলোয় 'যুবকণ্ঠ সোসাইটি' অনন্তকাল মানুষের সেবা করে যাবে।</Translate>"
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
