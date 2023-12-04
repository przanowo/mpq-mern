import dotenv from 'dotenv';
// import fetch from 'node-fetch';
import { Model } from 'mongoose'; // Import the Model type from mongoose
import { IOrder } from '../types/orderType';

dotenv.config();

const { PAYPAL_CLI_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

interface PayPalData {
  access_token: string;
  status: string;
  purchase_units: [{ amount: { value: string } }];
}

async function getPayPalAccessToken(): Promise<string> {
  console.log('Preparing to fetch PayPal Access Token');

  const auth = Buffer.from(`${PAYPAL_CLI_ID}:${PAYPAL_APP_SECRET}`).toString(
    'base64'
  );
  const url = `${PAYPAL_API_URL}/v1/oauth2/token`;
  console.log('PayPal Token URL:', url);

  const headers = {
    Accept: 'application/json',
    'Accept-Language': 'en_US',
    Authorization: `Basic ${auth}`,
  };
  console.log('Headers for Access Token Request:', headers);

  const body = 'grant_type=client_credentials';

  console.log('Sending request for PayPal Access Token');
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  console.log('PayPal Access Token Response Status:', response.status);
  if (!response.ok) throw new Error('Failed to get access token');

  const paypalData: PayPalData = await response.json();
  console.log('PayPal Access Token Data:', paypalData);

  return paypalData.access_token;
}

export async function checkIfNewTransaction(
  orderModel: Model<IOrder>,
  paypalTransactionId: string
): Promise<boolean> {
  console.log('Checking if new transaction:', paypalTransactionId);
  try {
    const orders = await orderModel.find({
      'paymentResult.id': paypalTransactionId,
    });
    console.log('Orders with transaction ID:', orders);
    return orders.length === 0;
  } catch (err) {
    console.error('Error checking new transaction:', err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

export async function verifyPayPalPayment(
  paypalTransactionId: string
): Promise<{ verified: boolean; value: string }> {
  console.log('Verifying PayPal Payment, ID:', paypalTransactionId);
  console.log('Getting PayPal Access Token');
  const accessToken = await getPayPalAccessToken();
  console.log('Access Token Received:', accessToken);

  const url = `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`;
  console.log('Verifying PayPal Payment, URL:', url);

  const paypalResponse = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log('PayPal Response Status:', paypalResponse.status);
  if (!paypalResponse.ok) throw new Error('Failed to verify payment');

  const paypalData: PayPalData = await paypalResponse.json();
  console.log('PayPal Data:', paypalData);

  return {
    verified: paypalData.status === 'COMPLETED',
    value: paypalData.purchase_units[0].amount.value,
  };
}
