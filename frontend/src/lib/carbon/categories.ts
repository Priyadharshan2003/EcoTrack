export const CATEGORIES = {
  TRANSPORT: "transport",
  ENERGY: "energy",
  FOOD: "food",
  SHOPPING: "shopping"
} as const;

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];
