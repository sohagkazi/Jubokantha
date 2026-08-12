"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download } from 'lucide-react';
import { Translate } from '@/components/Translate';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadReceipt = async () => {
    if (!orderId) return;
    setDownloading(true);
    
    try {
      const donationRef = doc(db, 'donations', orderId);
      const docSnap = await getDoc(donationRef);
      
      if (docSnap.exists()) {
        const donation = docSnap.data();
        const docPdf = new jsPDF();
        
        // Add Header
        docPdf.setFontSize(22);
        docPdf.setTextColor(41, 128, 185); // A nice blue color
        docPdf.text('Jubokantha Society', 105, 20, { align: 'center' });
        
        docPdf.setFontSize(14);
        docPdf.setTextColor(100);
        docPdf.text('Donation Receipt', 105, 30, { align: 'center' });
        
        // Add line separator
        docPdf.setLineWidth(0.5);
        docPdf.setDrawColor(200);
        docPdf.line(20, 35, 190, 35);
        
        // Add Receipt Details
        docPdf.setFontSize(12);
        docPdf.setTextColor(50);
        
        const startY = 50;
        const lineSpacing = 10;
        
        docPdf.text(`Receipt No: ${docSnap.id}`, 20, startY);
        
        let dateObj = new Date();
        if (donation.updatedAt) {
           dateObj = typeof donation.updatedAt.toDate === 'function' ? donation.updatedAt.toDate() : new Date(donation.updatedAt);
        } else if (donation.date) {
           dateObj = typeof donation.date.toDate === 'function' ? donation.date.toDate() : new Date(donation.date);
        }
        
        docPdf.text(`Date: ${format(dateObj, 'dd MMM yyyy, hh:mm a')}`, 20, startY + lineSpacing);
        docPdf.text(`Donor Name: ${donation.donorName || donation.name || 'Unknown Donor'}`, 20, startY + lineSpacing * 2);
        docPdf.text(`Payment Method: ${donation.method || 'EPS Payment'}`, 20, startY + lineSpacing * 3);
        docPdf.text(`Status: ${donation.status || 'Approved'}`, 20, startY + lineSpacing * 4);
        
        if (donation.fund) {
          docPdf.text(`Fund: ${donation.fund}`, 20, startY + lineSpacing * 5);
        }
        
        // Add Amount
        docPdf.setFontSize(16);
        docPdf.setTextColor(40);
        docPdf.text(`Amount: ${donation.amount} BDT`, 20, startY + lineSpacing * 7);
        
        // Add Footer
        docPdf.setFontSize(10);
        docPdf.setTextColor(150);
        docPdf.text('Thank you for your generous donation!', 105, 270, { align: 'center' });
        docPdf.text('This is an electronically generated receipt and does not require a signature.', 105, 276, { align: 'center' });
        
        docPdf.save(`receipt_${docSnap.id}.pdf`);
      } else {
        alert("Receipt not found for this transaction.");
      }
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-100">
      <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        <Translate>অভিনন্দন!</Translate>
      </h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        <Translate>আপনার অনুদান সফল হয়েছে</Translate>
      </h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        <Translate>আপনার মহতী উদ্যোগের জন্য ধন্যবাদ। আপনার অনুদান অসহায় মানুষের জীবন পরিবর্তনে গুরুত্বপূর্ণ ভূমিকা পালন করবে। মহান আল্লাহ আপনার এই দান কবুল করুন।</Translate>
      </p>
      
      <div className="flex flex-col gap-4 justify-center w-full">
        {orderId && (
          <Button 
            onClick={handleDownloadReceipt} 
            disabled={downloading}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            <Translate>{downloading ? "অপেক্ষা করুন..." : "রিসিপ্ট ডাউনলোড করুন"}</Translate>
          </Button>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link href="/" className="w-full">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-md w-full">
              <Translate>হোম পেজে যান</Translate>
            </Button>
          </Link>
          <Link href="/donate" className="w-full">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-medium py-2 px-6 rounded-md w-full">
              <Translate>আবার দান করুন</Translate>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<div className="p-8 text-center"><Translate>অপেক্ষা করুন...</Translate></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
