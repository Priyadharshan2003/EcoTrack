import { Category } from "./categories";
import { EMISSION_FACTORS } from "./emissionFactors";
import { normalizeInput } from "./normalization";

export interface CarbonInput {
  category: Category;
  item: string;
  value: number;
  unit: string;
  version?: string; // For versioning system
}

export function calculateCarbon(inputs: CarbonInput[]): Record<Category, number> {
  const result: Record<Category, number> = {
    transport: 0,
    energy: 0,
    food: 0,
    shopping: 0
  };

  inputs.forEach(input => {
    const normalizedValue = normalizeInput(input.category, input.item, input.value, input.unit);
    // Simple versioning stub: could use input.version to fetch different factors
    const factor = EMISSION_FACTORS[input.category]?.[input.item] || 0;
    
    // Category weighting could be applied here if needed
    result[input.category] += normalizedValue * factor;
  });

  return result;
}

export function calculateTotal(breakdown: Record<Category, number>): number {
  return Object.values(breakdown).reduce((acc, val) => acc + val, 0);
}

export function calculateBreakdown(inputs: CarbonInput[]): [string, number][] {
  const result = calculateCarbon(inputs);
  return Object.entries(result).sort((a, b) => b[1] - a[1]);
}
