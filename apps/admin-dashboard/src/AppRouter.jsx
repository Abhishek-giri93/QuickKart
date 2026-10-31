// Admin Dashboard — App Router (React Router v6)

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layout
import AdminLayout from './components/common/AdminLayout';

// Auth
import LoginPage from './pages/LoginPage';

// Dashboard
import DashboardPage from './pages/DashboardPage';

// Management Pages
import CustomersPage from './pages/CustomersPage';
import SellersPage from './pages/SellersPage';
import SellerDetailPage from './pages/SellerDetailPage';
import DeliveryPartnersPage from './pages/DeliveryPartnersPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PaymentsPage from './pages/PaymentsPage';
import RefundsPage from './pages/RefundsPage';
import CommissionsPage from './pages/CommissionsPage';
import CouponsPage from './pages/CouponsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected — wrapped in AdminLayout (sidebar + header) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="sellers" element={<SellersPage />} />
          <Route path="sellers/:id" element={<SellerDetailPage />} />
          <Route path="delivery-partners" element={<DeliveryPartnersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="refunds" element={<RefundsPage />} />
          <Route path="commissions" element={<CommissionsPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

