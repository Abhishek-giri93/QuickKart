/**
 * Store Business Service
 */

import prisma from '../../config/prisma.js';
import { calculateDistanceKm } from '../../utils/geo.js';
import { AppError } from '../../utils/AppError.js';
import { HTTP_STATUS, STORE_STATUS } from '../../utils/constants.js';
import { buildPaginationMeta } from '../../utils/response.js';

// ── SELLER STORE OPERATIONS ──────────────────────────────────────────────────

export const createStore = async (sellerUserId, data) => {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: sellerUserId },
  });

  if (!sellerProfile) {
    throw new AppError('Seller profile not found. Please complete seller registration.', HTTP_STATUS.FORBIDDEN);
  }

  return prisma.store.create({
    data: {
      ...data,
      sellerProfileId: sellerProfile.id,
      status: STORE_STATUS.PENDING_VERIFICATION,
      isOpen: false,
    },
  });
};

export const getSellerStores = async (sellerUserId) => {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: sellerUserId },
  });

  if (!sellerProfile) {
    throw new AppError('Seller profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return prisma.store.findMany({
    where: { sellerProfileId: sellerProfile.id },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSellerStoreById = async (sellerUserId, storeId) => {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: sellerUserId },
  });

  if (!sellerProfile) {
    throw new AppError('Seller profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      sellerProfileId: sellerProfile.id,
    },
  });

  if (!store) {
    throw new AppError('Store not found or you do not have permission to access it', HTTP_STATUS.NOT_FOUND);
  }

  return store;
};

export const updateSellerStore = async (sellerUserId, storeId, data) => {
  await getSellerStoreById(sellerUserId, storeId); // Verify ownership

  return prisma.store.update({
    where: { id: storeId },
    data,
  });
};

export const toggleStoreOpen = async (sellerUserId, storeId, isOpen) => {
  const store = await getSellerStoreById(sellerUserId, storeId); // Verify ownership

  if (store.status !== STORE_STATUS.ACTIVE && isOpen) {
    throw new AppError(
      `Cannot open store while status is ${store.status}. Awaiting admin approval.`,
      HTTP_STATUS.FORBIDDEN
    );
  }

  return prisma.store.update({
    where: { id: storeId },
    data: { isOpen },
  });
};

// ── PUBLIC STORE DISCOVERY (CUSTOMERS) ────────────────────────────────────────

export const discoverStores = async (query) => {
  const {
    latitude,
    longitude,
    radiusKm = 10,
    city,
    search,
    page = 1,
    limit = 20,
  } = query;

  const where = {
    status: STORE_STATUS.ACTIVE,
    ...(city && { city: { contains: city, mode: 'insensitive' } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const stores = await prisma.store.findMany({
    where,
    select: {
      id: true,
      name: true,
      description: true,
      coverImageUrl: true,
      logoUrl: true,
      phone: true,
      addressLine: true,
      city: true,
      state: true,
      pincode: true,
      latitude: true,
      longitude: true,
      isOpen: true,
      openingTime: true,
      closingTime: true,
      avgRating: true,
      totalRatings: true,
      createdAt: true,
    },
  });

  let results = stores;

  // Hyperlocal distance calculation & radius filtering
  if (latitude !== undefined && longitude !== undefined) {
    results = stores
      .map((store) => {
        const storeLat = Number(store.latitude);
        const storeLng = Number(store.longitude);
        const distanceKm = calculateDistanceKm(latitude, longitude, storeLat, storeLng);
        return {
          ...store,
          distanceKm,
        };
      })
      .filter((store) => store.distanceKm <= radiusKm)
      .sort((a, b) => {
        // Sort: Open stores first, then by closest distance, then by highest rating
        if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
        if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
        return Number(b.avgRating) - Number(a.avgRating);
      });
  } else {
    // Standard sort: Open stores first, then by highest rating
    results.sort((a, b) => {
      if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
      return Number(b.avgRating) - Number(a.avgRating);
    });
  }

  // Pagination in memory after distance filtering
  const total = results.length;
  const startIndex = (page - 1) * limit;
  const paginatedData = results.slice(startIndex, startIndex + limit);
  const meta = buildPaginationMeta(total, page, limit);

  return {
    stores: paginatedData,
    meta,
  };
};

export const getPublicStoreById = async (storeId) => {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      status: STORE_STATUS.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      description: true,
      coverImageUrl: true,
      logoUrl: true,
      phone: true,
      email: true,
      addressLine: true,
      city: true,
      state: true,
      pincode: true,
      latitude: true,
      longitude: true,
      isOpen: true,
      openingTime: true,
      closingTime: true,
      avgRating: true,
      totalRatings: true,
      products: {
        where: { isActive: true, isAvailable: true },
        select: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        distinct: ['categoryId'],
      },
    },
  });

  if (!store) {
    throw new AppError('Store not found or is currently unavailable', HTTP_STATUS.NOT_FOUND);
  }

  // Extract unique categories available in this store
  const categories = store.products.map((p) => p.category);
  const { products, ...storeData } = store;

  return {
    ...storeData,
    availableCategories: categories,
  };
};

// ── ADMIN STORE OPERATIONS ───────────────────────────────────────────────────

export const updateStoreStatus = async (storeId, status) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw new AppError('Store not found', HTTP_STATUS.NOT_FOUND);
  }

  // If store is rejected or suspended, auto-close it
  const autoClose = status !== STORE_STATUS.ACTIVE;

  return prisma.store.update({
    where: { id: storeId },
    data: {
      status,
      ...(autoClose && { isOpen: false }),
    },
  });
};

export const updateStoreCommission = async (storeId, commissionRate) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw new AppError('Store not found', HTTP_STATUS.NOT_FOUND);
  }

  return prisma.store.update({
    where: { id: storeId },
    data: { commissionRate },
  });
};
