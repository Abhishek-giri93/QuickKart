/**
 * Health Check Route — Integration Test
 *
 * Tests that the Express app starts and the /api/v1/health endpoint
 * responds correctly. This is the first and most basic test —
 * if this passes, the server foundation is working.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/v1/health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.version).toBe('v1');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/this-route-does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

