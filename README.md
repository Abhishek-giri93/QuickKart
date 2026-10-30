# 🛒 QuickKart — Hyperlocal Delivery Platform

> A real-world, scalable hyperlocal food, grocery and daily essentials delivery platform connecting customers, sellers, delivery partners and administrators through four dedicated applications powered by one centralized backend.

---

## 📌 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Business Model](#2-business-model)
3. [Product Categories](#3-product-categories)
4. [Four Applications](#4-four-applications)
5. [Complete Order Workflow](#5-complete-order-workflow)
6. [Technology Stack](#6-technology-stack)
7. [Database Design Overview](#7-database-design-overview)
8. [Backend Architecture](#8-backend-architecture)
9. [API Modules](#9-api-modules)
10. [External Integrations](#10-external-integrations)
11. [Security Considerations](#11-security-considerations)
12. [Business Rules](#12-business-rules)
13. [Team Structure & Ownership](#13-team-structure--ownership)
14. [Git Workflow](#14-git-workflow)
15. [Development Philosophy](#15-development-philosophy)
16. [Backend Development Sequence](#16-backend-development-sequence)
17. [Potential Technical Risks](#17-potential-technical-risks)
18. [Environment Setup](#18-environment-setup)

---

## 1. Project Overview

| Field | Details |
|---|---|
| **Project Name** | QuickKart |
| **Type** | Hyperlocal Delivery Marketplace |
| **Platform** | Mobile (Customer, Seller, Delivery Partner) + Web (Admin) |
| **Repository** | https://github.com/Abhishek-giri93/QuickKart.git |
| **Goal** | Connect customers with nearby restaurants, grocery stores, supermarkets and local retailers for fast delivery of food, groceries and daily essentials |

QuickKart is built to scale — starting from a small local area and expanding to multiple cities. This is a **professional-grade software engineering project**, not a basic college project, and must follow industry best practices at every stage.

---

## 2. Business Model

QuickKart connects **four major participants**:

```
┌─────────────┐      Orders       ┌─────────────┐
│  CUSTOMER   │ ───────────────▶  │   SELLER    │
│  (Buyer)    │                   │  (Store)    │
└─────────────┘                   └─────────────┘
       │                                 │
       │   Delivery                      │ Ready Order
       ▼                                 ▼
┌─────────────────┐          ┌──────────────────────┐
│ DELIVERY PARTNER│          │  PLATFORM ADMIN      │
│  (Fulfilment)   │          │  (Oversight & Mgmt)  │
└─────────────────┘          └──────────────────────┘
```

| Participant | Role |
|---|---|
| **Customer** | Browses, orders and pays for products |
| **Seller** | Lists products, manages inventory, accepts/rejects orders |
| **Delivery Partner** | Picks up packages from sellers and delivers to customers |
| **Admin** | Manages the entire marketplace, approves sellers, monitors transactions |

---

## 3. Product Categories

QuickKart supports the following categories (extensible in future):

| # | Category | Examples |
|---|---|---|
| 1 | **Groceries** | Vegetables, Fruits, Milk, Eggs, Rice, Flour, Pulses |
| 2 | **Food & Restaurants** | Breakfast, Lunch, Dinner, Snacks, Fast Food, Beverages |
| 3 | **Household Essentials** | Cleaning products, Detergents, Soaps, Personal care |
| 4 | **Stationery** | Books, Notebooks, Pens, Office supplies |
| 5 | **Daily-use Products** | Miscellaneous daily needs (expandable) |

---

## 4. Four Applications

All four applications share **one centralized backend**.

---

### 📱 A. Customer Mobile Application

**Who:** End consumers ordering products for home delivery.

**Key Features:**
- Register / Login (OTP or Email)
- Profile management
- Save multiple delivery addresses
- Discover nearby stores (location-based)
- Browse product categories
- Search, filter and sort products
- View detailed product information
- Add to cart / manage quantities
- Apply coupons
- Checkout flow
- Select delivery address
- Choose payment method (UPI, Card, COD)
- Place orders
- Real-time order tracking
- Order history and reorder
- Schedule deliveries
- Rate sellers and delivery partners
- Push notifications
- Contact customer support

---

### 🏪 B. Seller Mobile Application

**Who:** Local shopkeepers, restaurants, grocery stores and supermarkets.

**Key Features:**
- Seller account registration
- Store registration and verification
- Manage store profile (name, address, hours, images)
- Add / edit / delete products
- Upload product images
- Manage pricing
- Manage inventory and stock
- Set product availability (in-stock / out-of-stock)
- Receive real-time order notifications
- Accept or reject orders
- Mark order as preparing / ready
- Choose delivery method (self-delivery or platform delivery)
- View sales reports
- Monitor earnings and settlements
- Manage store opening hours
- View and respond to customer reviews

---

### 🚴 C. Delivery Partner Mobile Application

**Who:** Independent individuals who perform deliveries.

**Key Features:**
- Register and complete profile verification
- Toggle online/offline availability
- Receive delivery request notifications
- Accept or reject delivery requests
- View pickup and drop-off locations on map
- Navigate to seller store (Google Maps)
- Confirm package pickup
- Navigate to customer location
- Complete delivery with OTP verification
- View completed delivery history
- Track daily/weekly earnings
- Earnings withdrawal

---

### 🖥️ D. Admin Web Dashboard

**Who:** Platform owners and administrators.

**Key Features:**
- Manage all customers
- Manage all sellers (approve / reject / suspend)
- Manage all stores
- Manage delivery partners
- Manage product catalog and categories
- Monitor all orders in real-time
- Monitor all transactions and payments
- Manage platform commission rates
- Manage coupons and discount campaigns
- Manage refunds and disputes
- Handle customer complaints and support tickets
- View business analytics and reports
- Monitor platform performance metrics

---

## 5. Complete Order Workflow

```
Customer selects store
        │
        ▼
Customer adds products to cart
        │
        ▼
Customer proceeds to checkout
        │
        ▼
Backend validates:
  - Products exist and are available
  - Inventory is sufficient
  - Prices are correct
  - Store is open
        │
        ▼
Backend creates ORDER (status: PENDING)
        │
        ▼
Seller receives push notification
        │
        ▼
Seller ACCEPTS or REJECTS the order
        │
   ┌────┴────┐
REJECT      ACCEPT
   │           │
Order        Order status → ACCEPTED
CANCELLED        │
                 ▼
          Seller prepares order
          Order status → PREPARING
                 │
                 ▼
          Seller marks order READY
                 │
                 ▼
          Delivery Assignment:
          - Seller's own delivery, OR
          - Platform assigns Delivery Partner
                 │
                 ▼
          Delivery Partner picks up package
          Order status → OUT_FOR_DELIVERY
                 │
                 ▼
          Delivery Partner reaches customer
                 │
                 ▼
          Customer verifies via OTP
                 │
                 ▼
          Order status → DELIVERED
                 │
                 ▼
          Payment & settlement records updated
                 │
                 ▼
          Customer submits review (optional)
```

> ⚠️ **Phase 1 Constraint:** Each order belongs to exactly one store.

---

## 6. Technology Stack

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework and API server |
| **JavaScript ES Modules** | Modern module system (`import`/`export`) |
| **PostgreSQL** | Primary relational database |
| **Prisma ORM** | Database schema, migrations and query builder |
| **JWT** | Authentication tokens (Access + Refresh) |
| **Socket.IO** | Real-time order tracking and notifications |
| **Joi / Zod** | Request validation |
| **Jest / Vitest + Supertest** | Unit and integration testing |

### External Integrations (Planned, not immediate)

| Service | Purpose |
|---|---|
| **Razorpay** | Payment processing |
| **Google Maps API** | Location services and navigation |
| **Cloudinary** | Image upload and storage |
| **Firebase Cloud Messaging** | Mobile push notifications |

> 🔔 External services will be integrated **after** the core backend foundation is stable.

### Frontend (Frontend Agent's Responsibility)

| Technology | Notes |
|---|---|
| React Native / Flutter | Mobile apps (TBD by frontend agent) |
| React.js | Admin web dashboard |

---

## 7. Database Design Overview

### Core Entities

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Users   │────▶│   Customer   │     │    Seller    │
│          │     │   Profile    │     │   Profile    │
└──────────┘     └──────────────┘     └──────────────┘
                                             │
                                             ▼
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ Category │────▶│   Products   │────▶│    Stores    │
└──────────┘     └──────────────┘     └──────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
     ┌──────────────┐       ┌──────────────┐
     │  Inventory   │       │ Product Image│
     └──────────────┘       └──────────────┘

┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Carts   │────▶│  Cart Items  │     │   Addresses  │
└──────────┘     └──────────────┘     └──────────────┘

┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Orders  │────▶│ Order Items  │────▶│  Deliveries  │
└──────────┘     └──────────────┘     └──────────────┘
     │
     ▼
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ Payments │────▶│ Transactions │────▶│   Refunds    │
└──────────┘     └──────────────┘     └──────────────┘

┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ Coupons  │     │   Reviews    │     │Notifications │
└──────────┘     └──────────────┘     └──────────────┘

┌──────────────────┐
│  Support Tickets │
└──────────────────┘
```

### Complete Entity List

| # | Entity | Key Responsibilities |
|---|---|---|
| 1 | Users | Auth base: email, password, phone, role |
| 2 | Customer Profiles | Personal info, loyalty data |
| 3 | Seller Profiles | Business info, KYC, bank details |
| 4 | Stores | Store details, hours, location, rating |
| 5 | Delivery Partners | Vehicle info, availability, rating |
| 6 | Addresses | Customer saved addresses with coordinates |
| 7 | Categories | Product category tree |
| 8 | Products | Name, price, description, category, store |
| 9 | Product Images | Multiple images per product (Cloudinary) |
| 10 | Inventory | Stock quantity per product |
| 11 | Carts | One active cart per customer |
| 12 | Cart Items | Products + quantity in cart |
| 13 | Orders | Complete order record with status |
| 14 | Order Items | Snapshot of products at order time |
| 15 | Deliveries | Delivery assignment and tracking |
| 16 | Payments | Payment intent, method, status |
| 17 | Transactions | Audit trail of all money movements |
| 18 | Refunds | Refund records linked to orders |
| 19 | Coupons | Discount codes, validity, usage limits |
| 20 | Reviews | Customer ratings for sellers/delivery partners |
| 21 | Notifications | In-app notification records |
| 22 | Support Tickets | Customer complaints and resolution |

### Key Database Constraints
- Inventory can **never go negative** (database-level constraint + application-level check)
- Duplicate payment processing must be **prevented** (idempotency keys)
- Order status transitions must follow a **defined state machine**
- Proper **foreign key constraints** and **indexes** on all lookup fields

---

## 8. Backend Architecture

```
📁 QuickKart/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/          # DB, env, app config
│   │   ├── 📁 middlewares/     # Auth, validation, error handling
│   │   ├── 📁 modules/
│   │   │   ├── 📁 auth/        # Registration, login, JWT
│   │   │   ├── 📁 users/       # User profile management
│   │   │   ├── 📁 stores/      # Store management
│   │   │   ├── 📁 products/    # Product CRUD
│   │   │   ├── 📁 inventory/   # Stock management
│   │   │   ├── 📁 categories/  # Category management
│   │   │   ├── 📁 cart/        # Cart operations
│   │   │   ├── 📁 orders/      # Order lifecycle
│   │   │   ├── 📁 deliveries/  # Delivery management
│   │   │   ├── 📁 payments/    # Payment processing
│   │   │   ├── 📁 reviews/     # Rating system
│   │   │   ├── 📁 coupons/     # Discount management
│   │   │   ├── 📁 notifications/ # Push & in-app notifications
│   │   │   ├── 📁 support/     # Support tickets
│   │   │   └── 📁 admin/       # Admin operations
│   │   ├── 📁 sockets/         # Socket.IO real-time handlers
│   │   ├── 📁 services/        # External service integrations
│   │   ├── 📁 utils/           # Helpers, formatters, constants
│   │   └── 📁 validators/      # Zod/Joi schemas
│   ├── 📁 prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── 📁 migrations/      # Migration history
│   ├── 📁 tests/               # Jest/Vitest test suites
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # Entry point
├── 📁 frontend/                # Frontend Agent's ownership
├── 📁 docs/
│   ├── API.md                  # API documentation
│   ├── DATABASE.md             # Database schema docs
│   └── ARCHITECTURE.md        # Architecture decisions
└── README.md
```

---

## 9. API Modules

| Module | Base Route | Responsibility |
|---|---|---|
| Auth | `/api/v1/auth` | Register, Login, Logout, Refresh Token |
| Customers | `/api/v1/customers` | Profile, Addresses |
| Sellers | `/api/v1/sellers` | Profile, Verification, Earnings |
| Stores | `/api/v1/stores` | Store CRUD, Hours, Discovery |
| Products | `/api/v1/products` | Product CRUD, Images, Search |
| Categories | `/api/v1/categories` | Category listing and management |
| Inventory | `/api/v1/inventory` | Stock management |
| Cart | `/api/v1/cart` | Cart operations, Item management |
| Orders | `/api/v1/orders` | Order lifecycle, Status updates |
| Deliveries | `/api/v1/deliveries` | Assignment, Tracking, OTP verify |
| Payments | `/api/v1/payments` | Initiate, Verify, Refund |
| Coupons | `/api/v1/coupons` | Apply, Validate, Admin CRUD |
| Reviews | `/api/v1/reviews` | Submit and view ratings |
| Notifications | `/api/v1/notifications` | Notification history |
| Support | `/api/v1/support` | Raise and manage tickets |
| Admin | `/api/v1/admin` | Full platform management |

---

## 10. External Integrations

| Integration | Trigger | Status |
|---|---|---|
| **Razorpay** | Payment initiation and verification | 🔜 Phase 2 |
| **Google Maps** | Store discovery, delivery navigation | 🔜 Phase 2 |
| **Cloudinary** | Product and store image uploads | 🔜 Phase 2 |
| **Firebase Cloud Messaging** | Push notifications to mobile apps | 🔜 Phase 2 |

---

## 11. Security Considerations

| Area | Implementation |
|---|---|
| **Authentication** | JWT Access Token (short-lived) + Refresh Token (long-lived, HTTP-only cookie) |
| **Authorization** | Role-based access control (CUSTOMER, SELLER, DELIVERY_PARTNER, ADMIN) |
| **Password Storage** | bcrypt hashing with salt rounds |
| **Input Validation** | Zod/Joi on every request body and query param |
| **SQL Injection** | Prisma ORM parameterized queries |
| **Rate Limiting** | express-rate-limit on auth and sensitive endpoints |
| **Sensitive Data** | Never expose passwords, tokens or internal IDs in responses |
| **Payment Verification** | Always verify payment status server-side via Razorpay webhook |
| **Inventory Safety** | Database-level CHECK constraints + atomic transactions |
| **Idempotency** | Prevent duplicate order creation and payment processing |
| **CORS** | Strict origin whitelist |
| **Helmet.js** | Security HTTP headers |
| **Environment Secrets** | All secrets in `.env`, never committed to Git |

---

## 12. Business Rules

These rules must be enforced at the **API level** at all times:

- ✅ One order = One store (Phase 1 constraint)
- ✅ Sellers can only manage **their own** stores and products
- ✅ Delivery partners can only update **their assigned** deliveries
- ✅ Inventory can **never go negative**
- ✅ Orders must be **accepted by seller** before preparation begins
- ✅ Order status can only transition in the **defined sequence**
- ✅ Payment status must be **verified on the server**, never trusted from the client
- ✅ All refunds must be recorded in the transactions table
- ✅ All protected endpoints must validate **JWT + Role**
- ✅ Sensitive user data must never be leaked in API responses

---

## 13. Team Structure & Ownership

| Participant | Role | Ownership |
|---|---|---|
| **ChatGPT** | Central Project Coordinator & Technical Architect | Overall project coordination, decisions |
| **Antigravity Agent (This System)** | Backend Engineering Agent | `/backend/`, API docs, DB docs |
| **Antigravity Agent (Other System)** | Frontend Engineering Agent | `/frontend/`, mobile & web apps |

### Backend Agent Owns:
- `backend/` — all source code
- `docs/API.md` — API documentation
- `docs/DATABASE.md` — Database documentation
- `docs/ARCHITECTURE.md` — Architecture decisions
- Database schema and migrations

### Frontend Agent Owns:
- `frontend/` — all frontend applications

---

## 14. Git Workflow

### Branch Strategy

```
main                    ← Production-ready releases only
  └── develop           ← Integration branch (all features merge here)
        ├── feature/backend-foundation    ← Current backend branch
        ├── feature/auth-module
        ├── feature/product-module
        ├── feature/order-module
        └── feature/frontend-*           ← Frontend agent's branches
```

### Rules

| Rule | Detail |
|---|---|
| ✅ Always branch from `develop` | Never branch from `main` |
| ✅ Use feature branches | One feature per branch |
| ✅ Pull Requests required | No direct push to `develop` or `main` |
| ✅ Descriptive commit messages | Follow conventional commits (`feat:`, `fix:`, `chore:`, `docs:`) |
| ❌ Never modify frontend files | Backend agent stays in `backend/` |
| ❌ Never commit `.env` | Use `.env.example` with dummy values |
| ❌ Never push secrets | API keys, DB passwords stay local |
| ❌ Never change shared configs without coordination | Discuss with Coordinator first |

### Commit Convention

```
feat: add order creation API
fix: resolve inventory decrement race condition
chore: setup Prisma schema for users
docs: update API documentation for auth module
test: add unit tests for order status transitions
```

---

## 15. Development Philosophy

- **Incremental Development** — Never build everything at once. One module at a time.
- **Explain Everything** — Every implementation must document what, why and how.
- **Test as You Build** — Write tests alongside features, not after.
- **Coordinate Before Acting** — Check with the Central Coordinator before major decisions.
- **No Gold Plating** — Build what is needed now. Keep future features as TODOs.
- **Professional Standards** — Follow clean code principles, SOLID, proper error handling.

---

## 16. Backend Development Sequence

> Approved by Central Project Coordinator before each phase begins.

| Phase | Module | Description |
|---|---|---|
| **Phase 1** | 🏗️ Foundation | Project setup, Express server, PostgreSQL connection, Prisma init |
| **Phase 2** | 🔐 Authentication | Register, Login, JWT, Refresh Token, Role-based Auth |
| **Phase 3** | 👤 User Profiles | Customer profile, Seller profile, Address management |
| **Phase 4** | 🏪 Stores & Categories | Store CRUD, Category management, Store discovery |
| **Phase 5** | 📦 Products & Inventory | Product CRUD, Images, Stock management |
| **Phase 6** | 🛒 Cart | Add to cart, Update quantities, Remove items, Cart summary |
| **Phase 7** | 📋 Orders | Order creation, Status machine, Seller acceptance |
| **Phase 8** | 🚴 Deliveries | Assignment, Pickup, OTP verification, Completion |
| **Phase 9** | 💳 Payments | Razorpay integration, Webhooks, Settlement records |
| **Phase 10** | 🔔 Notifications | Firebase FCM, Socket.IO real-time updates |
| **Phase 11** | ⭐ Reviews & Support | Rating system, Support ticket management |
| **Phase 12** | 🛡️ Admin APIs | Full admin dashboard backend |
| **Phase 13** | 🧪 Testing | Complete test coverage (unit + integration) |
| **Phase 14** | 📖 Documentation | API docs, Postman collection, Deployment guide |

---

## 17. Potential Technical Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Race conditions on inventory** | 🔴 High | Use PostgreSQL transactions + `SELECT FOR UPDATE` |
| **Duplicate payment processing** | 🔴 High | Idempotency keys + Razorpay webhook verification |
| **Unauthorized store/order access** | 🔴 High | Strict role + ownership checks on every endpoint |
| **JWT token theft** | 🟡 Medium | Short-lived access tokens + HTTP-only refresh cookies |
| **Order status inconsistency** | 🟡 Medium | Server-enforced state machine, no client-controlled transitions |
| **Image upload failures** | 🟡 Medium | Handle Cloudinary failures gracefully, queue retries |
| **Delivery assignment conflicts** | 🟡 Medium | Atomic assignment with locking |
| **Push notification failures** | 🟢 Low | Queue with retry, in-app fallback |
| **Scaling bottlenecks** | 🟢 Low | Design with horizontal scaling in mind from start |

---

## 18. Environment Setup

> Full setup guide will be added once Phase 1 implementation is approved.

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- Git

### Quick Start (After Approval)

```bash
# Clone repository
git clone https://github.com/Abhishek-giri93/QuickKart.git
cd QuickKart/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your local values

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables (Template)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quickkart

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Razorpay (Phase 2)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Cloudinary (Phase 2)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Firebase (Phase 2)
FIREBASE_SERVER_KEY=

# Google Maps (Phase 2)
GOOGLE_MAPS_API_KEY=
```

---

## 📊 Current Status

| Item | Status |
|---|---|
| Repository created | ✅ Done |
| `develop` branch created & pushed | ✅ Done |
| `feature/backend-foundation` branch created | ✅ Done |
| Project understanding documented | ✅ Done |
| Backend implementation | ⏳ Awaiting Coordinator approval |

---

## 🤝 Contributing

This project follows a strict **coordinator-approved, feature-branch workflow**.

All implementation must be:
1. Approved by the Central Project Coordinator (ChatGPT)
2. Developed on a dedicated feature branch
3. Submitted via Pull Request to `develop`
4. Reviewed before merging

---

*Last Updated: October 2026 | Backend Engineering Agent — Antigravity*

