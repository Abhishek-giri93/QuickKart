/**
 * Product & Inventory Business Service
 */

import prisma from '../../config/prisma.js';
import { slugify } from '../../utils/slugify.js';
import { AppError } from '../../utils/AppError.js';
import { HTTP_STATUS, USER_ROLES } from '../../utils/constants.js';
import { buildPaginationMeta } from '../../utils/response.js';

/**
 * Verify that the store belongs to the authenticated seller (or user is Admin)
 */
export const verifyStoreOwnership = async (storeId, userId, userRole) => {
  if (userRole === USER_ROLES.ADMIN) return;

  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      sellerProfile: { userId },
    },
  });

  if (!store) {
    throw new AppError('Store not found or you do not have permission to manage products in this store', HTTP_STATUS.FORBIDDEN);
  }

  return store;
};

/**
 * Verify that a product belongs to a store owned by the seller
 */
export const verifyProductOwnership = async (productId, userId, userRole) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      store: {
        include: { sellerProfile: true },
      },
      inventory: true,
    },
  });

  if (!product) {
    throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND);
  }

  if (userRole !== USER_ROLES.ADMIN && product.store.sellerProfile.userId !== userId) {
    throw new AppError('You do not have permission to manage this product', HTTP_STATUS.FORBIDDEN);
  }

  return product;
};

// ── PRODUCT CRUD (SELLER) ────────────────────────────────────────────────────

export const createProduct = async (userId, userRole, data) => {
  const {
    storeId,
    categoryId,
    name,
    description,
    price,
    discountedPrice,
    unit,
    isAvailable = true,
    initialStock = 0,
    lowStockAlert = 10,
    images = [],
  } = data;

  await verifyStoreOwnership(storeId, userId, userRole);

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.BAD_REQUEST);
  }

  const slug = data.slug ? slugify(data.slug) : slugify(name);

  // Check unique slug within the store
  const existing = await prisma.product.findUnique({
    where: { storeId_slug: { storeId, slug } },
  });

  if (existing) {
    throw new AppError('A product with this name/slug already exists in your store', HTTP_STATUS.CONFLICT);
  }

  // Atomic creation of Product + Inventory + Images
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        storeId,
        categoryId,
        name,
        slug,
        description,
        price,
        discountedPrice,
        unit,
        isAvailable: initialStock > 0 ? isAvailable : false,
        inventory: {
          create: {
            quantity: initialStock,
            lowStockAlert,
          },
        },
        ...(images.length > 0 && {
          images: {
            createMany: {
              data: images.map((img, idx) => ({
                imageUrl: img.imageUrl,
                publicId: img.publicId,
                isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
                sortOrder: img.sortOrder || idx,
              })),
            },
          },
        }),
      },
      include: {
        inventory: true,
        images: true,
        category: true,
      },
    });

    return product;
  });
};

export const updateProduct = async (userId, userRole, productId, data) => {
  const product = await verifyProductOwnership(productId, userId, userRole);

  let slug = undefined;
  if (data.name && !data.slug) {
    slug = slugify(data.name);
  } else if (data.slug) {
    slug = slugify(data.slug);
  }

  if (slug && slug !== product.slug) {
    const existing = await prisma.product.findUnique({
      where: { storeId_slug: { storeId: product.storeId, slug } },
    });
    if (existing && existing.id !== productId) {
      throw new AppError('A product with this slug already exists in this store', HTTP_STATUS.CONFLICT);
    }
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      throw new AppError('Category not found', HTTP_STATUS.BAD_REQUEST);
    }
  }

  return prisma.product.update({
    where: { id: productId },
    data: {
      ...data,
      ...(slug && { slug }),
    },
    include: {
      inventory: true,
      images: true,
      category: true,
    },
  });
};

export const deleteProduct = async (userId, userRole, productId) => {
  await verifyProductOwnership(productId, userId, userRole);

  const orderCount = await prisma.orderItem.count({
    where: { productId },
  });

  if (orderCount > 0) {
    // Soft delete to protect historical order records
    return prisma.product.update({
      where: { id: productId },
      data: { isActive: false, isAvailable: false },
    });
  }

  return prisma.product.delete({ where: { id: productId } });
};

// ── PRODUCT IMAGES ───────────────────────────────────────────────────────────

