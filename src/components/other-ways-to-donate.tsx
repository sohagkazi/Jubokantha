import { HeartHandshake } from "lucide-react"
import { Translate } from "@/components/Translate"

export function OtherWaysToDonate() {
  return (
    <section className="bg-[#f4f7fb] py-16 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          <Translate>অনুদানের অন্যান্য উপায়</Translate>
        </h2>
        
        <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
          
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

        </div>
      </div>
    </section>
  )
}
