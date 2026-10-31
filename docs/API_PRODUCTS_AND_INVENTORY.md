# QuickKart — Products & Inventory API Documentation

---

## 1. Product Discovery API (`/api/v1/products`)

### GET `/api/v1/products`
Search and filter products across stores and categories.
- **Access:** Public
- **Query Parameters:**
  - `storeId` (UUID, optional): Filter by store
  - `categoryId` (UUID, optional): Filter by category
  - `search` (string, optional): Search keyword in product name or description
  - `minPrice` / `maxPrice` (number, optional)
  - `isAvailable` (boolean, optional, default: `true`)
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`, max: `100`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Aashirvaad Superior MP Sharbati Atta",
      "slug": "aashirvaad-superior-mp-sharbati-atta",
      "description": "100% whole wheat atta",
      "price": "260.00",
      "discountedPrice": "245.00",
      "unit": "5 kg",
      "isAvailable": true,
      "images": [
        {
          "id": "uuid",
          "imageUrl": "https://res.cloudinary.com/...",
          "isPrimary": true
        }
      ],
      "category": {
        "id": "uuid",
        "name": "Groceries",
        "slug": "groceries"
      },
      "store": {
        "id": "uuid",
        "name": "Verma Daily Mart",
        "isOpen": true,
        "city": "Bengaluru"
      },
      "inventory": {
        "quantity": 25
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### GET `/api/v1/products/:id`
Get full product details by UUID or store-scoped slug.
- **Access:** Public

---

## 2. Seller Product Management (`/api/v1/products`)

### POST `/api/v1/products`
Create a new product with initial stock and optional images.
- **Access:** Seller / Admin (`Bearer <token>`)
- **Business Rule:** Store must belong to the logged-in seller.
- **Request Body:**
```json
{
  "storeId": "store-uuid",
  "categoryId": "category-uuid",
  "name": "Amul Taaza Homogenised Toned Milk",
  "description": "Long life toned milk, 1L tetra pack",
  "price": 72.00,
  "discountedPrice": 68.00,
  "unit": "1 litre",
  "isAvailable": true,
  "initialStock": 50,
  "lowStockAlert": 10,
  "images": [
    {
      "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      "isPrimary": true
    }
  ]
}
```

### PATCH `/api/v1/products/:id`
Update product information, pricing, or visibility.
- **Access:** Seller / Admin (ownership verified)
- **Validation:** If `discountedPrice` is updated, it cannot exceed `price`.

### DELETE `/api/v1/products/:id`
Delete product. If the product was previously part of customer orders, it is automatically soft-deleted (`isActive: false`) to safeguard historical transaction records.
- **Access:** Seller / Admin (ownership verified)

---

## 3. Product Images API (`/api/v1/products/:id/images`)

### POST `/api/v1/products/:id/images`
Add image to a product gallery.
- **Access:** Seller / Admin
- **Request Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/...",
  "publicId": "quickkart/products/amul-taaza-1",
  "isPrimary": false,
  "sortOrder": 1
}
```

### DELETE `/api/v1/products/:id/images/:imageId`
Delete product image from gallery.
- **Access:** Seller / Admin

---

## 4. Inventory Management API

### PATCH `/api/v1/products/:id/inventory`
Update inventory stock for a product.
- **Access:** Seller / Admin
- **Strict Business Rule:** **Inventory cannot become negative.**
- **Request Body (options):**
  - Set absolute stock:
    ```json
    { "quantity": 100 }
    ```
  - Adjust stock by delta (+/-):
    ```json
    { "adjustment": -5 }
    ```
  - Update low stock warning threshold:
    ```json
    { "lowStockAlert": 15 }
    ```

### GET `/api/v1/inventory/low-stock`
Retrieve all products where stock has fallen below or equal to `lowStockAlert`.
- **Access:** Seller / Admin
- **Query Params:**
  - `storeId` (optional UUID)
