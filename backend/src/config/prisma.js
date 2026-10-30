/**
 * Prisma Client — Database Connection
 *
 * Creates a single shared PrismaClient instance for the entire application.
 * Uses a singleton pattern to prevent multiple connections during hot-reloads
 * in development (a common issue with ES Modules + nodemon).
 *
 * Usage:
 *   import prisma from '../config/prisma.js';
 *   const users = await prisma.user.findMany();
 */

import { PrismaClient } from '@prisma/client';
import { config } from './env.config.js';

// In development, store the client on globalThis to survive hot-reloads.
// In production, always create a fresh client.
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      config.server.isDev
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  });

if (config.server.isDev) {
  globalForPrisma.prisma = prisma;
}

export default prisma;

