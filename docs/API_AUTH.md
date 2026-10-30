# QuickKart — Authentication & Authorization API Documentation

Base URL: `/api/v1/auth`

---

## 1. Customer Registration
Registers a new customer account, creates customer profile, and initializes an empty cart.

- **URL:** `/api/v1/auth/register/customer`
- **Method:** `POST`
- **Auth required:** No
- **Rate Limit:** 10 requests / 15 minutes
- **Request Body:**
```json
{
  "email": "customer@example.com",
  "phone": "9876543210",
  "password": "Password123",
  "firstName": "Rahul",
  "lastName": "Sharma"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Customer registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "customer@example.com",
      "phone": "9876543210",
      "role": "CUSTOMER",
      "isActive": true,
      "isVerified": false,
      "customerProfile": {
        "id": "uuid",
        "firstName": "Rahul",
        "lastName": "Sharma"
      }
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

---

## 2. Seller Registration
Registers a new merchant/seller account and creates a seller profile.

- **URL:** `/api/v1/auth/register/seller`
- **Method:** `POST`
- **Auth required:** No
- **Rate Limit:** 10 requests / 15 minutes
- **Request Body:**
```json
{
  "email": "seller@example.com",
  "phone": "9876543211",
  "password": "Password123",
  "firstName": "Amit",
  "lastName": "Verma",
  "businessName": "Verma Grocery Store",
  "gstNumber": "27AAPFU0939F1ZV",
  "panNumber": "ABCDE1234F"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Seller registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

## 3. Delivery Partner Registration
Registers a new delivery partner and sets up vehicle and license details.

- **URL:** `/api/v1/auth/register/delivery-partner`
- **Method:** `POST`
- **Auth required:** No
- **Rate Limit:** 10 requests / 15 minutes
- **Request Body:**
```json
{
  "email": "rider@example.com",
  "phone": "9876543212",
  "password": "Password123",
  "firstName": "Vikram",
  "lastName": "Singh",
  "vehicleType": "MOTORCYCLE",
  "vehicleNumber": "DL01AB1234",
  "licenseNumber": "DL-1420110012345"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Delivery partner registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

## 4. User Login
Authenticate with either email or phone number and password.

- **URL:** `/api/v1/auth/login`
- **Method:** `POST`
- **Auth required:** No
- **Rate Limit:** 10 requests / 15 minutes
- **Request Body:**
```json
{
  "identifier": "customer@example.com",
  "password": "Password123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```
*Note: Refresh token is also automatically set as an `httpOnly` secure cookie.*

---

## 5. Token Refresh (Session Rotation)
Exchange a valid refresh token for a brand new access token and rotated refresh token.

- **URL:** `/api/v1/auth/refresh-token`
- **Method:** `POST`
- **Auth required:** No (Refresh token in cookie or request body)
- **Request Body (optional if cookie is present):**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token"
  }
}
```

---

## 6. Current Profile
Retrieve currently authenticated user's profile.

- **URL:** `/api/v1/auth/me`
- **Method:** `GET`
- **Auth required:** Yes (`Bearer <accessToken>`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Current profile retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "customer@example.com",
      "phone": "9876543210",
      "role": "CUSTOMER",
      "isActive": true,
      "isVerified": false,
      "customerProfile": { ... }
    }
  }
}
```

---

## 7. Logout
Invalidate current session and clear stored refresh token in database & browser cookie.

- **URL:** `/api/v1/auth/logout`
- **Method:** `POST`
- **Auth required:** Yes (`Bearer <accessToken>`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
