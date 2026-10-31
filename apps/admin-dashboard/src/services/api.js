/**
 * QuickKart Admin Dashboard — Live Backend API Client
 */

const BASE_URL = 'http://localhost:5000/api/v1';

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem('quickkart_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const adminApi = {
  // Platform Overview KPIs
  getOverview: () => request('/admin/analytics/overview'),

  // Store Management
  listStores: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/stores${query ? `?${query}` : ''}`);
  },

  updateStoreStatus: (id, status) =>
    request(`/admin/stores/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Delivery Partners
  listPartners: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/delivery-partners${query ? `?${query}` : ''}`);
  },

  verifyPartner: (id, isKycVerified) =>
    request(`/admin/delivery-partners/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ isKycVerified }),
    }),

  // Coupons
  listCoupons: () => request('/admin/coupons'),

  createCoupon: (couponData) =>
    request('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    }),
};

export default adminApi;

