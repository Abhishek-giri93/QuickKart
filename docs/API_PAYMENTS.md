# QuickKart — Payments API Documentation

---

## 1. Overview & Payment Methods

The Payments Module handles payment processing, signature verification, audit logging, and refund operations:
- **Payment Methods:**
  - `RAZORPAY`: Online payments via UPI, Cards, NetBanking, and Wallets.
  - `COD`: Cash on Delivery, settled automatically when delivery is confirmed via OTP.
- **Razorpay Flow:**
  1. Customer places order $\rightarrow$ Order & Payment created with `PENDING` status.
  2. Customer calls `/api/v1/payments/create-razorpay-order` $\rightarrow$ returns `razorpayOrderId` and amount in paise.
  3. Razorpay checkout opens on client app / web.
  4. Upon successful payment on client, client receives `razorpayPaymentId` & `razorpaySignature`.
  5. Client calls `/api/v1/payments/verify` $\rightarrow$ Backend calculates HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`. If verified, payment status becomes `SUCCESS` and a `Transaction` audit entry is recorded.
- **Webhook Resilience:** `/api/v1/payments/webhook` listens for asynchronous Razorpay events (`payment.captured`, `payment.failed`, `refund.processed`) to handle network dropoffs gracefully.
- **Audit Logging:** Every financial event (payment capture, refund, settlement) creates an immutable `Transaction` record with `TRANSACTION_TYPE`.
- **Refunds:** Admin or Seller can initiate refunds with balance limit checking.

---

## 2. Endpoints Reference (`/api/v1/payments`)

### Customer Endpoints

#### POST `/api/v1/payments/create-razorpay-order`
Initialize Razorpay checkout order for a pending order.
- **Access:** Authenticated Customer
- **Request Body:**
```json
{
  "orderId": "77777777-7777-4777-8777-777777777777"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Razorpay order created successfully",
  "data": {
    "orderId": "order-uuid",
    "paymentId": "payment-uuid",
    "razorpayOrderId": "order_a1b2c3d4e5f6",
    "amount": 500,
    "amountInPaise": 50000,
    "currency": "INR",
    "keyId": "rzp_test_..."
  }
}
```

---

#### POST `/api/v1/payments/verify`
Verify Razorpay signature after checkout completion.
- **Access:** Authenticated Customer
- **Request Body:**
```json
{
  "orderId": "order-uuid",
  "razorpayOrderId": "order_a1b2c3d4e5f6",
  "razorpayPaymentId": "pay_9876543210",
  "razorpaySignature": "3f4c6e..."
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment verified and captured successfully",
  "data": {
    "id": "payment-uuid",
    "status": "SUCCESS",
    "paidAt": "2026-10-31T03:45:00.000Z",
    "razorpayPaymentId": "pay_9876543210"
  }
}
```
- **Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Payment signature verification failed. Invalid transaction."
}
```

---

#### GET `/api/v1/payments/transactions`
List transaction history for customer orders.
- **Access:** Authenticated Customer
- **Query Parameters:**
  - `type` (string, optional): `PAYMENT`, `REFUND`, `COMMISSION`, `SETTLEMENT`
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`, max: `100`)
- **Response (200 OK):** Returns paginated list of transaction logs.

---

#### GET `/api/v1/payments/:id`
Get full payment record with associated transactions and refunds.
- **Access:** Authenticated (Customer owning the order, Seller owning the store, or Admin)
- **Response (200 OK):** Returns complete payment details with audit trail.

---

### Seller / Admin Endpoints

#### POST `/api/v1/payments/refund`
Initiate full or partial refund for a successful payment.
- **Access:** Authenticated Admin or Seller (store owner)
- **Request Body:**
```json
{
  "paymentId": "payment-uuid",
  "amount": 250,
  "reason": "Customer returned damaged item"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "id": "refund-uuid",
    "paymentId": "payment-uuid",
    "amount": "250.00",
    "reason": "Customer returned damaged item",
    "status": "COMPLETED",
    "razorpayRefundId": "rfnd_12345678",
    "processedAt": "2026-10-31T04:00:00.000Z"
  }
}
```
- **Error Response (400 Bad Request):**
  - "Refund amount exceeds maximum refundable balance"
  - "Cannot refund payment in PENDING status. Only successful payments can be refunded."

---

### Webhook Endpoint

#### POST `/api/v1/payments/webhook`
Razorpay webhook receiver.
- **Access:** Public (Protected via `x-razorpay-signature` header)
- **Events Handled:**
  - `payment.captured`: Auto-updates payment to `SUCCESS` and records transaction.
  - `payment.failed`: Updates payment to `FAILED` with failure description.
  - `refund.processed`: Marks refund as `COMPLETED`.
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": { "received": true }
}
```
