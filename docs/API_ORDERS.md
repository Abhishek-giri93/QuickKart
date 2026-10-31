# QuickKart — Orders API Documentation

---

## 1. Overview & Business Rules

The Orders Module manages the complete lifecycle of hyperlocal customer orders:
- **Atomic Order Placement:** Orders are placed atomically using database transactions (`$transaction`), ensuring inventory stock is deducted, payment records created, and carts reset safely.
- **Order Number Format:** Human-readable unique order numbers generated as `QK-YYYY-XXXXX`.
- **State Machine Transitions:** Orders follow a strict state machine:
  - `PENDING` $\rightarrow$ `ACCEPTED` or `REJECTED` (by Seller)
  - `ACCEPTED` $\rightarrow$ `PREPARING` (by Seller) or `CANCELLED` (by Customer)
  - `PREPARING` $\rightarrow$ `READY` (by Seller)
  - `READY` $\rightarrow$ `ASSIGNED` (queued for Delivery Partner in Delivery Module)
  - `ASSIGNED` $\rightarrow$ `OUT_FOR_DELIVERY`
  - `OUT_FOR_DELIVERY` $\rightarrow$ `DELIVERED`
- **Cancellation & Inventory Rollback:** If an order is cancelled by the customer (only allowed while `PENDING` or `ACCEPTED`) or rejected by the seller, inventory quantities are atomically restored.

---

## 2. Endpoints Reference (`/api/v1/orders`)

### Customer Endpoints

#### POST `/api/v1/orders`
Place a new order from current active cart.
- **Access:** Authenticated Customer
- **Request Body:**
```json
{
  "addressId": "77777777-7777-4777-8777-777777777777",
  "paymentMethod": "COD", // "COD" | "RAZORPAY"
  "specialInstructions": "Leave package at reception"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": "order-uuid",
    "orderNumber": "QK-2026-99999",
    "status": "PENDING",
    "subtotal": 440.00,
    "discountAmount": 0.00,
    "deliveryFee": 40.00,
    "taxAmount": 22.00,
    "totalAmount": 502.00,
    "specialInstructions": "Leave package at reception",
    "items": [
      {
        "id": "order-item-uuid",
        "productId": "product-uuid",
        "productName": "Organic Honey 500g",
        "productUnit": "jar",
        "quantity": 2,
        "unitPrice": "220.00",
        "totalPrice": "440.00"
      }
    ],
    "payment": {
      "id": "pay-uuid",
      "method": "COD",
      "status": "PENDING",
      "amount": "502.00"
    },
    "store": {
      "id": "store-uuid",
      "name": "Fresh Mart Store",
      "phone": "9876543210",
      "addressLine": "123 Market Road",
      "city": "Mumbai"
    }
  }
}
```

---

#### GET `/api/v1/orders`
Fetch paginated order history for the current customer.
- **Access:** Authenticated Customer
- **Query Parameters:**
  - `status` (string, optional): Filter by `OrderStatus` (`PENDING`, `ACCEPTED`, `DELIVERED`, etc.)
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`, max: `100`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

---

#### GET `/api/v1/orders/:id`
Get full details of a specific order.
- **Access:** Authenticated (Customer who placed order, Seller owning the store, assigned Delivery Partner, or Admin)
- **Response (200 OK):** Returns detailed order with items, payment, address, coupon, and delivery status.

---

#### PATCH `/api/v1/orders/:id/cancel`
Cancel an order.
- **Access:** Authenticated Customer (or Admin)
- **Allowed States:** `PENDING`, `ACCEPTED`
- **Request Body:**
```json
{
  "cancellationReason": "Changed mind about the items"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "id": "order-uuid",
    "status": "CANCELLED",
    "cancelledAt": "2026-10-31T03:00:00.000Z",
    "cancellationReason": "Changed mind about the items"
  }
}
```

---

### Seller Endpoints

#### GET `/api/v1/orders/seller/store-orders`
View incoming and active orders across the seller's verified stores.
- **Access:** Authenticated Seller
- **Query Parameters:**
  - `status` (string, optional): Filter by `OrderStatus`
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`)
- **Response (200 OK):** Returns paginated orders list with items and customer details.

---

#### PATCH `/api/v1/orders/:id/accept`
Accept an incoming order (`PENDING` $\rightarrow$ `ACCEPTED`).
- **Access:** Authenticated Seller (Store Owner)
- **Response (200 OK):** Returns updated order with `status: "ACCEPTED"`.

---

#### PATCH `/api/v1/orders/:id/reject`
Reject an order with required reason and restore inventory stock (`PENDING` $\rightarrow$ `REJECTED`).
- **Access:** Authenticated Seller (Store Owner)
- **Request Body:**
```json
{
  "cancellationReason": "Store out of capacity for immediate delivery"
}
```
- **Response (200 OK):** Returns updated order with `status: "REJECTED"`.

---

#### PATCH `/api/v1/orders/:id/prepare`
Mark order as currently preparing in kitchen / warehouse (`ACCEPTED` $\rightarrow$ `PREPARING`).
- **Access:** Authenticated Seller (Store Owner)
- **Response (200 OK):** Returns updated order with `status: "PREPARING"`.

---

#### PATCH `/api/v1/orders/:id/ready`
Mark order packed and ready for pickup (`PREPARING` $\rightarrow$ `READY`).
Automatically creates a pending delivery record in the delivery pool for delivery partner matching.
- **Access:** Authenticated Seller (Store Owner)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Order is ready and queued for delivery assignment",
  "data": {
    "id": "order-uuid",
    "status": "READY",
    "readyAt": "2026-10-31T03:15:00.000Z"
  }
}
```
