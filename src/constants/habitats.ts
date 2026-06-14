export interface HabitatConfig {
  id: string;
  name: string;
  animal: string;
  conversion: number; // m² per credit
  icon: string;
  region: string[]; // array of regions where this habitat applies (e.g. ['global', 'asia', 'india'])
}

export const HABITATS: Record<string, HabitatConfig> = {
  arctic: {
    id: 'arctic',
    name: "Arctic Ice",
    animal: "Polar Bear",
    conversion: 0.002,
    icon: "🐻❄️",
    region: ['global', 'north_america', 'europe']
  },
  amazon: {
    id: 'amazon',
    name: "Amazon Rainforest",
    animal: "Jaguar",
    conversion: 0.003,
    icon: "🌳",
    region: ['global', 'south_america']
  },
  coral: {
    id: 'coral',
    name: "Coral Reefs",
    animal: "Tropical Fish",
    conversion: 0.0015,
    icon: "🐠",
    region: ['global', 'oceania', 'asia']
  },
  mangrove: {
    id: 'mangrove',
    name: "Mangroves",
    animal: "Crab & Coastal Life",
    conversion: 0.0025,
    icon: "🦀",
    region: ['global', 'asia', 'india', 'africa']
  },
  himalayas: {
    id: 'himalayas',
    name: "Himalayan Forests",
    animal: "Snow Leopard",
    conversion: 0.0018,
    icon: "🏔️",
    region: ['global', 'asia', 'india']
  }
};

export function calculateImpactCredits(co2SavedKg: number): number {
  // 1kg of CO2 saved roughly equals 10 impact credits
  return Math.round(Math.max(0, co2SavedKg) * 10);
}

export function convertCreditsToArea(credits: number, habitatId: string): number {
  const habitat = HABITATS[habitatId];
  if (!habitat) return 0;
  return Number((credits * habitat.conversion).toFixed(3)); // rounded to 3 decimal places
}

export function getHabitatsForRegion(region: string | null): HabitatConfig[] {
  const allHabitats = Object.values(HABITATS);
  if (!region) return allHabitats;
  
  // Filter habitats that include the user's region or are tagged 'global'
  return allHabitats.filter(h => h.region.includes('global') || h.region.includes(region.toLowerCase()));
}
