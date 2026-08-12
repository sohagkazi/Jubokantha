"use client"

import { Users, HeartHandshake, Smile, Sprout } from "lucide-react"
import { Translate } from "@/components/Translate"

export function StatsBar() {
  const stats = [
    {
      icon: <Users className="w-10 h-10 text-[#2e7d32]" />,
      count: "250+",
      label: "স্বেচ্ছাসেবী সদস্য",
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-[#2e7d32]" />,
      count: "120+",
      label: "সফল কার্যক্রম",
    },
    {
      icon: <Smile className="w-10 h-10 text-[#2e7d32]" />,
      count: "5000+",
      label: "সহায়তা প্রাপ্ত মানুষ",
    },
    {
      icon: <Sprout className="w-10 h-10 text-[#2e7d32]" />,
      count: "3000+",
      label: "গাছ রোপণ",
    },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto px-4 relative z-20 -mt-12 sm:-mt-16 mb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-x-0 md:divide-x divide-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center px-4">
              <div className="mb-3 p-2 bg-green-50 rounded-full">
                {stat.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                <Translate>{stat.count}</Translate>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                <Translate>{stat.label}</Translate>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
