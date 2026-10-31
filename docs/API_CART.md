# QuickKart — Cart API Documentation

---

## 1. Overview & Business Rules

The Cart Module handles customer shopping carts with hyperlocal constraints:
- **One Active Cart Per Customer:** A customer has exactly one persistent shopping cart tied to their profile.
- **Single-Store Locking Constraint:** QuickKart delivers hyperlocally from neighborhood stores. A cart can only contain items from a single store at any time. Attempting to add an item from a different store returns `400 Bad Request`.
- **Live Inventory Verification:** Adding or updating quantities validates real-time against `inventory.quantity`.
- **Server-Side Pricing & Discounts:** All price totals, effective discounted prices, coupon calculations, delivery fees, and taxes are strictly calculated and validated on the backend.
- **Access Control:** All cart endpoints require `CUSTOMER` authentication (`Authorization: Bearer <token>`).

---

## 2. Endpoints Reference (`/api/v1/cart`)

### GET `/api/v1/cart`
Retrieve the authenticated customer's current cart with real-time totals and coupon status.
- **Access:** Authenticated Customer
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "cartId": "uuid",
    "storeId": "store-uuid",
    "itemCount": 2,
    "items": [
      {
        "id": "cart-item-uuid",
        "productId": "product-uuid",
        "quantity": 2,
        "unitPrice": 55,
        "regularPrice": 60,
        "discountedPrice": 55,
        "totalPrice": 110,
        "product": {
          "id": "product-uuid",
          "name": "Farm Fresh Milk 1L",
          "slug": "farm-fresh-milk-1l",
          "unit": "litre",
          "isAvailable": true,
          "images": [],
          "store": {
            "id": "store-uuid",
            "name": "Fresh Dairy Store"
          }
        }
      }
    ],
    "summary": {
      "subtotal": 110.00,
      "discountAmount": 0.00,
      "coupon": null,
      "deliveryFee": 40.00,
      "taxAmount": 5.50,
      "totalAmount": 155.50
    }
  }
}
```

---

### POST `/api/v1/cart/items`
Add an item to the shopping cart.
- **Access:** Authenticated Customer
- **Request Body:**
```json
{
  "productId": "11111111-1111-4111-8111-111111111111",
  "quantity": 2
}
```
- **Response (200 OK):** Returns full updated cart object.
- **Error Responses:**
  - `400 Bad Request`: "Your cart already contains items from another store. Please clear your cart or complete your order first."
  - `400 Bad Request`: "Insufficient stock. Only 5 unit(s) available."
  - `404 Not Found`: "Product not found or unavailable."
  - `422 Unprocessable Entity`: Validation failure (invalid UUID or quantity < 1).

---

### PATCH `/api/v1/cart/items/:productId`
Update item quantity in cart. Setting `quantity: 0` removes the item.
- **Access:** Authenticated Customer
- **Request Body:**
```json
{
  "quantity": 3
}
```
- **Response (200 OK):** Returns full updated cart object.

---

### DELETE `/api/v1/cart/items/:productId`
Remove an item from the cart. When the last item is removed, the cart automatically unlocks from its store.
- **Access:** Authenticated Customer
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": { ... }
}
```

---

### DELETE `/api/v1/cart/clear`
Clear all items and coupons from the cart and reset the store lock.
- **Access:** Authenticated Customer
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "cartId": "uuid",
    "storeId": null,
    "itemCount": 0,
    "items": [],
    "summary": {
      "subtotal": 0,
      "discountAmount": 0,
      "coupon": null,
      "deliveryFee": 0,
      "taxAmount": 0,
      "totalAmount": 0
    }
  }
}
```

---

### POST `/api/v1/cart/coupon`
Apply a promotional coupon code.
- **Access:** Authenticated Customer
- **Request Body:**
```json
{
  "couponCode": "WELCOME50"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "summary": {
      "subtotal": 200.00,
      "discountAmount": 50.00,
      "coupon": {
        "id": "coupon-uuid",
        "code": "WELCOME50",
        "appliedDiscount": 50.00
      },
      "deliveryFee": 40.00,
      "taxAmount": 7.50,
      "totalAmount": 197.50
    }
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: "Cannot apply coupon to an empty cart"
  - `400 Bad Request`: "Coupon has expired or is not yet valid"
  - `400 Bad Request`: "Minimum order amount of ₹X required for coupon CODE"
  - `400 Bad Request`: "You have already reached the maximum usage limit for this coupon"
  - `404 Not Found`: "Invalid coupon code"

---

### DELETE `/api/v1/cart/coupon`
Remove the currently applied coupon from the cart.
- **Access:** Authenticated Customer
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Coupon removed successfully",
  "data": { ... }
}
```
