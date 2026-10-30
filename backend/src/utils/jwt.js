/**
 * JWT Utility Functions
 *
 * Handles creation, verification, and hashing of Access & Refresh tokens.
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env.config.js';

/**
 * Generates a short-lived Access Token.
 * @param {object} payload - { id, email, role }
 * @returns {string} Signed JWT Access Token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

/**
 * Generates a long-lived Refresh Token.
 * @param {object} payload - { id }
 * @returns {string} Signed JWT Refresh Token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Verifies an Access Token.
 * @param {string} token - Bearer JWT
 * @returns {object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret);
};

/**
 * Verifies a Refresh Token.
 * @param {string} token - Refresh JWT
 * @returns {object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

/**
 * Computes a SHA-256 hash of a token for safe database persistence.
 * @param {string} token
 * @returns {string} Hex-encoded SHA-256 hash
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
