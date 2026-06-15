import { describe, it, expect } from 'vitest';
import { calculateTransportEmissions, calculateDietEmissions } from '../src/lib/emissionFactors';

describe('Scientific Carbon Engine', () => {
  it('should correctly calculate car_petrol emissions', () => {
    // 10 km * 0.192 = 1.92
    expect(calculateTransportEmissions('car_petrol', 10)).toBe(1.92);
  });

  it('should correctly calculate metro emissions', () => {
    // 15 km * 0.041 = 0.615 -> rounded/fixed to 0.61
    expect(calculateTransportEmissions('metro', 15)).toBe(0.61);
  });

  it('should throw an error for invalid transport types', () => {
    // @ts-expect-error - testing invalid input
    expect(() => calculateTransportEmissions('spaceship', 100)).toThrow();
  });

  it('should return correct baseline for vegan diet', () => {
    expect(calculateDietEmissions('vegan')).toBe(1.5);
  });

  it('should throw an error for invalid diet types', () => {
    // @ts-expect-error - testing invalid input
    expect(() => calculateDietEmissions('rocks')).toThrow();
  });
});
