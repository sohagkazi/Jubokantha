"use client"
import { useState } from "react"
import { getApiUrl } from "@/lib/utils"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Translate, useTranslateText } from "@/components/Translate"
export function DonationForm() {
  const [formData, setFormData] = useState({
    fund: "সাধারণ তহবিল",
    name: "",
    mobile: "",
    amount: "",
    currency: "BDT"
  })
  const searchParams = useSearchParams()
  const paymentStatus = searchParams?.get("payment")

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "cancelled">("idle")

  useEffect(() => {
    if (paymentStatus === "success") {
      setStatus("success")
      setTimeout(() => setStatus("idle"), 5000)
    } else if (paymentStatus === "fail" || paymentStatus === "error") {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    } else if (paymentStatus === "cancel") {
      setStatus("cancelled")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }, [paymentStatus])


  const namePlaceholder = useTranslateText("আপনার নাম")
  const mobilePlaceholder = useTranslateText("মোবাইল নম্বর")
  const optGeneral = useTranslateText("সাধারণ তহবিল")
  const optHealthFund = useTranslateText("স্বাস্থ্য তহবিল")
  const optEducationFund = useTranslateText("শিক্ষা তহবিল")
  const optServiceFund = useTranslateText("সেবা তহবিল")
  const optTaka = useTranslateText("টাকা (৳)")
  const optDollar = useTranslateText("ডলার ($)")

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!formData.name || !formData.mobile || !formData.amount) return
    
    setStatus("loading")
    try {
      const response = await fetch(getApiUrl('/api/eps/initiate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No redirect URL returned');
      }
    } catch (error) {
      console.error("Error submitting donation:", error)
      setStatus("error")
    }
  }

  const predefinedAmounts = formData.currency === "BDT" ? ["100", "500", "1000", "5000"] : ["10", "50", "100", "500"]
  const currencySymbol = formData.currency === "BDT" ? "৳" : "$"

  return (
    <div className="bg-[#EBF3FA] rounded-xl p-8 shadow-md border border-blue-100">
       <h2 className="text-2xl font-bold text-primary text-center mb-6"><Translate>যুবকণ্ঠ সোসাইটিকে অনুদান দিন</Translate></h2>
       
       {status === "success" && (
         <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded text-center font-semibold">
            <Translate>ধন্যবাদ! আপনার অনুদানের তথ্য সফলভাবে সংরক্ষিত হয়েছে। আমরা দ্রুত আপনার সাথে যোগাযোগ করবো।</Translate>
         </div>
       )}
       {status === "error" && (
         <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded text-center font-semibold">
            <Translate>দুঃখিত, কোনো একটি সমস্যা হয়েছে বা পেমেন্ট ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।</Translate>
         </div>
       )}
       {status === "cancelled" && (
         <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded text-center font-semibold">
            <Translate>আপনি পেমেন্ট বাতিল করেছেন।</Translate>
         </div>
       )}

       <form onSubmit={handleSubmit}>
         <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="flex-1 w-full">
              <label className="text-sm font-semibold text-gray-600 mb-1 block"><Translate>মুদ্রা</Translate> *</label>
              <select 
                className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-700"
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value, amount: ''})}
              >
                <option value="BDT">{optTaka}</option>
                <option value="USD">{optDollar}</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="text-sm font-semibold text-gray-600 mb-1 block"><Translate>তহবিল</Translate> *</label>
              <select 
                className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-700"
                value={formData.fund}
                onChange={(e) => setFormData({...formData, fund: e.target.value})}
              >
                <option value="সাধারণ তহবিল">{optGeneral}</option>
                <option value="স্বাস্থ্য তহবিল">{optHealthFund}</option>
                <option value="শিক্ষা তহবিল">{optEducationFund}</option>
                <option value="সেবা তহবিল">{optServiceFund}</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="text-sm font-semibold text-gray-600 mb-1 block"><Translate>নাম</Translate> *</label>
              <input 
                type="text" 
                placeholder={namePlaceholder}
                className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-700"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-sm font-semibold text-gray-600 mb-1 block"><Translate>মোবাইল</Translate> *</label>
              <input 
                type="tel" 
                placeholder={mobilePlaceholder}
                className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-700"
                value={formData.mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({...formData, mobile: val});
                }}
                required
              />
            </div>
         </div>
         
         <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
            {predefinedAmounts.map((amt) => (
              <button 
                key={amt}
                type="button"
                onClick={() => setFormData({...formData, amount: amt})}
                className={`px-6 py-2 font-bold rounded shadow-sm transition-colors ${
                  formData.amount === amt 
                    ? "bg-[#00BCD4] text-white" 
                    : "bg-white text-[#00BCD4] border border-[#00BCD4] hover:bg-gray-50"
                }`}
              >
                {currencySymbol} {amt}
              </button>
            ))}
            
            <div className="flex items-center space-x-2">
               <span className="text-gray-600 font-medium"><Translate>অথবা</Translate></span>
               <input 
                 type="number" 
                 placeholder="100" 
                 className="w-24 bg-white border border-gray-300 rounded p-2 text-center"
                 value={formData.amount}
                 onChange={(e) => setFormData({...formData, amount: e.target.value})}
                 required
               />
            </div>
            <button 
              type="submit" 
              className="px-8 py-2 bg-[#F26522] text-white font-bold rounded shadow-md hover:bg-orange-600 transition-colors disabled:opacity-50"
              disabled={status === "loading"}
            >
              {status === "loading" ? <Translate>অপেক্ষা করুন...</Translate> : <Translate>দান করুন</Translate>}
            </button>
         </div>
       </form>
       <p className="text-center text-xs text-gray-500"><Translate>ব্যাংক ট্রান্সফারের মাধ্যমে অনুদান করতে বিস্তারিত জানতে এখানে ক্লিক করুন</Translate></p>
    </div>
  )
}
