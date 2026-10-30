import { describe, it, expect } from 'vitest';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
} from '../src/utils/jwt.js';

describe('JWT Utilities', () => {
  const userPayload = {
    id: 'user-uuid-1234',
    email: 'test@quickkart.com',
    role: 'CUSTOMER',
  };

  it('should generate and verify an access token', () => {
    const token = generateAccessToken(userPayload);
    expect(token).toBeTypeOf('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe(userPayload.id);
    expect(decoded.email).toBe(userPayload.email);
    expect(decoded.role).toBe(userPayload.role);
  });

  it('should generate and verify a refresh token', () => {
    const token = generateRefreshToken({ id: userPayload.id });
    expect(token).toBeTypeOf('string');

    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe(userPayload.id);
  });

  it('should generate deterministic sha256 hashes of tokens', () => {
    const token = 'sample-refresh-token';
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex length
  });
});
