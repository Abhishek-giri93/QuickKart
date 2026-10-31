# QuickKart API — Admin Module (Phase 12)

Base path: `/api/v1/admin`

All endpoints under this module require an authenticated session with the **`ADMIN`** role. Any request without a valid Bearer token returns `401 Unauthorized`. Any request from a non-admin role (e.g., `CUSTOMER`, `SELLER`, `DELIVERY_PARTNER`) returns `403 Forbidden`.

---

## 1. Analytics & Overview

### GET `/api/v1/admin/analytics/overview`
Retrieves platform-wide health metrics, GMV, order volume, user statistics, and operations count.

- **Headers:** `Authorization: Bearer <admin_token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Platform overview metrics retrieved successfully",
  "data": {
    "financials": {
      "grossMerchandiseValue": 50000.00,
      "estimatedPlatformCommission": 5000.00,
      "completedOrdersCount": 10
    },
    "orders": {
      "total": 15,
      "pending": 3,
      "delivered": 10,
      "cancelled": 2
    },
    "users": {
      "customers": 100,
      "sellers": 20,
      "deliveryPartners": 15,
      "total": 135
    },
    "operations": {
      "activeStores": 12,
      "onlineVerifiedPartners": 10
    }
  }
}
```

---

## 2. Store Controls

### GET `/api/v1/admin/stores`
Lists platform stores with optional status filter and pagination.

- **Query Parameters:**
  - `status` (optional): `PENDING_VERIFICATION` | `ACTIVE` | `SUSPENDED` | `REJECTED`
  - `page` (optional, default: 1): Page number
  - `limit` (optional, default: 20): Items per page
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Stores retrieved successfully",
  "data": [
    {
      "id": "33333333-3333-4333-8333-333333333333",
      "name": "Best Store",
      "status": "ACTIVE",
      "commissionRate": 10,
      "sellerProfile": {
        "businessName": "Best Store Pvt Ltd",
        "isKycVerified": true,
        "user": {
          "email": "seller@test.com",
          "phone": "7777777777"
        }
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

### PATCH `/api/v1/admin/stores/:id/status`
Approves, suspends, or rejects a store.

- **URL Parameters:** `id` (Store UUID)
- **Body:**
```json
{
  "status": "SUSPENDED"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Store status updated to SUSPENDED",
  "data": {
    "id": "33333333-3333-4333-8333-333333333333",
    "name": "Best Store",
    "status": "SUSPENDED"
  }
}
```

### PATCH `/api/v1/admin/stores/:id/commission`
Updates the platform commission percentage for a specific store.

- **URL Parameters:** `id` (Store UUID)
- **Body:**
```json
{
  "commissionRate": 15
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Store commission rate updated to 15%",
  "data": {
    "id": "33333333-3333-4333-8333-333333333333",
    "commissionRate": 15
  }
}
```

---

## 3. Delivery Partner Controls

### GET `/api/v1/admin/delivery-partners`
Lists registered delivery partners with optional verification status filter.

- **Query Parameters:**
  - `isVerified` (optional): `true` | `false`
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Delivery partners retrieved successfully",
  "data": [
    {
      "id": "44444444-4444-4444-8444-444444444444",
      "firstName": "Rider",
      "lastName": "Singh",
      "isVerified": false,
      "isOnline": true,
      "user": {
        "email": "rider@test.com",
        "phone": "6666666666",
        "isActive": true
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

### PATCH `/api/v1/admin/delivery-partners/:id/verify`
Approves KYC/documents or revokes verification for a delivery partner.

- **URL Parameters:** `id` (Partner UUID)
- **Body:**
```json
{
  "isVerified": true
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Delivery partner verified successfully",
  "data": {
    "id": "44444444-4444-4444-8444-444444444444",
    "isVerified": true
  }
}
```

---

## 4. User Moderation

### GET `/api/v1/admin/users`
Lists all platform users across roles with status filtering and pagination.

- **Query Parameters:**
  - `role` (optional): `CUSTOMER` | `SELLER` | `DELIVERY_PARTNER` | `ADMIN`
  - `isActive` (optional): `true` | `false`
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "22222222-2222-4222-8222-222222222222",
      "email": "customer@test.com",
      "phone": "8888888888",
      "role": "CUSTOMER",
      "isActive": true,
      "isVerified": true,
      "createdAt": "2026-10-31T00:00:00.000Z"
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

### PATCH `/api/v1/admin/users/:id/status`
Bans or reactivates a user account.

- **URL Parameters:** `id` (User UUID)
- **Body:**
```json
{
  "isActive": false
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "User deactivated / banned",
  "data": {
    "id": "22222222-2222-4222-8222-222222222222",
    "email": "customer@test.com",
    "role": "CUSTOMER",
    "isActive": false
  }
}
```

---

## 5. Coupon Management

### POST `/api/v1/admin/coupons`
Creates a new promotional discount coupon code.

- **Body:**
```json
{
  "code": "SAVE20",
  "description": "20% off on first order",
  "discountPercent": 20,
  "minOrderAmount": 200,
  "maxDiscount": 100,
  "usageLimit": 500,
  "perUserLimit": 1,
  "validFrom": "2026-01-01T00:00:00.000Z",
  "validUntil": "2026-12-31T23:59:59.000Z"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Promotional coupon created successfully",
  "data": {
    "id": "55555555-5555-4555-8555-555555555555",
    "code": "SAVE20",
    "discountPercent": 20,
    "isActive": true
  }
}
```

### GET `/api/v1/admin/coupons`
Lists all coupons.

- **Query Parameters:**
  - `isActive` (optional): `true` | `false`
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Coupons retrieved successfully",
  "data": [
    {
      "id": "55555555-5555-4555-8555-555555555555",
      "code": "SAVE20",
      "discountPercent": 20,
      "isActive": true
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

### PATCH `/api/v1/admin/coupons/:id`
Updates an existing coupon (deactivate, update limit, or extend validity).

- **URL Parameters:** `id` (Coupon UUID)
- **Body:**
```json
{
  "isActive": false
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Coupon updated successfully",
  "data": {
    "id": "55555555-5555-4555-8555-555555555555",
    "isActive": false
  }
}
```
