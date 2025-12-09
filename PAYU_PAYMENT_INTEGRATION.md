# PayU Payment Integration - Complete Setup Guide

## Overview
Swar Yoga now integrates with **PayU** payment gateway with support for:
- ✅ PayU Payments (Card, Netbanking, UPI, Wallet)
- ✅ PayPal Integration
- ✅ QR Code Payments (Nepal)
- ✅ Multi-Currency Support (INR, NPR, USD)
- ✅ Payment Refunds
- ✅ Transaction Verification

---

## Environment Configuration

### Backend `.env` File Setup

Add the following environment variables to your `server/.env` file:

```env
# PayU Configuration
PAYU_MERCHANT_KEY=gtKFFx
PAYU_MERCHANT_SALT=eCwWELxi
PAYU_BASE_URL=https://secure.payu.in

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_EMAIL=your_paypal_email@example.com

# UPI Configuration (for Nepal/India)
UPI_ID=your_upi_id@bank

# Frontend URLs for Callbacks
FRONTEND_URL=http://localhost:5173
```

---

## Payment API Endpoints

### 1. Create Payment (Initiate Order)
```
POST /api/payment
```

**Request Body:**
```json
{
  "enrollmentId": "enrollment_id",
  "userId": "user_id",
  "workshopId": "workshop_id",
  "amount": 5000,
  "currency": "INR",
  "subtotal": 5000,
  "paymentMethod": "payu",
  "firstName": "John",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

**Response (PayU):**
```json
{
  "success": true,
  "paymentId": "payment_object_id",
  "txnid": "TXN-1702200000000",
  "payuData": {
    "key": "gtKFFx",
    "txnid": "TXN-1702200000000",
    "amount": "5000",
    "productinfo": "Workshop Enrollment",
    "firstname": "John",
    "email": "john@example.com",
    "hash": "sha512_hash_here",
    "payuBaseUrl": "https://secure.payu.in"
  }
}
```

**Response (PayPal):**
```json
{
  "success": true,
  "paymentId": "payment_object_id",
  "txnid": "TXN-1702200000000",
  "paypalLink": "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&..."
}
```

**Response (UPI/QR - Nepal):**
```json
{
  "success": true,
  "paymentId": "payment_object_id",
  "txnid": "TXN-1702200000000",
  "qrPayment": {
    "upiLink": "upi://pay?pa=upiid@bank&pn=SwarYoga&am=5000&tn=Workshop",
    "qrCode": "https://api.qrserver.com/v1/create-qr-code/?...",
    "qrStatus": "pending"
  }
}
```

---

### 2. Verify PayU Payment (Callback)
```
POST /api/payment/:id/verify
```

**Request Body (from PayU Callback):**
```json
{
  "txnid": "TXN-1702200000000",
  "payuMoneyId": "123456789",
  "status": "success",
  "amount": "5000",
  "hash": "verify_hash_from_payu"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "payment_id",
    "status": "completed",
    "paymentId": "123456789",
    "transactionId": "TXN-1702200000000"
  }
}
```

---

### 3. Verify PayPal Payment
```
POST /api/payment/:id/verify-paypal
```

**Request Body:**
```json
{
  "paypalTransactionId": "PAYPAL_TXN_ID",
  "paypalStatus": "Completed"
}
```

---

### 4. Verify QR Code Payment (Nepal)
```
POST /api/payment/:id/verify-qr
```

**Request Body:**
```json
{
  "nepalPaymentRef": "NEPAL_REF_ID"
}
```

---

### 5. Refund Payment
```
POST /api/payment/:id/refund
```

**Request Body:**
```json
{
  "refundAmount": 5000,
  "reason": "Student requested refund"
}
```

---

## Payment Methods & Gateways

### 1. PayU Payments (India)
**Supported Methods:**
- Credit Card
- Debit Card
- Net Banking
- UPI
- Wallet (Paytm, Google Pay, etc.)

**Currency:** INR
**Setup:** Merchant Key + Merchant Salt

**Flow:**
```
1. Create Payment → Get PayU Hash
2. Redirect to PayU Checkout Form
3. User completes payment on PayU
4. PayU redirects to callback URL
5. Verify hash and update payment status
```

---

### 2. PayPal (Global)
**Supported Methods:**
- PayPal Account
- Credit/Debit Card
- Direct Bank Transfer

**Currencies:** USD, EUR, GBP, etc.

**Flow:**
```
1. Create Payment → Get PayPal Link
2. Redirect to PayPal Checkout
3. User completes payment
4. PayPal redirects to success/failure URL
5. Verify with PayPal API
```

---

### 3. QR Code Payment (Nepal)
**Supported Methods:**
- UPI/Mobile Wallet
- Bank Direct Transfer
- Instant Payment Systems

**Currency:** NPR

**Flow:**
```
1. Create Payment → Generate UPI Link
2. Generate QR Code from UPI Link
3. Display QR to user
4. User scans with mobile wallet/banking app
5. Payment processed automatically
6. Verify with reference ID
```

---

## Payment Model Fields

### New PayU Fields
```typescript
paymentGateway: 'payu' | 'paypal' | 'external'
qrCodeUrl?: string          // QR Code image URL
qrPaymentLink?: string      // UPI/Payment link
qrStatus?: 'pending' | 'scanned' | 'processed'
payuResponse?: Record       // Full PayU response
paypalTransactionId?: string
nepalPaymentRef?: string
```

---

## Frontend Implementation Example

### 1. Create Payment & Redirect to PayU
```javascript
// Create payment
const response = await axios.post('/api/payment', {
  enrollmentId,
  userId,
  workshopId,
  amount: 5000,
  currency: 'INR',
  paymentMethod: 'payu',
  firstName: 'John',
  email: 'john@example.com',
  phone: '9876543210'
});

