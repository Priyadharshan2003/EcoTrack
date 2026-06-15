import { describe, it, expect } from 'vitest';
import { useCarbonCalculation } from '../src/hooks/useCarbonCalculation';

describe('Scientific Carbon Engine', () => {
  const { calculateTransportEmissions, calculateDietEmissions } = useCarbonCalculation();

  it('should correctly calculate car_petrol emissions', () => {
    // 10 km * 0.192 = 1.92
    expect(calculateTransportEmissions('car_petrol', 10)).toBe(1.92);
  });

  it('should correctly calculate metro emissions', () => {
    // 15 km * 0.041 = 0.615 -> rounded/fixed to 0.61
    expect(calculateTransportEmissions('metro', 15)).toBe(0.61);
  });

  it('should return 0 for invalid transport types instead of throwing', () => {
    // @ts-expect-error - testing invalid input
    expect(calculateTransportEmissions('spaceship', 100)).toBe(0);
  });

  it('should return correct baseline for vegan diet', () => {
    expect(calculateDietEmissions('vegan')).toBe(1.5);
  });

  it('should return 0 for invalid diet types instead of throwing', () => {
    // @ts-expect-error - testing invalid input
    expect(calculateDietEmissions('rocks')).toBe(0);
  });
});