export const addImage = async (userId, userRole, productId, imageData) => {
  await verifyProductOwnership(productId, userId, userRole);

  return prisma.$transaction(async (tx) => {
    if (imageData.isPrimary) {
      // Clear previous primary image
      await tx.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return tx.productImage.create({
      data: {
        productId,
        ...imageData,
      },
    });
  });
};

export const removeImage = async (userId, userRole, productId, imageId) => {
  await verifyProductOwnership(productId, userId, userRole);

  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId },
  });

  if (!image) {
    throw new AppError('Product image not found', HTTP_STATUS.NOT_FOUND);
  }

  return prisma.productImage.delete({ where: { id: imageId } });
};

// ── INVENTORY MANAGEMENT ─────────────────────────────────────────────────────

export const updateInventory = async (userId, userRole, productId, data) => {
  const product = await verifyProductOwnership(productId, userId, userRole);
  const currentStock = product.inventory ? product.inventory.quantity : 0;

  let newQuantity = currentStock;

  if (data.quantity !== undefined) {
    newQuantity = data.quantity;
  } else if (data.adjustment !== undefined) {
    newQuantity = currentStock + data.adjustment;
  }

  // Strict business rule: Inventory must NEVER be negative
  if (newQuantity < 0) {
    throw new AppError(
      `Insufficient stock. Inventory cannot become negative (current: ${currentStock}, requested change: ${data.adjustment || data.quantity})`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Auto-sync availability with stock quantity
  const isAvailable = newQuantity > 0 ? product.isAvailable : false;

  return prisma.$transaction(async (tx) => {
    const updatedInventory = await tx.inventory.upsert({
      where: { productId },
      create: {
        productId,
        quantity: newQuantity,
        lowStockAlert: data.lowStockAlert !== undefined ? data.lowStockAlert : 10,
      },
      update: {
        quantity: newQuantity,
        ...(data.lowStockAlert !== undefined && { lowStockAlert: data.lowStockAlert }),
      },
    });

    if (product.isAvailable !== isAvailable) {
      await tx.product.update({
        where: { id: productId },
        data: { isAvailable },
      });
    }

    return updatedInventory;
  });
};

export const getLowStockProducts = async (userId, userRole, storeId) => {
  if (storeId) {
    await verifyStoreOwnership(storeId, userId, userRole);
  }

  const whereClause = {
    isActive: true,
    ...(storeId
      ? { storeId }
      : userRole !== USER_ROLES.ADMIN
      ? { store: { sellerProfile: { userId } } }
      : {}),
  };

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      inventory: true,
      store: {
        select: { id: true, name: true },
      },
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });

  // Filter products where quantity <= lowStockAlert
  return products.filter((p) => p.inventory && p.inventory.quantity <= p.inventory.lowStockAlert);
};

// ── PUBLIC PRODUCT SEARCH & DISCOVERY (CUSTOMERS) ─────────────────────────────

export const listProducts = async (query) => {
  const {
    storeId,
    categoryId,
    search,
    minPrice,
    maxPrice,
    isAvailable,
    page = 1,
    limit = 20,
  } = query;

  const where = {
    isActive: true,
    ...(storeId && { storeId }),
    ...(categoryId && { categoryId }),
    ...(isAvailable !== undefined && { isAvailable }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }
      : {}),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const skip = (page - 1) * limit;

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        store: {
          select: { id: true, name: true, isOpen: true, city: true },
        },
        inventory: {
          select: { quantity: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    products,
    meta: buildPaginationMeta(total, page, limit),
  };
};

export const getProductByIdOrSlug = async (identifier) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

  const product = await prisma.product.findFirst({
    where: {
      ...(isUuid ? { id: identifier } : { slug: identifier }),
      isActive: true,
    },
    include: {
      images: {
        orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
      },
      category: true,
      store: {
        select: {
          id: true,
          name: true,
          isOpen: true,
          openingTime: true,
          closingTime: true,
          addressLine: true,
          city: true,
        },
      },
      inventory: {
        select: {
          quantity: true,
        },
      },
    },
  });

  if (!product) {
    throw new AppError('Product not found or unavailable', HTTP_STATUS.NOT_FOUND);
  }

  return product;
};