const { payuData } = response.data;

// Create form and submit to PayU
const form = document.createElement('form');
form.method = 'POST';
form.action = payuData.payuBaseUrl + '/_payment';

Object.keys(payuData).forEach(key => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = key;
  input.value = payuData[key];
  form.appendChild(input);
});

document.body.appendChild(form);
form.submit();
```

### 2. PayU Callback Handler (Backend)
```javascript
app.post('/payment-callback', (req, res) => {
  const payuResponse = req.body;
  const paymentId = req.body.udf1; // Your payment ID in UDF1
  
  // Verify with backend endpoint
  axios.post(`/api/payment/${paymentId}/verify`, payuResponse)
    .then(result => {
      if (result.data.success) {
        // Redirect to success page
        res.redirect('/payment/success?status=completed');
      }
    })
    .catch(err => {
      res.redirect('/payment/failed?reason=verification_failed');
    });
});
```

### 3. QR Code Payment for Nepal
```javascript
// Create payment
const response = await axios.post('/api/payment', {
  enrollmentId,
  userId,
  workshopId,
  amount: 5000,
  currency: 'NPR',
  paymentMethod: 'upi'
});

const { qrPayment } = response.data;

// Display QR Code
document.getElementById('qrImage').src = qrPayment.qrCode;

// Wait for payment confirmation
// User scans with mobile wallet
// Get confirmation from bank/payment provider
// Verify payment
axios.post(`/api/payment/${paymentId}/verify-qr`, {
  nepalPaymentRef: 'REF_ID_FROM_BANK'
});
```

---

## Testing

### PayU Sandbox (Test Mode)
1. Use test Merchant Key: `gtKFFx`
2. Use test Merchant Salt: `eCwWELxi`
3. Use PayU sandbox URL: `https://sandboxsecure.payu.in`

**Test Cards:**
- **Success:** Card: `4111111111111111`, Expiry: `12/25`, CVV: `123`
- **Failed:** Card: `4111111111111112`, Expiry: `12/25`, CVV: `123`

### Testing Workflow
```
1. Create payment with test amount (₹1)
2. Choose payment method
3. Use test card details
4. Verify callback received
5. Check payment status in database
6. Test refund functionality
```

---

## Payment Statuses

```
pending      - Payment created, awaiting user action
initiated    - User started payment process
completed    - Payment successfully verified
failed       - Payment declined or failed
refunded     - Full refund processed
cancelled    - Payment cancelled by user
abandoned    - Payment left incomplete
```

---

## Refund Process

### Full Refund
```json
POST /api/payment/:id/refund
{
  "refundAmount": 5000,
  "reason": "Student request"
}
```

Result: `refundStatus: 'full'`, `status: 'refunded'`

### Partial Refund
```json
POST /api/payment/:id/refund
{
  "refundAmount": 2500,
  "reason": "Partial withdrawal"
}
```

Result: `refundStatus: 'partial'`, `status: 'completed'`

---

## Multi-Currency Handling

### Automatic Currency Conversion
The system supports 3 currencies with rate conversion:

**INR (Indian Rupee)**
- Amount: 5000
- Processing: PayU → Direct payment
- Tax: Varies by state

**NPR (Nepalese Rupee)**
- Amount: 6500 (approx)
- Processing: QR Code → Manual verification
- Methods: UPI, Bank Transfer

**USD (US Dollar)**
- Amount: 60
- Processing: PayPal
- Methods: Credit Card, PayPal

### Currency Selection in Frontend
```javascript
const currencyOptions = {
  'IN': { currency: 'INR', symbol: '₹', gateway: 'payu' },
  'NP': { currency: 'NPR', symbol: '₨', gateway: 'payu' },
  'US': { currency: 'USD', symbol: '$', gateway: 'paypal' }
};
```

---

## Security Considerations

### Hash Verification
PayU requires hash verification to prevent tampering:
```typescript
const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
const hash = crypto.createHash('sha512').update(hashString).digest('hex');
```

### Best Practices
- ✅ Always verify hash from PayU
- ✅ Never expose Merchant Salt in frontend code
- ✅ Use HTTPS for all payment endpoints
- ✅ Store only transaction IDs, not full card details
- ✅ Implement rate limiting on payment endpoints
- ✅ Log all payment transactions for audit trail

---

## Production Deployment Checklist

- [ ] Update `.env` with production PayU credentials
- [ ] Set `PAYU_BASE_URL` to production URL
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Configure PayU merchant account settings
- [ ] Set up PayU webhook for asynchronous confirmations
- [ ] Configure PayPal production keys
- [ ] Test end-to-end payment flow
- [ ] Set up payment notifications/emails
- [ ] Configure payment reconciliation process
- [ ] Set up monitoring for payment failures

---

## Troubleshooting

### Payment Hash Mismatch
**Problem:** "Invalid signature" error
**Solution:**
- Verify Merchant Key and Merchant Salt are correct
- Check hash calculation order
- Ensure field values match exactly

### PayU Callback Not Received
**Problem:** Payment completed but status not updated
**Solution:**
- Verify callback URL in PayU dashboard
- Check server logs for callback requests
- Implement callback retry logic

### QR Code Not Scanning
**Problem:** QR code displays but won't scan
**Solution:**
- Verify UPI ID format
- Test QR code with multiple apps
- Check QR code size (300x300 recommended)

---

## Support & Documentation

- **PayU Documentation:** https://www.payu.in/
- **PayPal Integration:** https://developer.paypal.com/
- **Error Codes:** See PayU dashboard error documentation

---

**Last Updated:** December 2025  
**Status:** Production Ready  
**Support:** contact@swaryoga.com

