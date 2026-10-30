# QuickKart — Frontend API Contracts Specification

> **Author:** Frontend Engineering Agent (Antigravity System 2)  
> **Audience:** Central Project Coordinator (ChatGPT) & Backend Engineering Agent (System 1)  
> **Branch:** `feature/frontend-foundation`  
> **Status:** Proposed for Backend Implementation

This document defines the exact contract expectations required by all 4 frontend applications (`customer-app`, `seller-app`, `delivery-app`, `admin-dashboard`).

---

## 1. Global Standards & Conventions

- **Base URL:** `https://api.quickkart.internal/v1` (or `http://localhost:5000/api/v1` during local dev)
- **Content-Type:** `application/json`
- **Authentication:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Standard Response Envelope:**
  ```json
  {
    "success": true,
    "message": "Operation completed successfully",
    "data": {},
    "meta": {}
  }
  ```
- **Standard Error Envelope:**
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_FAILED",
      "message": "Human-readable error description",
      "details": []
    }
  }
  ```

---

## 2. Authentication & Authorization APIs

### 2.1 Send OTP / Login
- **Endpoint:** `POST /auth/otp/send`
- **Request:**
  ```json
  {
    "phone": "+919876543210",
    "role": "customer" // "customer" | "seller" | "delivery_partner" | "admin"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "otpSent": true,
      "expiresIn": 300,
      "isNewUser": false
    }
  }
  ```

### 2.2 Verify OTP & Issue Token
- **Endpoint:** `POST /auth/otp/verify`
- **Request:**
  ```json
  {
    "phone": "+919876543210",
    "otp": "5831",
    "role": "customer",
    "fcmToken": "optional_fcm_token_for_push"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": "usr_9402",
        "name": "Abhishek Giri",
        "phone": "+919876543210",
        "email": "abhishek@quickkart.com",
        "role": "customer"
      }
    }
  }
  ```

---

## 3. Customer App APIs

### 3.1 Nearby Stores Discovery
- **Endpoint:** `GET /stores/nearby?lat=23.2599&lng=77.4126&radius=5&category=grocery`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "store_001",
        "name": "Fresh Basket Supermart",
        "category": "grocery",
        "rating": 4.5,
        "reviewCount": 238,
        "distanceKm": 0.8,
        "deliveryTimeMins": 20,
        "deliveryFee": 20,
        "minOrder": 99,
        "isOpen": true,
        "imageUrl": "https://cdn.quickkart.com/stores/store_001.jpg",
        "tags": ["Groceries", "Vegetables", "Dairy"],
        "address": "12, MG Road, Near City Mall"
      }
    ]
  }
  ```

### 3.2 Store Menu & Inventory
- **Endpoint:** `GET /stores/:storeId/products?category=Dairy`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "prod_001",
        "storeId": "store_001",
        "name": "Amul Full Cream Milk",
        "category": "Dairy",
        "price": 66,
        "originalPrice": 72,
        "discountPercentage": 8,
        "unit": "1 Litre",
        "stock": 42,
        "isAvailable": true,
        "description": "Fresh full cream milk from Amul. Rich in calcium."
      }
    ]
  }
  ```

### 3.3 Create Order
- **Endpoint:** `POST /orders`
- **Request:**
  ```json
  {
    "storeId": "store_001",
    "items": [
      { "productId": "prod_001", "quantity": 2, "unitPrice": 66 },
      { "productId": "prod_002", "quantity": 1, "unitPrice": 30 }
    ],
    "deliveryAddress": {
      "line1": "Flat 402, Green Valley Apartments",
      "area": "City Center",
      "city": "Bhopal",
      "pincode": "462001",
      "lat": 23.251,
      "lng": 77.418
    },
    "couponCode": "QUICK50",
    "paymentMethod": "UPI" // "UPI" | "COD" | "CARD"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "orderId": "QK-849201",
      "subtotal": 162,
      "deliveryFee": 0,
      "platformFee": 5,
      "discount": 50,
      "totalAmount": 117,
      "status": "PLACED",
      "deliveryOtp": "5831",
      "estimatedDeliveryMins": 22
    }
  }
  ```

### 3.4 Live Order Tracking
- **Endpoint:** `GET /orders/:orderId/track`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "orderId": "QK-849201",
      "status": "RIDER_PICKED_UP", // "PLACED" | "PREPARING" | "RIDER_PICKED_UP" | "DELIVERED"
      "etaMinutes": 14,
      "deliveryOtp": "5831",
      "rider": {
        "name": "Ramesh Kumar",
        "phone": "+919876543210",
        "vehicle": "Hero Splendor (MP 04 AB 4912)",
        "rating": 4.8,
        "currentLat": 23.254,
        "currentLng": 77.415
      }
    }
  }
  ```

---

## 4. Seller App APIs

### 4.1 Update Store Status (Open / Closed)
- **Endpoint:** `PATCH /seller/store/status`
- **Request:** `{ "isOpen": true }`

### 4.2 Incoming & Active Orders
- **Endpoint:** `GET /seller/orders?status=PREPARING`
- **Update Order Stage:** `PATCH /seller/orders/:orderId/status`
  - Body: `{ "status": "READY_FOR_PICKUP" }`

### 4.3 Inventory & Stock Management
- **Endpoint:** `PATCH /seller/products/:productId/stock`
- **Request:** `{ "inStock": false, "stockCount": 0 }`

---

## 5. Delivery Partner APIs

### 5.1 Online / Offline Shift
- **Endpoint:** `PATCH /delivery/shift`
- **Request:** `{ "isOnline": true, "currentLat": 23.259, "currentLng": 77.412 }`

### 5.2 Accept Delivery
- **Endpoint:** `POST /delivery/orders/:orderId/accept`

### 5.3 Complete Delivery with OTP
- **Endpoint:** `POST /delivery/orders/:orderId/verify-otp`
- **Request:** `{ "otp": "5831" }`
- **Response:** `{ "success": true, "payoutCredited": 65 }`

---

## 6. Admin Dashboard APIs

- `GET /admin/analytics/overview` (GMV, active orders, active riders, stores)
- `GET /admin/sellers/pending` (List of unverified shopkeepers)
- `PATCH /admin/sellers/:sellerId/verify` (Approve or Reject with reason)
- `GET /admin/riders/fleet` (Live active duty status & fleet telemetry)
- `POST /admin/coupons` (Create & manage promo codes)
