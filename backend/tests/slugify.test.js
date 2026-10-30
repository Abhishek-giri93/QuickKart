import { describe, it, expect } from 'vitest';
import { slugify } from '../src/utils/slugify.js';

describe('Slugify Utility', () => {
  it('should convert standard names to url slugs', () => {
    expect(slugify('Fruits & Vegetables')).toBe('fruits-and-vegetables');
    expect(slugify('Fresh Dairy Products! 100%')).toBe('fresh-dairy-products-100');
    expect(slugify('   Electronics & Gadgets   ')).toBe('electronics-and-gadgets');
  });
});
