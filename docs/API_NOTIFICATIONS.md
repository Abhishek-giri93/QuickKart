# QuickKart — Notifications & Realtime API Documentation

---

## 1. Overview & Realtime Architecture

Phase 10 introduces the Notification and Real-Time WebSocket Architecture for QuickKart:
- **Persistent Notifications:** Notifications are saved to the PostgreSQL database with status tracking (`isRead`, `readAt`, and `data` JSON payload).
- **Socket.IO Real-Time Dispatch:** When a notification is generated, it is automatically pushed to the recipient's personal user room (`user_<userId>`).
- **Live Order & GPS Tracking:**
  - Clients join `order_<orderId>` rooms to receive live order updates.
  - Delivery partners stream live coordinates via `delivery:location_update` $\rightarrow$ broadcasted as `delivery:location` to anyone tracking the order.

### Realtime Socket.IO Events Reference
| Event | Direction | Payload | Description |
|---|---|---|---|
| `join_order` | Client $\rightarrow$ Server | `orderId` (string) | Join room for live order tracking |
| `leave_order` | Client $\rightarrow$ Server | `orderId` (string) | Leave order tracking room |
| `delivery:location_update` | Partner $\rightarrow$ Server | `{ orderId, latitude, longitude }` | Delivery partner broadcasts live GPS location |
| `delivery:location` | Server $\rightarrow$ Room | `{ orderId, deliveryPartnerId, latitude, longitude, timestamp }` | Live GPS location delivered to order tracking room |
| `notification:received` | Server $\rightarrow$ User | `Notification` object | Real-time push of persistent notification |

---

## 2. Endpoints Reference (`/api/v1/notifications`)

### All Authenticated Users

#### GET `/api/v1/notifications`
Get user notifications with filtering and pagination.
- **Access:** Authenticated User
- **Query Parameters:**
  - `isRead` (boolean, optional): `true` or `false`
  - `type` (string, optional): `ORDER_UPDATE`, `DELIVERY_UPDATE`, `PAYMENT_UPDATE`, `PROMOTION`, `SYSTEM`
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`, max: `100`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "id": "notif-uuid",
        "userId": "user-uuid",
        "type": "ORDER_UPDATE",
        "title": "Order Placed",
        "body": "Your order #QK-2026-11111 has been placed successfully.",
        "data": { "orderId": "order-uuid" },
        "isRead": false,
        "readAt": null,
        "createdAt": "2026-10-31T04:15:00.000Z"
      }
    ],
    "unreadCount": 1
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

---

#### GET `/api/v1/notifications/unread-count`
Get count of unread notifications for badge counts.
- **Access:** Authenticated User
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Unread count retrieved successfully",
  "data": {
    "unreadCount": 3
  }
}
```

---

#### PATCH `/api/v1/notifications/:id/read`
Mark a single notification as read.
- **Access:** Authenticated User (recipient only)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": "notif-uuid",
    "isRead": true,
    "readAt": "2026-10-31T04:20:00.000Z"
  }
}
```

---

#### PATCH `/api/v1/notifications/read-all`
Mark all unread notifications as read.
- **Access:** Authenticated User
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "updatedCount": 5
  }
}
```

---

#### DELETE `/api/v1/notifications/:id`
Delete a notification.
- **Access:** Authenticated User (recipient only)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification deleted successfully",
  "data": null
}
```

---

### Admin Endpoints

#### POST `/api/v1/notifications/send`
Dispatch a notification to a specific user (saves to DB and emits over Socket.IO).
- **Access:** Authenticated Admin
- **Request Body:**
```json
{
  "userId": "user-uuid",
  "type": "SYSTEM",
  "title": "Platform Announcement",
  "body": "Special Diwali flash sale starts at 6 PM!",
  "data": { "promoCode": "DIWALI50" }
}
```
- **Response (201 Created):** Returns created `Notification` object.
