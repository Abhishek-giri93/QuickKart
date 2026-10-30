import { describe, it, expect } from 'vitest';
import { calculateDistanceKm } from '../src/utils/geo.js';

describe('Geo Distance Utility (Haversine Formula)', () => {
  it('should return 0 km for identical coordinates', () => {
    const lat = 28.6139;
    const lng = 77.2090;
    expect(calculateDistanceKm(lat, lng, lat, lng)).toBe(0);
  });

  it('should accurately calculate distance between Delhi and Noida (~20-25 km)', () => {
    const connaughtPlace = { lat: 28.6315, lng: 77.2167 };
    const noidaSector18 = { lat: 28.5708, lng: 77.3260 };

    const distance = calculateDistanceKm(
      connaughtPlace.lat,
      connaughtPlace.lng,
      noidaSector18.lat,
      noidaSector18.lng
    );

    expect(distance).toBeGreaterThan(10);
    expect(distance).toBeLessThan(20);
  });
});
