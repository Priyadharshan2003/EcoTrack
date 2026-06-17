import { expect, test, describe } from 'vitest';
import { calculateCarbon, calculateTotal } from './calculator';

describe('Carbon Calculator', () => {
  test('calculates correct transport emissions', () => {
    const data = [
      { category: 'transport' as const, item: 'car_km', value: 100, unit: 'km' }
    ];
    const breakdown = calculateCarbon(data);
    expect(breakdown.transport).toBe(19.2); // 100 * 0.192
  });

  test('calculates total correctly', () => {
    const data = [
      { category: 'transport' as const, item: 'car_km', value: 100, unit: 'km' },
      { category: 'energy' as const, item: 'electricity_kwh', value: 50, unit: 'kWh' }
    ];
    const breakdown = calculateCarbon(data);
    const total = calculateTotal(breakdown);
    // transport: 100 * 0.192 = 19.2
    // energy: 50 * 0.233 = 11.65
    // total: 30.85
    expect(total).toBeCloseTo(30.85);
  });
});
