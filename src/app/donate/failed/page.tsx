import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { Translate } from '@/components/Translate';

export default function DonationFailedPage() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-100">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <Translate>দুঃখিত!</Translate>
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          <Translate>আপনার অনুদান ব্যর্থ হয়েছে</Translate>
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          <Translate>পেমেন্ট সম্পন্ন করার সময় একটি সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা অন্য কোনো পেমেন্ট মাধ্যম ব্যবহার করুন।</Translate>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/donate">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-md w-full">
              <Translate>আবার চেষ্টা করুন</Translate>
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 px-6 rounded-md w-full">
              <Translate>যোগাযোগ করুন</Translate>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
