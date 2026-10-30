// Mock Data — Orders

export const mockOrders = [
  {
    id: 'order_001',
    customerId: 'user_001',
    storeId: 'store_001',
    storeName: 'Fresh Basket Supermart',
    status: 'delivered',  // pending | confirmed | preparing | picked_up | on_the_way | delivered | cancelled
    items: [
      { productId: 'prod_001', name: 'Amul Full Cream Milk', qty: 2, price: 66, total: 132 },
      { productId: 'prod_002', name: 'Fresh Tomatoes', qty: 1, price: 30, total: 30 },
    ],
    subtotal: 162,
    deliveryFee: 20,
    discount: 0,
    total: 182,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    deliveryAddress: {
      label: 'Home',
      line1: '23, Rajiv Nagar',
      line2: 'Near Park',
      city: 'Bhopal',
      pincode: '462001',
    },
    placedAt: '2026-10-29T10:30:00Z',
    deliveredAt: '2026-10-29T11:05:00Z',
    deliveryPartnerId: 'dp_001',
    deliveryPartnerName: 'Raju Kumar',
  },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  PICKED_UP: 'picked_up',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: 'Order Placed',
  confirmed: 'Order Confirmed',
  preparing: 'Being Prepared',
  picked_up: 'Picked Up',
  on_the_way: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

