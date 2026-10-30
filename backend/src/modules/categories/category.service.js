/**
 * Category Business Service
 */

import prisma from '../../config/prisma.js';
import { slugify } from '../../utils/slugify.js';
import { AppError } from '../../utils/AppError.js';
import { HTTP_STATUS } from '../../utils/constants.js';

export const getAllCategories = async ({ includeInactive = false } = {}) => {
  return prisma.category.findMany({
    where: {
      parentId: null, // Root categories
      ...(includeInactive ? {} : { isActive: true }),
    },
    include: {
      children: {
        where: includeInactive ? {} : { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
};

export const getCategoryByIdOrSlug = async (identifier) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

  const category = await prisma.category.findFirst({
    where: isUuid ? { id: identifier } : { slug: identifier },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
      parent: true,
    },
  });

  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  return category;
};

export const createCategory = async (data) => {
  const slug = data.slug ? slugify(data.slug) : slugify(data.name);

  const existing = await prisma.category.findFirst({
    where: { OR: [{ slug }, { name: data.name }] },
  });

  if (existing) {
    throw new AppError('A category with this name or slug already exists', HTTP_STATUS.CONFLICT);
  }

  if (data.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
    if (!parent) {
      throw new AppError('Parent category not found', HTTP_STATUS.BAD_REQUEST);
    }
  }

  return prisma.category.create({
    data: {
      ...data,
      slug,
    },
    include: {
      parent: true,
    },
  });
};

export const updateCategory = async (id, data) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  let slug = undefined;
  if (data.name && !data.slug) {
    slug = slugify(data.name);
  } else if (data.slug) {
    slug = slugify(data.slug);
  }

  if (slug && slug !== category.slug) {
    const slugExists = await prisma.category.findFirst({
      where: { slug, id: { not: id } },
    });
    if (slugExists) {
      throw new AppError('A category with this slug already exists', HTTP_STATUS.CONFLICT);
    }
  }

  if (data.parentId) {
    if (data.parentId === id) {
      throw new AppError('Category cannot be its own parent', HTTP_STATUS.BAD_REQUEST);
    }
    const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
    if (!parent) {
      throw new AppError('Parent category not found', HTTP_STATUS.BAD_REQUEST);
    }
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...data,
      ...(slug && { slug }),
    },
  });
};

export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
      products: { take: 1 },
    },
  });

  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  if (category.children.length > 0) {
    throw new AppError('Cannot delete category with active subcategories. Please reassign or delete subcategories first.', HTTP_STATUS.BAD_REQUEST);
  }

  if (category.products.length > 0) {
    // Soft-delete to preserve foreign key references
    return prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  return prisma.category.delete({ where: { id } });
};
