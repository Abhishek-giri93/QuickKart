# QuickKart — Profiles & Address Management API Documentation

---

## 1. Customer Profile

### GET `/api/v1/customers/profile`
Retrieve full customer profile along with saved addresses and basic account info.
- **Role required:** `CUSTOMER`
- **Header:** `Authorization: Bearer <accessToken>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Customer profile retrieved",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "firstName": "Rahul",
    "lastName": "Sharma",
    "avatarUrl": "https://res.cloudinary.com/...",
    "dateOfBirth": "1998-05-12T00:00:00.000Z",
    "addresses": [
      {
        "id": "uuid",
        "label": "Home",
        "recipientName": "Rahul Sharma",
        "recipientPhone": "9876543210",
        "addressLine1": "Flat 402, Green Valley Apts",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560001",
        "isDefault": true
      }
    ],
    "user": {
      "id": "uuid",
      "email": "rahul@example.com",
      "phone": "9876543210",
      "role": "CUSTOMER"
    }
  }
}
```

### PATCH `/api/v1/customers/profile`
Update customer profile fields.
- **Role required:** `CUSTOMER`
- **Request Body (all fields optional):**
```json
{
  "firstName": "Rahul",
  "lastName": "Verma",
  "avatarUrl": "https://example.com/avatar.jpg",
  "dateOfBirth": "1998-05-12T00:00:00.000Z"
}
```

---

## 2. Customer Address Management

### GET `/api/v1/customers/addresses`
List all saved addresses for the customer (ordered with default address first).
- **Role required:** `CUSTOMER`

### POST `/api/v1/customers/addresses`
Add a new address. If this is the user's first address, it is automatically marked as default.
- **Role required:** `CUSTOMER`
- **Request Body:**
```json
{
  "label": "Home",
  "recipientName": "Rahul Sharma",
  "recipientPhone": "9876543210",
  "addressLine1": "Flat 402, Green Valley Apartments",
  "addressLine2": "Outer Ring Road",
  "landmark": "Near Metro Pillar 12",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "isDefault": true
}
```

### GET `/api/v1/customers/addresses/:id`
Fetch details of a single address.

### PATCH `/api/v1/customers/addresses/:id`
Update fields of an existing address.

### DELETE `/api/v1/customers/addresses/:id`
Delete an address. If the deleted address was the default, the next available address is automatically promoted to default.

### PATCH `/api/v1/customers/addresses/:id/default`
Set the specified address as the default delivery address.

---

## 3. Seller Profile

### GET `/api/v1/sellers/profile`
Retrieve seller business profile, KYC status, bank account info and store list overview.
- **Role required:** `SELLER`
- **Header:** `Authorization: Bearer <accessToken>`

### PATCH `/api/v1/sellers/profile`
Update seller profile details.
- **Role required:** `SELLER`
- **Request Body:**
```json
{
  "businessName": "Verma Daily Essentials",
  "gstNumber": "27AAPFU0939F1ZV",
  "panNumber": "ABCDE1234F",
  "bankAccountNo": "123456789012",
  "bankIfsc": "HDFC0001234"
}
```

---

## 4. Delivery Partner Profile & Availability

### GET `/api/v1/delivery-partners/profile`
Retrieve delivery partner profile, vehicle info, current rating and total deliveries.
- **Role required:** `DELIVERY_PARTNER`

### PATCH `/api/v1/delivery-partners/profile`
Update vehicle or personal profile.
- **Role required:** `DELIVERY_PARTNER`

### PATCH `/api/v1/delivery-partners/status`
Toggle online/offline status for receiving delivery requests.
- **Role required:** `DELIVERY_PARTNER`
- **Request Body:**
```json
{
  "isOnline": true
}
```

### PATCH `/api/v1/delivery-partners/location`
Stream current GPS coordinates while on duty or delivering.
- **Role required:** `DELIVERY_PARTNER`
- **Request Body:**
```json
{
  "latitude": 12.971598,
  "longitude": 77.594566
}
```
