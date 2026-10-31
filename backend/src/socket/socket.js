/**
 * QuickKart — Socket.IO Realtime Server
 *
 * Provides real-time websocket connections for:
 * - Live order status updates (order:status_update)
 * - Real-time delivery partner GPS tracking (delivery:location)
 * - User notification dispatch (notification:received)
 */

import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';
import { config } from '../config/env.config.js';

let io = null;

/**
 * Initialize Socket.IO with the HTTP server instance
 */
export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.cors.allowedOrigins,
      credentials: true,
    },
  });

  // Authentication middleware for websocket connections
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    if (userId) {
      // Auto-join personal user room for direct notifications
      socket.join(`user_${userId}`);
    }

    // Join room for real-time tracking of a specific order
    socket.on('join_order', (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
      }
    });

    // Leave order tracking room
    socket.on('leave_order', (orderId) => {
      if (orderId) {
        socket.leave(`order_${orderId}`);
      }
    });

    // Delivery Partner transmits live GPS updates
    socket.on('delivery:location_update', ({ orderId, latitude, longitude }) => {
      if (orderId && latitude != null && longitude != null) {
        io.to(`order_${orderId}`).emit('delivery:location', {
          orderId,
          deliveryPartnerId: socket.user?.id,
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on('disconnect', () => {
      // Handled cleanly
    });
  });

  return io;
};

/**
 * Get the active Socket.IO server instance
 */
export const getIO = () => io;

/**
 * Send real-time event to a specific user
 */
export const emitToUser = (userId, event, data) => {
  if (io && userId) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

/**
 * Send real-time event to everyone tracking a specific order
 */
export const emitToOrder = (orderId, event, data) => {
  if (io && orderId) {
    io.to(`order_${orderId}`).emit(event, data);
  }
};
