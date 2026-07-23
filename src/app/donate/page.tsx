import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DonationForm } from "@/components/donation-form"
import { Translate } from "@/components/Translate"

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-8 pb-0">
      {/* Quick Donation Section */}
      <section className="max-w-5xl mx-auto relative z-10 w-full px-4 mb-16">
        <DonationForm />
      </section>

      {/* Activities/Projects Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop', title: 'বন্যা দুর্গতদের সহায়তা', desc: 'বন্যা কবলিত মানুষদের মাঝে ত্রাণ ও চিকিৎসা সামগ্রী বিতরণ।', tag: 'জরুরী সহায়তা' },
              { img: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=2070&auto=format&fit=crop', title: 'মাদরাসা ও এতিমখানা', desc: 'এতিম শিশুদের শিক্ষা ও বাসস্থানের ব্যবস্থা করা।', tag: 'শিক্ষা' },
              { img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop', title: 'খাবার বিতরণ', desc: 'অসহায় ও দুঃস্থ মানুষের মাঝে পুষ্টিকর খাবার বিতরণ।', tag: 'খাদ্য সহায়তা' },
              { img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop', title: 'চিকিৎসা সহায়তা', desc: 'গরীব রোগীদের বিনামূল্যে চিকিৎসা সেবা প্রদান।', tag: 'স্বাস্থ্য' },
              { img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2071&auto=format&fit=crop', title: 'শিক্ষাবৃত্তি প্রদান', desc: 'মেধাবী ও দরিদ্র শিক্ষার্থীদের আর্থিক সহায়তা।', tag: 'শিক্ষা' },
              { img: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=2070&auto=format&fit=crop', title: 'বৃক্ষরোপণ কর্মসূচি', desc: 'পরিবেশ রক্ষায় দেশব্যাপী বৃক্ষরোপণ কর্মসূচি।', tag: 'পরিবেশ' },
              { img: 'https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=2071&auto=format&fit=crop', title: 'স্বাস্থ্য ফান্ড', desc: 'স্বাস্থ্য ফান্ডের মাধ্যমে স্বাবলম্বী করার প্রজেক্ট।', tag: 'স্বাস্থ্য' },
              { img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop', title: 'শিক্ষা ফান্ড', desc: 'শিক্ষা ফান্ডের মাধ্যমে দুস্থদের সাহায্য।', tag: 'শিক্ষা' },
              { img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop', title: 'কুরবানি প্রজেক্ট', desc: 'গরিবদের মাঝে কুরবানির মাংস বিতরণ।', tag: 'কুরবানি' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded overflow-hidden shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
                 <div className="relative h-56 w-full">
                    <Image src={item.img} alt={item.title} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-white/90 text-primary px-2 py-1 text-xs font-bold rounded shadow-sm">
                       <Translate>{item.tag}</Translate>
                    </div>
                 </div>
                 <div className="p-4 flex-1 flex flex-col text-center">
                    <h3 className="font-bold text-gray-800 mb-2"><Translate>{item.title}</Translate></h3>
                    <p className="text-sm text-gray-600 flex-1"><Translate>{item.desc}</Translate></p>
                 </div>
                 <div className="px-4 pb-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-sm text-sm">
                      <Translate>দান করুন</Translate>
                    </Button>
                 </div>
              </div>
            ))}
         </div>
      </section>

       {/* Other Ways to Donate */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
           <h2 className="text-2xl font-bold text-gray-800 text-center mb-10"><Translate>অনুদানের অন্যান্য উপায়</Translate></h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">৳</span>
                </div>
                <h3 className="font-bold text-lg mb-4 text-black"><Translate>শিক্ষা</Translate></h3>
                <p className="text-sm font-semibold text-gray-600 mb-2"><Translate>ব্যাংক অ্যাকাউন্ট</Translate></p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Pubali Bank PLC</p>
                  <p>Acc Name: JUBOKANTHA Society</p>
                  <p>Acc No: 2584901020126</p>
                  <p>ELEPHANT ROAD Branch</p>
                  <p>SWIFT Code: PUBABDDH</p>
                  <p>Routing Number: 175261332</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">%</span>
                </div>
                <h3 className="font-bold text-lg mb-4 text-black"><Translate>স্বাস্থ্য</Translate></h3>
                <p className="text-sm font-semibold text-gray-600 mb-2"><Translate>ব্যাংক অ্যাকাউন্ট</Translate></p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Islami Bank PLC</p>
                  <p>Acc Name: JUBOKANTHA Society</p>
                  <p>Acc No: 20502050204462112</p>
                  <p>Dhanmondi Branch</p>
                  <p>SWIFT Code: IBBLBDDH</p>
                  <p>Routing Number: 125261182</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">📱</span>
                </div>
                <h3 className="font-bold text-lg mb-4 text-black"><Translate>অন্যান্য অপশন</Translate></h3>
                <p className="text-sm font-semibold text-gray-600 mb-2"><Translate>অনলাইনে প্রদান করুন</Translate></p>
                <Button className="bg-primary hover:bg-primary/90 text-white text-xs mb-4"><Translate>এখানে দান করুন</Translate></Button>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>BKASH (Payment): 01730482278</p>
                  <p>NAGAD (Payment): 01730482279</p>
                  <p>Bkash (Send Money): 01730482280</p>
                  <p>Rocket (Send Money): 016747470160</p>
                </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  )
}
