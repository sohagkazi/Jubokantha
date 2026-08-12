import Image from "next/image"
import { Translate } from "@/components/Translate"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
         <h1 className="text-3xl font-bold text-gray-800 mb-8 pb-2 border-b-2 border-primary inline-block"><Translate>যুবকণ্ঠ সম্পর্কে</Translate></h1>
         
         <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
            <div className="relative w-full h-[400px] mb-8 rounded overflow-hidden">
               <Image 
                 src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
                 alt="About Us"
                 fill
                 className="object-cover"
               />
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 mb-4"><Translate>আমাদের পথচলা</Translate></h2>
              <p className="mb-4 leading-relaxed">
                <Translate>যুবকণ্ঠ সোসাইটি একটি স্বেচ্ছাসেবী, অলাভজনক এবং অরাজনৈতিক দাতব্য সংস্থা। ২০০৭ সাল থেকে আমরা বাংলাদেশের আনাচে-কানাচে অসহায় ও সুবিধা বঞ্চিত মানুষের পাশে দাঁড়িয়েছি। আমাদের মূল লক্ষ্য হলো দারিদ্র্য বিমোচন, শিক্ষা, স্বাস্থ্যসেবা এবং কর্মসংস্থানের মাধ্যমে একটি স্বনির্ভর সমাজ গড়ে তোলা।</Translate>
              </p>
              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4"><Translate>আমাদের লক্ষ্য (Vision)</Translate></h2>
              <p className="mb-4 leading-relaxed">
                <Translate>সমাজের সুবিধা বঞ্চিত মানুষের জীবন যাত্রার মান উন্নয়ন করা।</Translate>
              </p>
              
              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4"><Translate>আমাদের উদ্দেশ্য (Mission)</Translate></h2>
              <ul className="mb-4 leading-relaxed list-decimal list-outside ml-5 space-y-2">
                <li><Translate>সমাজে নারীদেরকে তাদের নিজস্ব প্রচেষ্টার মাধ্যমে স্বাবলম্বী করার প্রচেষ্টা চালানো।</Translate></li>
                <li><Translate>দরিদ্র পরিবারের ছেলে-মেয়েদেরকে শিক্ষা গ্রহণে আগ্রহী করে তোলা এবং পরিবারের সদস্যদেরকে শিশুদের স্কুলে পাঠানোর ব্যাপারে সচেতন করা।</Translate></li>
              </ul>
              <p className="mt-6 mb-4 leading-relaxed font-semibold text-gray-800">
                <Translate>এই লক্ষ্য এবং উদ্দেশ্যকে সামনে রেখে যুবকণ্ঠ সোসাইটি তার কার্যক্রম পরিচালনা করে চলেছে।</Translate>
              </p>
            </div>
         </div>
      </div>
    </div>
  )
}
