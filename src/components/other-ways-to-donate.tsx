import { HeartHandshake, Coins, CreditCard } from "lucide-react"
import { Translate } from "@/components/Translate"

export function OtherWaysToDonate() {
  return (
    <section className="bg-[#f4f7fb] py-16 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          <Translate>অনুদানের অন্যান্য উপায়</Translate>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Sadakah Card */}
          <div className="bg-white p-8 rounded-sm shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6">
              <HeartHandshake size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2"><Translate>শিক্ষা</Translate></h3>
            <p className="text-sm font-bold text-gray-600 mb-2"><Translate>ব্যাংক একাউন্ট</Translate></p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Pubali Bank PLC</p>
              <p>Acc Name: <span className="font-bold text-black">JUBOKANTHA Society</span></p>
              <p>Acc No: <span className="font-bold text-black">2584901020126</span></p>
              <p>ELEPHANT ROAD Branch</p>
              <p>SWIFT Code: <span className="font-bold text-black">PUBABDDH</span></p>
              <p>Routing Number: <span className="font-bold text-black">175261332</span></p>
            </div>
          </div>

          {/* Zakat Card */}
          <div className="bg-white p-8 rounded-sm shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6">
              <Coins size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2"><Translate>স্বাস্থ্য</Translate></h3>
            <p className="text-sm font-bold text-gray-600 mb-2"><Translate>ব্যাংক একাউন্ট</Translate></p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Islami Bank PLC</p>
              <p>Acc Name: <span className="font-bold text-black">JUBOKANTHA Society</span></p>
              <p>Acc No: <span className="font-bold text-black">20502050204462112</span></p>
              <p>Dhanmondi Branch</p>
              <p>SWIFT Code: <span className="font-bold text-black">IBBLBDDH</span></p>
              <p>Routing Number: <span className="font-bold text-black">125261182</span></p>
            </div>
          </div>

          {/* Other Options Card */}
          <div className="bg-white p-8 rounded-sm shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6">
              <CreditCard size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2"><Translate>অন্যান্য অপশন</Translate></h3>
            <p className="text-sm font-bold text-gray-600 mb-4"><Translate>অনলাইনে প্রদান করুন</Translate></p>
            
            <button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 px-6 rounded-sm mb-6">
              <Translate>এখানে দান করুন</Translate>
            </button>
            
            <div className="text-xs text-gray-600 space-y-1">
              <p>BKASH (Payment) <span className="font-bold text-black">01730482278</span></p>
              <p>NAGAD (Payment) <span className="font-bold text-black">01730482279</span></p>
              <p>Bkash (Send Money) <span className="font-bold text-black">01730482280</span></p>
              <p>Bkash (Send Money) <span className="font-bold text-black">01321146625</span></p>
              <p>Bkash (Send Money) <span className="font-bold text-black">01321146626</span></p>
              <p>Rocket (Send Money) <span className="font-bold text-black">016747470160</span></p>
              <p>Bkash/Nagad (Send Money) <span className="font-bold text-black">01321146612</span></p>
              <p>Bkash/Nagad (Send Money) <span className="font-bold text-black">01730482277</span></p>
            </div>
            
            <div className="mt-4 text-xs font-bold text-black space-y-1">
              <p><Translate>মোবাইল:</Translate> +88 01711806060</p>
              <p><Translate>ইমেইল:</Translate> jubokantha.jks@gmail.com</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
