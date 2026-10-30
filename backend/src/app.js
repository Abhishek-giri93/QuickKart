/**
 * Express Application Setup — app.js
 *
 * This file creates and configures the Express app.
 * It is SEPARATE from server.js so the app can be imported in tests
 * without starting a live HTTP server.
 *
 * Middleware stack order (matters!):
 *   1. Security headers (Helmet)
 *   2. CORS
 *   3. Rate limiting
 *   4. Body parsing
 *   5. Cookie parsing
 *   6. Request logging
 *   7. Routes
 *   8. 404 handler
 *   9. Centralized error handler
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config } from './config/env.config.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// ── 1. Security Headers ───────────────────────────────────────────────────────
// Helmet sets various HTTP headers to protect against common web vulnerabilities
// (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet());

// ── 2. CORS ───────────────────────────────────────────────────────────────────
// Allow requests only from whitelisted origins (configured in .env).
// Credentials (cookies) are allowed so Refresh Tokens work correctly.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin header) and whitelisted origins
      if (!origin || config.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
      }
    },
    credentials: true,
  })
);

// ── 3. Global Rate Limiter ────────────────────────────────────────────────────
app.use(globalLimiter);

// ── 4. Body Parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));           // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse form data

// ── 5. Cookie Parser ─────────────────────────────────────────────────────────
// Required for reading HttpOnly Refresh Token cookies
app.use(cookieParser());

// ── 6. Request Logging ────────────────────────────────────────────────────────
app.use(requestLogger);

// ── 7. API Routes ─────────────────────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ── 8. 404 Handler ───────────────────────────────────────────────────────────
// Catches any request that didn't match a defined route
app.use(notFoundHandler);

// ── 9. Centralized Error Handler ─────────────────────────────────────────────
// Must be LAST — catches all errors forwarded via next(err)
app.use(errorHandler);

export default app;

