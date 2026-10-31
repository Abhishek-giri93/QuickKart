# QuickKart — Frontend Suite Documentation

> **Complete guide to running, developing, and deploying QuickKart's 4 Frontend Applications.**  
> Built with React Native (Expo SDK 58), React 19, Vite, and Zustand.

---

## 📱 Frontend Architecture Overview

QuickKart features four dedicated frontend clients designed for each actor in the hyperlocal delivery ecosystem:

```
apps/
├── customer-app/       # 🛒 Customer Shopping & Tracking Mobile App (Expo / React Native)
├── seller-app/         # 🏪 Store Manager & Order Prep Mobile App (Expo / React Native)
├── delivery-app/       # 🛵 Delivery Partner Shift & OTP Trip Mobile App (Expo / React Native)
└── admin-dashboard/    # 💻 Super Admin Analytics & Fleet Management Web Portal (React 19 + Vite)
```

---

## 🎨 Design System & Color Tokens

Each application follows a consistent layout and spacing system, paired with purpose-driven brand themes:

| Application | Primary Color | Accent / Dark | Focus Persona |
|---|---|---|---|
| **Customer App** | `#FF6B35` (Quick Orange) | `#0F172A` (Midnight Navy) | Consumers ordering food & grocery |
| **Seller App** | `#2D6A4F` (Forest Green) | `#FFB703` (Warm Amber) | Merchants managing orders & inventory |
| **Delivery App** | `#1D3557` (High-Contrast Navy) | `#E63946` (Urgency Red) | Riders fulfilling orders with OTP |
| **Admin Dashboard** | `#0F172A` (Enterprise Slate) | `#3B82F6` (Electric Blue) | Super Admins overseeing platform GMV & KYC |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Expo Go App**: Installed on your physical Android or iOS device from Play Store / App Store
- **Local Network**: Ensure your mobile phone and development machine are connected to the **same Wi-Fi network**.

---

### 1. 🛒 Customer Mobile App (`apps/customer-app`)

The consumer-facing app for discovering nearby stores, browsing catalogs, managing carts, and tracking live orders.

#### Installation & Run
```bash
cd apps/customer-app
npm install
npx expo start
```

#### Running on Your Phone
1. Scan the QR code shown in your terminal using the **Expo Go** app on Android (or Camera app on iOS).
2. **Wi-Fi Connectivity**: The app communicates with the backend via your development machine's LAN IP (`http://172.28.141.39:5000/api/v1`).
3. Press **`r`** in the terminal anytime to reload the app.

#### Key Features
- **Notch & Safe-Area Aware**: Integrated with `react-native-safe-area-context` to prevent notification bar overlap on modern Android punch-hole displays.
- **Client-side Form Validation**: Real-time validation for Indian phone numbers (`+91` / 10 digits), secure passwords, and emails.
- **Live Backend Auth**: Connected to `POST /api/v1/auth/login` and `POST /api/v1/auth/register/customer`.
- **Resilient Offline Fallback**: Automatically switches to mock catalog data if the backend is temporarily offline.
- **Interactive Switcher**: Collapsible quick screen switcher (`Home`, `Store`, `Cart`, `Live Track`, `Profile`, `Login`, `Register`).

---

### 2. 🏪 Seller Mobile App (`apps/seller-app`)

The merchant-facing app for store owners to manage incoming orders, kitchen preparation, and product stock.

#### Installation & Run
```bash
cd apps/seller-app
npm install
npx expo start
```

#### Key Features
- **Online / Offline Toggle**: Instantly opens or closes the store for incoming customer orders.
- **Order Pipeline Workflow**: 
  - `Accept / Decline` new incoming orders with sound/visual alerts.
  - Advance status to `PREPARING` and `READY_FOR_PICKUP`.
- **Live Inventory Manager**: Real-time in-stock / out-of-stock toggles for items.
- **Earnings & Payouts**: Daily revenue breakdown and bank transfer summaries.

---

### 3. 🛵 Delivery Partner App (`apps/delivery-app`)

The rider-facing app for gig workers fulfilling hyperlocal orders.

#### Installation & Run
```bash
cd apps/delivery-app
npm install
npx expo start
```

#### Key Features
- **Shift & Duty Toggle**: Start or end shifts with GPS status tracking.
- **Order Dispatch Acceptance**: Real-time broadcast card showing pickup address, delivery distance, and estimated payout.
- **Pickup & Drop Navigation**: Turn-by-turn route indicators.
- **Customer Delivery Verification**: Secure 4-digit OTP validation before completing delivery.
- **Daily Rider Earnings**: Shift tips, delivery bonuses, and instant payout status.

---

### 4. 💻 Admin Web Dashboard (`apps/admin-dashboard`)

Enterprise single-page web app for QuickKart operations and platform administration.

#### Installation & Run
```bash
cd apps/admin-dashboard
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

#### Key Features
- **Full-Screen Responsive Layout**: High-density 100% monitor layout with a collapsible dark sidebar.
- **Platform Analytics**: Executive KPI cards (Gross Merchandise Value, Active Orders, Revenue, Live Riders).
- **Store KYC Moderation**: Approve or reject newly registered merchant stores.
- **Coupon Management**: Create and configure discount codes (e.g., `QUICK50`, percentage vs fixed).
- **User & Rider Management**: Moderate accounts and monitor fleet availability.

---

## 🌐 Network & API Integration Architecture

### Mobile Devices & Physical Wi-Fi
When testing on a physical smartphone, `localhost` refers to the mobile phone itself. QuickKart's mobile apps dynamically route network requests through the machine's LAN IP:

```
[Phone (Expo Go)]
       │
       │ Wi-Fi LAN Request: http://172.28.141.39:5000/api/v1
       ▼
[Laptop / PC (Backend API Server)]
       │
       ├── Express 5 + Helmet + CORS
       ├── PostgreSQL (Prisma ORM)
       └── Socket.IO Real-time Events
```

### API Endpoints Overview

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/api/v1/health` | Server heartbeat & status |
| **Auth** | `POST` | `/api/v1/auth/login` | Email or phone login |
| **Auth** | `POST` | `/api/v1/auth/register/customer` | Customer sign up |
| **Stores** | `GET` | `/api/v1/stores` | Nearby stores discovery |
| **Products** | `GET` | `/api/v1/products` | Catalog & product inventory |
| **Cart** | `POST` | `/api/v1/cart/items` | Add items to cart |
| **Orders** | `POST` | `/api/v1/orders` | Place customer order |
| **Admin** | `GET` | `/api/v1/admin/analytics/overview` | Platform overview KPIs |

---

## 🛠️ Troubleshooting

### 1. `Network request failed` or `Connection timed out` on mobile
- Verify that your phone and computer are on the **exact same Wi-Fi connection**.
- Run `ipconfig` (Windows) or `ifconfig` (macOS/Linux) and verify that the IP in `apps/customer-app/src/constants/api.js` matches your Wi-Fi IPv4 address.
- Ensure Windows Defender Firewall allows inbound traffic on port `5000`.

### 2. Status bar overlapping on Android
- The apps use `react-native-safe-area-context`. If testing a screen outside the navigator, wrap the root component in `<SafeAreaProvider>` and `<SafeAreaView edges={['top', 'bottom', 'left', 'right']}>`.

### 3. Clear Expo Cache
If changes don't reflect after editing code:
```bash
npx expo start -c
```
