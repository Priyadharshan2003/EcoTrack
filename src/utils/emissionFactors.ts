export const EMISSION_FACTORS = {
  transport: {
    cab_travel: 0.25, // kg CO2e per km
    flight_short: 0.20,
    flight_long: 0.15,
    public_transit: 0.05,
    walk: 0.0,
    bike: 0.0,
  },
  food: {
    meat_heavy: 7.2, // kg CO2e per meal
    vegetarian: 3.8,
    vegan: 2.0,
    food_order: 2.5, // average delivery
  },
  energy: {
    kwh_grid: 0.4, // kg CO2e per kWh
  },
};

/**
 * Sources:
 * - Transport: EPA Greenhouse Gas Equivalencies Calculator & DEFRA
 * - Food: IPCC Special Report on Climate Change and Land
 * - Energy: Average global grid intensity (IEA)
 */
