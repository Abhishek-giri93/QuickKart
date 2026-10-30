# 🛒 QuickKart

> **Hyperlocal Food, Grocery & Daily Essentials Delivery Platform**

QuickKart is a mobile-first delivery marketplace that connects customers with nearby local stores and restaurants for fast, reliable delivery of food, groceries, household products, stationery and daily-use essentials.

---

## 📌 Project Overview

| Field | Details |
|---|---|
| Project Name | QuickKart |
| Type | Hyperlocal Delivery Marketplace |
| Platform | Mobile (React Native + Expo) + Web Admin (React + Vite) |
| Repository | https://github.com/Abhishek-giri93/QuickKart.git |
| Coordinator | ChatGPT (Central Project Coordinator & Technical Architect) |
| Frontend System | Antigravity — Frontend Engineering Agent |
| Backend System | Antigravity — Backend Engineering Agent (separate machine) |

---

## 👥 Platform Participants

| Role | Description |
|---|---|
| 🛍️ Customer | Browses, orders and receives deliveries |
| 🏪 Seller | Local shopkeeper or restaurant listing products |
| 🚴 Delivery Partner | Picks up and delivers orders |
| 🖥️ Admin | Manages entire marketplace operations |

---

## 🗂️ Product Categories

- 🥦 Groceries
- 🍅 Vegetables & Fruits
- 🥛 Milk & Dairy Products
- 🍔 Food & Restaurants
- 🍟 Fast Food & Snacks
- 🏠 Household Essentials
- 🧹 Cleaning Products
- 🧴 Personal Care
- 📚 Stationery
- 📦 Other Daily-Use Products

---

## 📱 Four Applications

### 1. Customer Mobile App
The primary shopping interface for end users.

**Key Modules:**
- Splash, Onboarding & Authentication
- Location Selection & Nearby Stores
- Product Discovery (Categories, Listings, Search, Filters)
- Cart & Quantity Management
- Checkout (Address, Coupon, Payment)
- Live Order Tracking
- Order History & Reorder
- Scheduled Deliveries & Wishlist
- Notifications, Profile, Reviews & Support

---

### 2. Seller Mobile App
Designed for local shopkeepers and restaurant owners.

**Key Modules:**
- Seller Onboarding & Store Registration
- Seller Dashboard & Sales Summary
- Incoming Orders (Accept / Reject)
- Product Management (Add, Edit, Delete)
- Inventory & Availability Management
- Pricing & Discounts
- Earnings & Transaction History
- Customer Reviews & Notifications

---

### 3. Delivery Partner Mobile App
Built for delivery agents to manage pickups and deliveries.

**Key Modules:**
- Onboarding, Login & Profile Verification
- Online / Offline Toggle
- Delivery Dashboard & Available Requests
- Accept / Reject Delivery
- Pickup & Customer Info
- Map & Navigation
- Pickup Confirmation & Delivery OTP
- Earnings Dashboard & Delivery History
- Notifications & Settings

---

### 4. Admin Web Dashboard
A responsive web dashboard for full platform management.

**Key Modules:**
- Admin Login & Dashboard Analytics
- Customer, Seller & Delivery Partner Management
- Seller Verification & Store Management
- Product & Category Management
- Order & Payment Monitoring
- Refund & Commission Management
- Coupon & Complaint Management
- Business Reports & Analytics
- Admin Settings

---

## 🛠️ Technology Stack

### Mobile Applications
| Tool | Purpose |
|---|---|
| React Native | Cross-platform mobile development |
| Expo | Development workflow & native APIs |
| JavaScript ES Modules | Language standard |
| React Navigation | Screen navigation |
| Axios | HTTP API calls |
| Zustand / Context API | State management |

### Admin Dashboard
| Tool | Purpose |
|---|---|
| React | UI framework |
| Vite | Build tool |
| JavaScript | Language |
| Tailwind CSS | Styling |
| React Router | Routing |
| Axios | HTTP API calls |
| Recharts | Data visualization |

### Additional Tools
| Tool | Purpose |
|---|---|
| Git & GitHub | Version control & collaboration |
| Postman | API integration testing |
| Firebase Cloud Messaging | Push notifications |
| Google Maps Platform | Location & maps |

---

## 🏗️ Frontend Architecture

```
QuickKart/
├── apps/
│   ├── customer-app/          # React Native (Expo) — Customer
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── assets/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── seller-app/            # React Native (Expo) — Seller
│   │   └── (same structure)
│   │
│   ├── delivery-app/          # React Native (Expo) — Delivery Partner
│   │   └── (same structure)
│   │
│   └── admin-dashboard/       # React + Vite — Admin Web
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── store/
│       ├── assets/
│       ├── utils/
│       └── constants/
│
├── docs/                      # Project documentation
│   ├── frontend/
│   └── api-contracts/
│
├── .gitignore
└── README.md
```

---

## 🔄 Complete Customer Order Flow

```
Open App → Select Location → Browse Nearby Stores → Select Store
→ Browse Products → Add to Cart → Review Cart → Checkout
→ Select Address → Select Payment → Place Order
→ Order Confirmation → Live Tracking → Receive Delivery
→ Confirm Delivery → Submit Rating & Review
```

---

## 🌿 Git Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code only |
| `develop` | Integration branch for all features |
| `feature/frontend-foundation` | Current frontend setup work |
| `feature/backend-*` | Backend feature branches |

### Rules
- ❌ Never push directly to `main` or `develop`
- ❌ Never commit `.env` files or secrets
- ❌ Frontend system must not modify backend files
- ❌ Backend system must not modify frontend files
- ✅ All changes go through Pull Requests
- ✅ Use feature branches for every task

---

## 📁 Frontend Ownership

The **Frontend Engineering Agent** owns:
- `apps/customer-app/`
- `apps/seller-app/`
- `apps/delivery-app/`
- `apps/admin-dashboard/`
- Frontend architecture documentation
- UI design documentation

---

## 🔌 API Integration Guidelines

- All API calls go through `services/` layer — never directly inside components
- Use mock data until API contracts are approved by the coordinator
- Do not invent endpoints — follow shared API documentation
- Keep state management separate from UI components
- Frontend must be ready to swap mock data with real APIs without restructuring

---

## 🎨 Design Principles

- Clean and minimal interfaces
- Easy and intuitive navigation
- Responsive layouts
- Consistent typography
- Reusable components
- Proper spacing and padding
- Accessible color contrast
- Smooth interactions and animations
- Clear loading, empty, error and success states

---

## 🚀 Development Philosophy

Development is **incremental and module-by-module**:

1. Explain module purpose
2. Define screens
3. Design navigation
4. Create reusable components
5. Implement UI
6. Connect state management
7. Integrate APIs (after contracts are approved)
8. Test functionality
9. Document changes

> **No full implementation in one shot. Build, review and approve each module.**

---

## 🤝 Team & Coordination

| Agent | Role |
|---|---|
| ChatGPT | Central Project Coordinator & Technical Architect |
| Antigravity (Frontend) | All four frontend applications |
| Antigravity (Backend) | API development, database, server logic |

All major decisions, API contracts and architectural changes must be approved by the **Central Project Coordinator (ChatGPT)** before implementation.

---

## 📄 License

This project is proprietary. All rights reserved.

---

*QuickKart — Delivering everything nearby, fast.*

