import { NextResponse } from 'next/server';
import { initializeEPSPayment } from '@/lib/eps-payment';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { fund, name, mobile, amount, currency } = data;

    if (!name || !mobile || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { 
        status: 400,
        headers: corsHeaders,
      });
    }

    const selectedCurrency = currency || 'BDT';
    
    // EPS Gateway in Bangladesh generally processes in BDT. 
    // Converting USD to BDT (Approximate rate 1 USD = 120 BDT).
    let paymentAmount = Number(amount);
    if (selectedCurrency === 'USD') {
      paymentAmount = paymentAmount * 120;
    }

    let orderId = `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    try {
      // Save initial donation record with 'pending' status
      const docRef = await addDoc(collection(db, 'donations'), {
        fund,
        donorName: name,
        mobile,
        amount: Number(amount),
        paymentAmountBDT: paymentAmount,
        currency: selectedCurrency,
        method: 'EPS Payment',
        status: 'pending',
        date: serverTimestamp(),
      });
      orderId = docRef.id;
    } catch (dbError: any) {
      console.warn("Firestore write failed, likely due to Security Rules:", dbError.message);
      // Fallback to local order ID if DB fails
    }
    // Generate unique merchant transaction ID
    const merchantTxId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const paymentResult = await initializeEPSPayment({
      amount: paymentAmount,
      customerName: name,
      customerPhone: mobile,
      customerOrderId: orderId,
      merchantTransactionId: merchantTxId,
      successUrl: `${baseUrl}/api/eps/callback?status=success&orderId=${orderId}`,
      failUrl: `${baseUrl}/api/eps/callback?status=fail&orderId=${orderId}`,
      cancelUrl: `${baseUrl}/api/eps/callback?status=cancel&orderId=${orderId}`,
    });

    return NextResponse.json({
      redirectUrl: paymentResult.RedirectURL,
      transactionId: paymentResult.TransactionId,
    }, {
      headers: corsHeaders,
    });

  } catch (error: any) {
    console.error('Error initiating EPS payment:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}
