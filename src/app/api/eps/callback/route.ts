import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');

    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    if (!orderId) {
      return NextResponse.redirect(new URL('/donate', baseUrl));
    }

    const donationRef = doc(db, 'donations', orderId);

    if (status === 'success') {
      try {
        await updateDoc(donationRef, {
          status: 'Approved',
          updatedAt: serverTimestamp(),
        });
      } catch (dbError) {
         console.warn("Firestore update failed:", dbError);
      }
      return NextResponse.redirect(new URL(`/donate/success?orderId=${orderId}`, baseUrl));
    } else if (status === 'cancel') {
       try {
         await updateDoc(donationRef, {
          status: 'Failed',
          updatedAt: serverTimestamp(),
         });
       } catch (dbError) {
         console.warn("Firestore update failed:", dbError);
       }
      return NextResponse.redirect(new URL('/donate/failed', baseUrl));
    } else {
      try {
        await updateDoc(donationRef, {
          status: 'Failed',
          updatedAt: serverTimestamp(),
        });
      } catch (dbError) {
         console.warn("Firestore update failed:", dbError);
      }
      return NextResponse.redirect(new URL('/donate/failed', baseUrl));
    }
  } catch (error) {
    console.error('Error handling EPS callback:', error);
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    return NextResponse.redirect(new URL('/donate/failed', `${protocol}://${host}`));
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    if (!orderId) {
      return NextResponse.redirect(new URL('/donate', baseUrl));
    }

    const donationRef = doc(db, 'donations', orderId);

    if (status === 'success') {
      try {
        await updateDoc(donationRef, {
          status: 'Approved',
          updatedAt: serverTimestamp(),
        });
      } catch (dbError) {
         console.warn("Firestore update failed:", dbError);
      }
      return NextResponse.redirect(new URL(`/donate/success?orderId=${orderId}`, baseUrl));
    } else if (status === 'cancel') {
       try {
         await updateDoc(donationRef, {
          status: 'Failed',
          updatedAt: serverTimestamp(),
         });
       } catch (dbError) {
         console.warn("Firestore update failed:", dbError);
       }
      return NextResponse.redirect(new URL('/donate/failed', baseUrl));
    } else {
      try {
        await updateDoc(donationRef, {
          status: 'Failed',
          updatedAt: serverTimestamp(),
        });
      } catch (dbError) {
         console.warn("Firestore update failed:", dbError);
      }
      return NextResponse.redirect(new URL('/donate/failed', baseUrl));
    }
  } catch (error) {
    console.error('Error handling EPS callback:', error);
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    return NextResponse.redirect(new URL('/donate/failed', `${protocol}://${host}`));
  }
}
