"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayPalPayment = exports.checkIfNewTransaction = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PAYPAL_CLI_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;
async function getPayPalAccessToken() {
    console.log('Preparing to fetch PayPal Access Token');
    const auth = Buffer.from(`${PAYPAL_CLI_ID}:${PAYPAL_APP_SECRET}`).toString('base64');
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
    if (!response.ok)
        throw new Error('Failed to get access token');
    const paypalData = await response.json();
    console.log('PayPal Access Token Data:', paypalData);
    return paypalData.access_token;
}
async function checkIfNewTransaction(orderModel, paypalTransactionId) {
    console.log('Checking if new transaction:', paypalTransactionId);
    try {
        const orders = await orderModel.find({
            'paymentResult.id': paypalTransactionId,
        });
        console.log('Orders with transaction ID:', orders);
        return orders.length === 0;
    }
    catch (err) {
        console.error('Error checking new transaction:', err);
        throw err; // Rethrow the error to be handled by the caller
    }
}
exports.checkIfNewTransaction = checkIfNewTransaction;
async function verifyPayPalPayment(paypalTransactionId) {
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
    if (!paypalResponse.ok)
        throw new Error('Failed to verify payment');
    const paypalData = await paypalResponse.json();
    console.log('PayPal Data:', paypalData);
    return {
        verified: paypalData.status === 'COMPLETED',
        value: paypalData.purchase_units[0].amount.value,
    };
}
exports.verifyPayPalPayment = verifyPayPalPayment;
