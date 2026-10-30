/**
 * Request Logger Middleware
 *
 * Logs incoming requests in a readable format during development.
 * Uses morgan in development, a minimal custom logger in production.
 *
 * Format: METHOD /path STATUS RESPONSE_TIME
 */

import morgan from 'morgan';
import { config } from '../config/env.config.js';

// Development: detailed colorized output
const devLogger = morgan('dev');

// Production: minimal log (method, url, status, response-time)
const prodLogger = morgan('[:date[clf]] :method :url :status :response-time ms');

export const requestLogger = config.server.isDev ? devLogger : prodLogger;

