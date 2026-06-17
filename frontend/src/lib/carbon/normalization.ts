import { Category } from "./categories";

// Normalizes input data into standard units for calculation
export function normalizeInput(_category: Category, _item: string, value: number, unit: string): number {
  if (unit === 'miles') {
    return value * 1.60934; // Convert miles to km
  }
  if (unit === 'lbs') {
    return value * 0.453592; // Convert lbs to kg
  }
  return value; // Assume already in base unit
}
