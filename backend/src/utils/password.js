/**
 * Password Utility Functions
 *
 * Provides safe hashing and verification of user passwords using bcryptjs.
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password.
 * @param {string} password - Raw password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plaintext password against a stored hash.
 * @param {string} plainPassword - Raw password submitted by user
 * @param {string} hashedPassword - Stored hash from database
 * @returns {Promise<boolean>} True if match, false otherwise
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
