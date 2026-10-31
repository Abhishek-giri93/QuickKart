# QuickKart — Reviews & Support API Documentation

---

## 1. Reviews API (`/api/v1/reviews`)

### Overview
- Customers can submit ratings (1 to 5) and feedback for the **Store** and/or the **Delivery Partner** for completed (`DELIVERED`) orders.
- Enforces single review per customer per order (`@@unique([orderId, customerProfileId])`).
- Average rating (`avgRating`) and total ratings (`totalRatings`) are recalculated dynamically for the Store and Delivery Partner upon review creation.

### Endpoints

#### POST `/api/v1/reviews`
Submit a review for a delivered order.
- **Access:** Authenticated Customer
- **Request Body:**
```json
{
  "orderId": "88888888-8888-4888-8888-888888888888",
  "storeRating": 5,
  "storeComment": "Fresh vegetables and neatly packed!",
  "deliveryRating": 5,
  "deliveryComment": "Delivered within 15 minutes, polite rider."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": "review-uuid",
    "orderId": "88888888-8888-4888-8888-888888888888",
    "storeRating": 5,
    "storeComment": "Fresh vegetables and neatly packed!",
    "deliveryRating": 5,
    "deliveryComment": "Delivered within 15 minutes, polite rider.",
    "store": { "id": "store-uuid", "name": "Priya Groceries" },
    "deliveryPartner": { "id": "dp-uuid", "firstName": "Ravi", "lastName": "Kumar" }
  }
}
```

---

#### GET `/api/v1/reviews/store/:storeId`
Get public reviews and ratings for a store.
- **Access:** Public
- **Query Parameters:** `page`, `limit`
- **Response (200 OK):** Returns paginated reviews with customer name and avatar.

---

#### GET `/api/v1/reviews/delivery-partner/:partnerId`
Get reviews for a delivery partner.
- **Access:** Delivery Partner (self) or Admin
- **Query Parameters:** `page`, `limit`
- **Response (200 OK):** Returns paginated reviews with customer name.

---

#### GET `/api/v1/reviews/order/:orderId`
Get review details for a specific order.
- **Access:** Authenticated User
- **Response (200 OK):** Returns review for the order.

---

## 2. Support Tickets API (`/api/v1/support`)

### Overview
- Customers, Sellers, and Delivery Partners can raise support tickets for assistance or order-related issues.
- Admins can review all platform tickets and update ticket status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) with resolution remarks.

### Endpoints

#### POST `/api/v1/support/tickets`
Create a new support ticket.
- **Access:** Authenticated User
- **Request Body:**
```json
{
  "orderId": "88888888-8888-4888-8888-888888888888", // optional
  "subject": "Missing item from delivery",
  "description": "I ordered 2 jars of honey but only received 1."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Support ticket submitted successfully",
  "data": {
    "id": "ticket-uuid",
    "status": "OPEN",
    "subject": "Missing item from delivery",
    "description": "I ordered 2 jars of honey but only received 1.",
    "createdAt": "2026-10-31T04:40:00.000Z"
  }
}
```

---

#### GET `/api/v1/support/tickets`
Get tickets created by current user.
- **Access:** Authenticated User
- **Query Parameters:** `status` (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`), `page`, `limit`
- **Response (200 OK):** Returns paginated tickets.

---

#### GET `/api/v1/support/tickets/:id`
Get ticket details by ID.
- **Access:** Ticket Creator or Admin
- **Response (200 OK):** Returns ticket details.

---

#### GET `/api/v1/support/tickets/admin/all`
List all tickets across the platform with creator details.
- **Access:** Authenticated Admin
- **Query Parameters:** `status`, `page`, `limit`
- **Response (200 OK):** Returns all platform tickets.

---

#### PATCH `/api/v1/support/tickets/:id/status`
Update ticket status and provide resolution remarks.
- **Access:** Authenticated Admin
- **Request Body:**
```json
{
  "status": "RESOLVED",
  "resolution": "Refund of missing item processed to customer wallet."
}
```
- **Response (200 OK):** Returns updated ticket with `resolvedAt` timestamp.
