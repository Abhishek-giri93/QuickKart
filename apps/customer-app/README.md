# QuickKart — Customer Mobile Application

> **Hyperlocal Food, Grocery & Essentials Delivery Mobile App**  
> Built with React Native, Expo SDK 58, Zustand, and `react-native-safe-area-context`.

---

## 🛒 Overview

The Customer App delivers a 15-minute quick-commerce shopping experience for end consumers:

- **Nearby Store Discovery**: Browse verified neighborhood grocery stores, restaurants, pharmacies, and specialty shops.
- **Product Catalog & Search**: Categorized product discovery with real-time stock indicators.
- **Cart & Checkout**: Multi-item cart management with instant coupon redemption (e.g. `QUICK50`) and bill breakdown (delivery fee, taxes, platform fee).
- **Live Order Tracking**: Visual order status tracker (`PLACED` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`) with a secure 4-digit OTP.
- **Authentication & Validation**: Client-side validated login and sign-up with real-time error handling.

---

## 🚀 Running on Your Phone

### Step 1: Install Dependencies
```bash
cd apps/customer-app
npm install
```

### Step 2: Start Expo Metro Bundler
```bash
npx expo start
```

### Step 3: Open in Expo Go
- **Android**: Open the **Expo Go** app and scan the terminal QR code.
- **iOS**: Scan the QR code using your iPhone Camera app.

> **Note on Wi-Fi Connectivity**: Ensure your phone and development PC are connected to the same Wi-Fi network. The app automatically connects to your computer at `http://172.28.141.39:5000/api/v1`.

---

## 📱 Screen Navigation

During development, a collapsible **QuickKart Screen Switcher** is pinned at the top:
- `🏠 Home`: Store discovery and category chips.
- `🏪 Store`: Store product catalog and add-to-cart buttons.
- `🛒 Cart`: Order summary, coupon code field, and checkout.
- `🛵 Live Track`: Interactive order lifecycle with delivery countdown.
- `🔐 Login`: Mobile/Email authentication with validation.
- `📝 Register`: Customer registration with Indian phone & password validation.
- `🔑 Reset Pass`: Password recovery flow.
- `Hide ✕`: Minimizes the preview switcher into a non-intrusive floating button.
