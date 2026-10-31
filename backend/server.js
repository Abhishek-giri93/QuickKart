/**
 * QuickKart Backend — Server Entry Point
 *
 * This file:
 *   1. Loads environment variables (.env)
 *   2. Validates required env vars
 *   3. Tests the database connection
 *   4. Starts the HTTP server
 *   5. Handles graceful shutdown on SIGTERM/SIGINT
 *
 * Start the server:
 *   Development: npm run dev
 *   Production:  npm start
 */

import 'dotenv/config';
import http from 'http';
import { validateEnv } from './src/config/env.config.js';
import { config } from './src/config/env.config.js';
import prisma from './src/config/prisma.js';
import app from './src/app.js';
import { initSocketServer } from './src/socket/socket.js';

// ── Step 1: Validate environment variables ────────────────────────────────────
try {
  validateEnv();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const PORT = config.server.port;
let server;

// ── Step 2: Connect to database and start server ──────────────────────────────
async function startServer() {
  try {
    // Test the database connection before accepting traffic
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Create HTTP & Socket.IO server
    const httpServer = http.createServer(app);
    initSocketServer(httpServer);

    server = httpServer.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════╗');
      console.log('║        🛒  QuickKart API Server          ║');
      console.log('╠══════════════════════════════════════════╣');
      console.log(`║  Status   : Running                      ║`);
      console.log(`║  Port     : ${PORT}                           ║`);
      console.log(`║  Env      : ${config.server.nodeEnv.padEnd(28)}  ║`);
      console.log(`║  URL      : http://localhost:${PORT}/api/v1  ║`);
      console.log(`║  Health   : /api/v1/health               ║`);
      console.log('╚══════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// ── Step 3: Graceful Shutdown ─────────────────────────────────────────────────
// When the process receives a termination signal, cleanly close the
// database connection and HTTP server before exiting.
// This prevents data corruption and connection leaks.

async function gracefulShutdown(signal) {
  console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);

  try {
    // Stop accepting new connections
    if (server) {
      server.close(() => {
        console.log('✅ HTTP server closed');
      });
    }

    // Close database connection
    await prisma.$disconnect();
    console.log('✅ Database disconnected');

    console.log('👋 QuickKart server shut down cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err.message);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ── Step 4: Handle unhandled promise rejections ───────────────────────────────
// Safety net — log the error and shut down instead of running in a broken state
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  gracefulShutdown('uncaughtException');
});

// ── Boot ──────────────────────────────────────────────────────────────────────
startServer();

