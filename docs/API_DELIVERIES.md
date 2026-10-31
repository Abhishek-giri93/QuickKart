# QuickKart — Deliveries API Documentation

---

## 1. Overview & Business Rules

The Deliveries Module manages the hyperlocal last-mile delivery lifecycle:
- **Auto-Assignment:** When a seller marks an order `READY`, a `Delivery` record is created with status `PENDING`. The assignment engine finds the nearest online + verified delivery partner within a 10 km radius (Haversine formula) who is not currently on an active delivery.
- **Pickup Confirmation:** The assigned partner confirms pickup from the store (`ACCEPTED` → `PICKED_UP`), which cascades the order status to `OUT_FOR_DELIVERY`.
- **OTP-Verified Handover:** A 4-digit OTP is generated at assignment time and shared with the customer. The delivery partner must enter the correct OTP to complete the delivery (`PICKED_UP` → `DELIVERED`).
- **Live GPS Tracking:** Delivery partners continuously update their GPS coordinates via the `/location` endpoint for real-time customer tracking.
- **COD Auto-Settlement:** When a COD order is delivered, the payment status is automatically updated to `SUCCESS`.
- **Delivery Stats:** The partner's `totalDeliveries` counter is atomically incremented on completion.

### Delivery Status Flow
```
PENDING → ACCEPTED → PICKED_UP → DELIVERED
                                   ↗
                              (OTP verified)
```

---

## 2. Endpoints Reference (`/api/v1/deliveries`)

### Delivery Partner Endpoints

#### GET `/api/v1/deliveries`
List deliveries assigned to the authenticated delivery partner.
- **Access:** Authenticated Delivery Partner
- **Query Parameters:**
  - `status` (string, optional): Filter by `DeliveryStatus` (`PENDING`, `ACCEPTED`, `PICKED_UP`, `DELIVERED`, `FAILED`)
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`, max: `100`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Deliveries retrieved successfully",
  "data": [
    {
      "id": "delivery-uuid",
      "orderId": "order-uuid",
      "status": "ACCEPTED",
      "otp": "4567",
      "order": {
        "orderNumber": "QK-2026-12345",
        "store": {
          "name": "Fresh Mart",
          "phone": "9876543210",
          "addressLine": "123 MG Road",
          "city": "Bangalore",
          "latitude": "12.97160000",
          "longitude": "77.59460000"
        },
        "address": {
          "addressLine1": "Flat 201, Tower B",
          "city": "Bangalore",
          "pincode": "560001"
        },
        "items": [
          { "productName": "Organic Honey", "quantity": 2 }
        ]
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

---

#### GET `/api/v1/deliveries/:id`
Get full details of a specific delivery assignment.
- **Access:** Authenticated Delivery Partner (assigned) or Admin
- **Response (200 OK):** Returns delivery with full order details, store, address, items, and customer name.

---

#### PATCH `/api/v1/deliveries/:id/pickup`
Confirm order has been picked up from the store.
- **Access:** Authenticated Delivery Partner (assigned)
- **Allowed Status:** `ACCEPTED`
- **Side Effects:** Order status transitions to `OUT_FOR_DELIVERY`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Pickup confirmed. Order is now out for delivery.",
  "data": {
    "id": "delivery-uuid",
    "status": "PICKED_UP",
    "pickedUpAt": "2026-10-31T03:30:00.000Z"
  }
}
```

---

#### PATCH `/api/v1/deliveries/:id/deliver`
Verify the 4-digit OTP provided by the customer and complete delivery.
- **Access:** Authenticated Delivery Partner (assigned)
- **Allowed Status:** `PICKED_UP`
- **Request Body:**
```json
{
  "otp": "4567"
}
```
- **Side Effects:**
  - Delivery marked `DELIVERED`
  - Order status transitions to `DELIVERED`
  - COD payment auto-marked `SUCCESS`
  - Partner's `totalDeliveries` incremented
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Delivery completed successfully! OTP verified.",
  "data": {
    "id": "delivery-uuid",
    "status": "DELIVERED",
    "deliveredAt": "2026-10-31T04:00:00.000Z",
    "otpVerifiedAt": "2026-10-31T04:00:00.000Z"
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: "Invalid OTP. Please ask the customer for the correct code."
  - `400 Bad Request`: "Cannot verify OTP in ACCEPTED status. Pickup must be confirmed first."

---

#### PATCH `/api/v1/deliveries/location`
Update the delivery partner's live GPS coordinates for tracking.
- **Access:** Authenticated Delivery Partner
- **Request Body:**
```json
{
  "latitude": 12.9800,
  "longitude": 77.6000
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "id": "partner-uuid",
    "currentLat": "12.98000000",
    "currentLng": "77.60000000",
    "updatedAt": "2026-10-31T04:05:00.000Z"
  }
}
```

---

### Admin Endpoints

#### GET `/api/v1/deliveries/pending`
List unassigned deliveries waiting for partner assignment.
- **Access:** Authenticated Admin
- **Query Parameters:**
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`)
- **Response (200 OK):** Returns deliveries with store and address details.

---

#### POST `/api/v1/deliveries/:id/assign`
Manually trigger auto-assignment for a specific pending delivery.
- **Access:** Authenticated Admin
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Delivery partner assigned successfully",
  "data": {
    "id": "delivery-uuid",
    "status": "ACCEPTED",
    "deliveryPartner": {
      "firstName": "Ravi",
      "lastName": "Kumar",
      "vehicleType": "BIKE",
      "vehicleNumber": "KA-01-AB-1234"
    }
  }
}
```

