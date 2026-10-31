# QuickKart — Admin Operations Dashboard

> **Enterprise Operations & Analytics Portal for QuickKart**  
> Built with React 19, Vite, and modern CSS architecture.

---

## 💻 Overview

The Admin Dashboard provides QuickKart platform operators with real-time visibility into the hyperlocal delivery ecosystem:

- **Executive KPI Cards**: Real-time Gross Merchandise Value (GMV), Active Orders, Platform Commission Revenue, and Online Delivery Partners.
- **Store Verification & Moderation**: Review pending merchant KYC documents, approve new store applications, or suspend non-compliant sellers.
- **Promotions & Coupon Manager**: Create and activate discount coupons (percentage or flat discount, minimum order value, validity periods).
- **Fleet Dispatch Oversight**: Monitor real-time order delivery statuses from placement to final customer OTP verification.

---

## 🚀 Running the Admin Dashboard

### Prerequisites
- Node.js v18 or higher
- QuickKart Backend API running on `http://localhost:5000`

### Quick Start
```bash
# 1. Navigate to the admin dashboard folder
cd apps/admin-dashboard

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the Vite development server
npm run dev
```

The portal will open automatically at:
👉 **`http://localhost:5173`**

---

## 🎨 UI & Layout Highlights

- **100% Full-Screen Layout**: Fixed previous Vite boilerplate constraints to fill full widescreen monitors with zero wasted margins.
- **Enterprise Dark Slate Theme**: `#0F172A` sidebar with `#3B82F6` accent styling.
- **Interactive Sidebar Navigation**: Seamlessly switch between Analytics Overview, Store Approvals, Orders Monitoring, Coupon Creator, and Moderation.
