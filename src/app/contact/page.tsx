"use client"
import { Translate, useTranslateText } from "@/components/Translate"

export default function ContactPage() {
  const namePlaceholder = useTranslateText("আপনার নাম")
  const emailPlaceholder = useTranslateText("আপনার ইমেইল")
  const msgPlaceholder = useTranslateText("আপনার বার্তা লিখুন")

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-4"><Translate>যোগাযোগ</Translate></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6"><Translate>যোগাযোগ ফর্ম</Translate></h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1"><Translate>নাম</Translate></label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                  placeholder={namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1"><Translate>ইমেইল</Translate></label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                  placeholder={emailPlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1"><Translate>বার্তা</Translate></label>
                <textarea 
                  className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none h-40 resize-none" 
                  placeholder={msgPlaceholder}
                ></textarea>
              </div>
              <button 
                type="button" 
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-sm text-sm"
              >
                <Translate>প্রেরণ করুন</Translate>
              </button>
            </form>
          </div>

          {/* Map */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6"><Translate>আমাদের ঠিকানা</Translate></h2>
            <div className="w-full h-[400px] bg-gray-200 rounded-sm overflow-hidden shadow-sm">
              <iframe 
                src="https://maps.google.com/maps?q=23.7566684,90.3736938&z=18&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      {/* Other ways to donate */}

    </div>
  )
}
