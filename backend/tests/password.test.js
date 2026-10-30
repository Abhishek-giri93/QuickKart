import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../src/utils/password.js';

describe('Password Utility', () => {
  it('should hash a password and verify correctly', async () => {
    const raw = 'SecureP@ss123';
    const hashed = await hashPassword(raw);

    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(raw);

    const isMatch = await comparePassword(raw, hashed);
    expect(isMatch).toBe(true);

    const isMismatch = await comparePassword('WrongPassword', hashed);
    expect(isMismatch).toBe(false);
  });
});
