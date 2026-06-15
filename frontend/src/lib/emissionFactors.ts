/**
 * Scientific Carbon Emission Factors
 * Sources: IPCC (Intergovernmental Panel on Climate Change), EPA (Environmental Protection Agency)
 * 
 * Values represent kg CO2 equivalents (kg CO2e) per unit.
 */

export const EmissionFactors = {
  transport: {
    // kg CO2e per km
    car_petrol: 0.192,
    car_diesel: 0.171,
    car_ev: 0.053,
    bus: 0.089,
    metro: 0.041,
    train: 0.035,
    flight_short_haul: 0.255, // per passenger km
    flight_long_haul: 0.150,
  },
  diet: {
    // kg CO2e per day
    meat_heavy: 3.3,
    meat_average: 2.5,
    vegetarian: 1.7,
    vegan: 1.5,
  },
  energy: {
    // kg CO2e per kWh
    grid_average: 0.233,
    renewable: 0.0,
  }
};

/**
 * Calculates emissions for a specific transport activity.
 * @param type Transport method
 * @param distanceKm Distance travelled in kilometers
 * @returns Total kg CO2e
 */
export function calculateTransportEmissions(type: keyof typeof EmissionFactors.transport, distanceKm: number): number {
  const factor = EmissionFactors.transport[type];
  if (!factor) throw new Error(`Unknown transport type: ${type}`);
  return parseFloat((factor * distanceKm).toFixed(2));
}

/**
 * Calculates baseline daily emissions based on diet profile.
 * @param type Diet profile
 * @returns Daily kg CO2e
 */
export function calculateDietEmissions(type: keyof typeof EmissionFactors.diet): number {
  const factor = EmissionFactors.diet[type];
  if (!factor) throw new Error(`Unknown diet type: ${type}`);
  return factor;
}
