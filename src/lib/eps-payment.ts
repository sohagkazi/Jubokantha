import crypto from 'crypto';

const EPS_API_BASE_URL = 'https://pgapi.eps.com.bd/v1'; // Production URL
const MERCHANT_ID = 'e5d56da0-a2d4-4003-883c-34506f1478a6';
const STORE_ID = '097CEDAA-4A70-4DA0-BBA6-01A9FE44CAAF';
const USERNAME = 'jubokontha.jks@gmail.com';
const PASSWORD = 'Merchant@123';
const HASH_KEY = 'FMUNISHOY2lWZEPSXTy5AD64JUBOKANTH';

export function generateEPSHash(hashKey: string, dataToHash: string): string {
  return crypto
    .createHmac('sha512', Buffer.from(hashKey, 'utf8'))
    .update(Buffer.from(dataToHash, 'utf8'))
    .digest('base64');
}

export async function getEPSToken() {
  const hash = generateEPSHash(HASH_KEY, USERNAME);
  
  const response = await fetch(`${EPS_API_BASE_URL}/Auth/GetToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hash': hash,
    },
    body: JSON.stringify({
      userName: USERNAME,
      password: PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get EPS token: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errorCode) {
    throw new Error(`EPS GetToken Error: ${data.errorMessage}`);
  }
  
  return data.token;
}

export async function initializeEPSPayment(params: {
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  customerOrderId: string;
  merchantTransactionId: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
}) {
  const token = await getEPSToken();
  const hash = generateEPSHash(HASH_KEY, params.merchantTransactionId);

  const payload = {
    storeId: STORE_ID,
    merchantTransactionId: params.merchantTransactionId,
    CustomerOrderId: params.customerOrderId,
    transactionTypeId: 1, // Web
    financialEntityId: 0,
    transitionStatusId: 0,
    totalAmount: params.amount,
    ipAddress: "127.0.0.1",
    version: "1",
    successUrl: params.successUrl,
    failUrl: params.failUrl,
    cancelUrl: params.cancelUrl,
    customerName: params.customerName || "Unknown",
    customerEmail: params.customerEmail || "none@example.com",
    CustomerAddress: params.customerAddress || "Dhaka, Bangladesh",
    CustomerCity: "Dhaka",
    CustomerState: "Dhaka",
    CustomerPostcode: "1000",
    CustomerCountry: "BD",
    CustomerPhone: params.customerPhone || "00000000000",
    ProductName: "Donation",
    NoOfItem: "1"
  };

  const response = await fetch(`${EPS_API_BASE_URL}/EPSEngine/InitializeEPS`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hash': hash,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to initialize EPS payment: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.ErrorCode || data.ErrorMessage) {
    throw new Error(`EPS Initialize Error: ${data.ErrorMessage}`);
  }

  return data;
}

export async function verifyEPSPayment(merchantTransactionId: string) {
  const token = await getEPSToken();
  const hash = generateEPSHash(HASH_KEY, merchantTransactionId);

  const response = await fetch(`${EPS_API_BASE_URL}/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${merchantTransactionId}`, {
    method: 'GET',
    headers: {
      'x-hash': hash,
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to verify EPS payment: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
