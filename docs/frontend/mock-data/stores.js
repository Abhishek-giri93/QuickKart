// Mock Data — Stores
// Shape mirrors expected real API response

export const mockStores = [
  {
    id: 'store_001',
    name: 'Fresh Basket Supermart',
    category: 'grocery',
    rating: 4.5,
    reviewCount: 238,
    distance: 0.8,       // km
    deliveryTime: 20,    // minutes
    deliveryFee: 20,
    minOrder: 99,
    isOpen: true,
    imageUrl: null,      // placeholder
    tags: ['Groceries', 'Vegetables', 'Dairy'],
    address: '12, MG Road, Near City Mall',
  },
  {
    id: 'store_002',
    name: 'Spice Garden Restaurant',
    category: 'restaurant',
    rating: 4.2,
    reviewCount: 512,
    distance: 1.2,
    deliveryTime: 30,
    deliveryFee: 30,
    minOrder: 149,
    isOpen: true,
    imageUrl: null,
    tags: ['North Indian', 'Biryani', 'Thali'],
    address: '45, Station Road',
  },
  {
    id: 'store_003',
    name: 'Quick Bites Fast Food',
    category: 'fastfood',
    rating: 3.9,
    reviewCount: 189,
    distance: 0.5,
    deliveryTime: 15,
    deliveryFee: 15,
    minOrder: 79,
    isOpen: false,
    imageUrl: null,
    tags: ['Burgers', 'Sandwiches', 'Momos'],
    address: '8, College Square',
  },
];

export const mockCategories = [
  { id: 'cat_001', name: 'Groceries', icon: '🛒', color: '#4CAF50' },
  { id: 'cat_002', name: 'Vegetables', icon: '🥦', color: '#8BC34A' },
  { id: 'cat_003', name: 'Dairy', icon: '🥛', color: '#03A9F4' },
  { id: 'cat_004', name: 'Restaurant', icon: '🍽️', color: '#FF5722' },
  { id: 'cat_005', name: 'Fast Food', icon: '🍔', color: '#FF9800' },
  { id: 'cat_006', name: 'Household', icon: '🏠', color: '#9C27B0' },
  { id: 'cat_007', name: 'Personal Care', icon: '🧴', color: '#E91E63' },
  { id: 'cat_008', name: 'Stationery', icon: '📚', color: '#607D8B' },
];

