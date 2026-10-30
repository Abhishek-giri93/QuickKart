// Mock Data — Products
// Shape mirrors expected real API response

export const mockProducts = [
  {
    id: 'prod_001',
    storeId: 'store_001',
    name: 'Amul Full Cream Milk',
    category: 'Dairy',
    price: 66,
    originalPrice: 72,
    discount: 8,           // percent
    unit: '1 Litre',
    stock: 50,
    isAvailable: true,
    rating: 4.6,
    reviewCount: 120,
    imageUrl: null,
    description: 'Fresh full cream milk from Amul. Rich in calcium and protein.',
    tags: ['dairy', 'milk', 'amul'],
  },
  {
    id: 'prod_002',
    storeId: 'store_001',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 30,
    originalPrice: 30,
    discount: 0,
    unit: '500g',
    stock: 30,
    isAvailable: true,
    rating: 4.2,
    reviewCount: 85,
    imageUrl: null,
    description: 'Farm-fresh tomatoes, hand-picked daily.',
    tags: ['vegetable', 'fresh', 'tomato'],
  },
  {
    id: 'prod_003',
    storeId: 'store_001',
    name: 'Tata Salt',
    category: 'Groceries',
    price: 20,
    originalPrice: 22,
    discount: 9,
    unit: '1 Kg',
    stock: 100,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 200,
    imageUrl: null,
    description: 'Iodized salt for daily cooking needs.',
    tags: ['grocery', 'salt', 'tata'],
  },
];

export const mockProductsByStore = (storeId) =>
  mockProducts.filter((p) => p.storeId === storeId);

