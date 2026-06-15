export const EMISSION_FACTORS = {
  // Source: EPA (kg CO2e per unit)
  transport: {
    petrol_car_per_km: 0.192,
    diesel_car_per_km: 0.171,
    electric_car_per_km: 0.053, // accounting for grid mix
    motorcycle_per_km: 0.103,
    bus_per_km: 0.105, // per passenger km
  },
  // Source: DEFRA (kg CO2e per unit)
  flight: {
    economy_per_km: 0.146,
    business_per_km: 0.211,
    first_per_km: 0.289,
  },
  // Source: IPCC
  energy: {
    electricity_per_kwh: 0.385, // global average grid intensity
    natural_gas_per_therm: 5.3,
  }
};
