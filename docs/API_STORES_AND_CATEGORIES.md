# QuickKart — Stores & Categories API Documentation

---

## 1. Categories API (`/api/v1/categories`)

### GET `/api/v1/categories`
Retrieve all active root categories with their nested subcategories.
- **Access:** Public
- **Query Params:**
  - `includeInactive` (optional boolean, default `false`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Groceries",
      "slug": "groceries",
      "description": "Daily food essentials and fresh produce",
      "imageUrl": "https://...",
      "sortOrder": 1,
      "children": [
        {
          "id": "uuid",
          "name": "Fruits & Vegetables",
          "slug": "fruits-and-vegetables"
        }
      ]
    }
  ]
}
```

### GET `/api/v1/categories/:id`
Get single category by UUID or URL slug.
- **Access:** Public

### POST `/api/v1/categories`
Create a new category.
- **Access:** Admin only (`Bearer <token>`)
- **Request Body:**
```json
{
  "name": "Stationery & Office",
  "description": "Pens, notebooks and supplies",
  "imageUrl": "https://...",
  "parentId": "optional-parent-uuid",
  "sortOrder": 4
}
```

### PATCH `/api/v1/categories/:id`
Update an existing category.
- **Access:** Admin only

### DELETE `/api/v1/categories/:id`
Delete or soft-delete category (fails if active child categories exist).
- **Access:** Admin only

---

## 2. Store Discovery API (`/api/v1/stores`)

### GET `/api/v1/stores`
Hyperlocal nearby store discovery and search.
- **Access:** Public
- **Query Parameters:**
  - `latitude` (number) & `longitude` (number): Customer's current coordinates
  - `radiusKm` (number, default: `10`, max: `50`): Delivery radius
  - `city` (string, optional): City name filter
  - `search` (string, optional): Search keyword in store name or description
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Stores retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Verma Daily Mart",
      "description": "Groceries and packaged goods",
      "phone": "9876543210",
      "addressLine": "Shop 12, Main Market",
      "city": "Bengaluru",
      "isOpen": true,
      "avgRating": "4.80",
      "totalRatings": 154,
      "distanceKm": 1.45
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### GET `/api/v1/stores/:id`
Get public store profile, opening hours, contact details, and list of available categories.
- **Access:** Public

---

## 3. Seller Store Management (`/api/v1/stores/my-stores`)

### POST `/api/v1/stores`
Register a new store under the logged-in seller account (initially sets status to `PENDING_VERIFICATION`).
- **Access:** Seller only (`Bearer <sellerToken>`)
- **Request Body:**
```json
{
  "name": "Verma Daily Mart",
  "description": "Fresh dairy, vegetables and pantry staples",
  "phone": "9876543210",
  "email": "vermastore@example.com",
  "addressLine": "Shop 12, Main Market, Indiranagar",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560038",
  "latitude": 12.9784,
  "longitude": 77.6408,
  "openingTime": "08:00",
  "closingTime": "22:00"
}
```

### GET `/api/v1/stores/my-stores`
List all stores owned by the authenticated seller.
- **Access:** Seller only

### GET `/api/v1/stores/my-stores/:id`
Get store details for owner seller.
- **Access:** Seller only (ownership verified)

### PATCH `/api/v1/stores/my-stores/:id`
Update store profile, hours, or address.
- **Access:** Seller only (ownership verified)

### PATCH `/api/v1/stores/my-stores/:id/toggle-open`
Open or close store for incoming orders.
- **Access:** Seller only (requires store to be approved by admin)
- **Request Body:**
```json
{
  "isOpen": true
}
```

---

## 4. Admin Store Controls (`/api/v1/stores/:id`)

### PATCH `/api/v1/stores/:id/status`
Approve, reject, or suspend a store.
- **Access:** Admin only (`Bearer <adminToken>`)
- **Request Body:**
```json
{
  "status": "ACTIVE"
}
```
*(Options: `PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `REJECTED`)*

### PATCH `/api/v1/stores/:id/commission`
Configure platform commission rate (%) for the store.
- **Access:** Admin only
- **Request Body:**
```json
{
  "commissionRate": 12.50
}
```
