# QuickKart — Testing & Integration Architecture (Phase 13)

This document outlines the testing strategy, test structure, mocking philosophy, and end-to-end integration flows for the QuickKart backend platform.

---

## 1. Overview & Test Stats

- **Test Runner:** [Vitest](https://vitest.dev/) (v5.0.5)
- **HTTP Assertions:** [Supertest](https://github.com/ladjs/supertest)
- **Database Engine Mocking:** In-memory isolation with `vi.mock` on Prisma Client
- **Current Status:**
  - **17 Test Files** (100% passing)
  - **119 Total Tests** (Unit + Integration + E2E)
  - **Execution Time:** ~7.4s

---

## 2. Test File Matrix

| Category | Test File | Test Count | Focus |
|---|---|---|---|
| **Foundation** | `health.test.js` | 2 | Health check ping & 404 unhandled route fallback |
| **Utilities** | `jwt.test.js` | 4 | Access/refresh token generation & verification |
| **Utilities** | `password.test.js` | 1 | Bcrypt hashing and timing-safe comparison |
| **Utilities** | `geo.test.js` | 2 | Haversine distance formula & store radius calculation |
| **Utilities** | `slugify.test.js` | 1 | URL slug generation for categories and products |
| **Phase 2: Auth** | `auth.test.js` | 3 | JWT authentication guards & /auth/me profile access |
| **Phase 3: Users** | `users.test.js` | 5 | Customer, seller, delivery partner profiles & addresses |
| **Phase 4: Stores** | `storesAndCategories.test.js` | 5 | Categories CRUD, store registration, geolocation discovery |
| **Phase 5: Inventory**| `productsAndInventory.test.js` | 6 | Product listing, single-store lookup & inventory controls |
| **Phase 6: Cart** | `cart.test.js` | 9 | Single-store enforcement, price calculations & coupons |
| **Phase 7: Orders** | `orders.test.js` | 13 | State machine transitions (PENDING → ACCEPTED → READY) |
| **Phase 8: Deliveries**| `deliveries.test.js` | 12 | Delivery assignment, pickup, live GPS & OTP verification |
| **Phase 9: Payments** | `payments.test.js` | 12 | Razorpay signature verification, webhooks & COD flows |
| **Phase 10: Realtime** | `notifications.test.js`| 11 | Push notification queues & Socket.IO real-time alerts |
| **Phase 11: Reviews** | `reviewsAndSupport.test.js`| 12 | Dual store/rider ratings & support ticket resolution |
| **Phase 12: Admin** | `admin.test.js` | 14 | Platform analytics, user moderation, store verification |
| **Phase 13: E2E** | `e2eOrderLifecycle.test.js` | 12 | Complete 4-actor order flow & edge-case invariant protections |

---

## 3. Hoisting & Mocking Pattern (`vi.hoisted`)

Vitest hoists all `vi.mock()` calls before any imports or top-level variable definitions. To prevent `ReferenceError: Cannot access 'mockData' before initialization`, all mock fixtures must be created using `vi.hoisted()`:

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// ✅ Correct Pattern
const mocks = vi.hoisted(() => {
  const CUSTOMER_USER_ID = '11111111-1111-4111-8111-111111111111';
  const mockUser = { id: CUSTOMER_USER_ID, role: 'CUSTOMER' };
  return { CUSTOMER_USER_ID, mockUser };
});

vi.mock('../src/config/prisma.js', () => ({
  default: {
    user: { findUnique: vi.fn() },
    $transaction: vi.fn((cb) => (typeof cb === 'function' ? cb(prisma) : Promise.all(cb))),
  },
}));
```

---

## 4. End-to-End Workflow Validation (`e2eOrderLifecycle.test.js`)

The Phase 13 integration suite simulates the full real-world lifecycle across all platform participants:

```
┌────────────────────────────────────────────────────────┐
│ 1. Customer: Cart Inspection & Subtotal Calculation    │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Customer: Checkout & Order Creation (PENDING)       │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. Seller: Order Acceptance (PENDING → ACCEPTED)       │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. Seller: Preparation & Ready (ACCEPTED → READY)      │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 5. Delivery Partner: Order Pickup (ACCEPTED → PICKED_UP)│
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 6. Delivery Partner: OTP Verification (→ DELIVERED)    │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 7. Customer: Dual Rating & Review (Store + Delivery)   │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 8. Admin: Overview Metrics & GMV / Commission Tracking │
└────────────────────────────────────────────────────────┘
```

### Invariant & Edge Case Protections Verified
- **Atomic Stock Restoration:** If an order is cancelled or rejected, inventory is automatically restored.
- **Cancellation Lock:** Orders in `READY`, `PICKED_UP`, or `DELIVERED` status cannot be cancelled by the customer.
- **OTP Protection:** Delivery partner cannot mark an order delivered without the exact 4-digit OTP provided to the customer.
- **Review Guard:** Reviews can only be submitted for completed orders (`DELIVERED`) owned by the requesting customer.
- **Support Workflows:** Customers can raise tickets against orders, and only Admins can transition tickets to `RESOLVED` / `CLOSED`.

---

## 5. Running Tests

```bash
# Run all 17 test suites
npm test

# Run a specific test file
npm test tests/e2eOrderLifecycle.test.js

# Generate V8 coverage report
npm run test:coverage
```
