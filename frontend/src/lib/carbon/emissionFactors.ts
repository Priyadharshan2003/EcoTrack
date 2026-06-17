import { Category } from "./categories";

// Emission factors in kg CO2 per unit
export const EMISSION_FACTORS: Record<Category, Record<string, number>> = {
  transport: {
    car_km: 0.192,
    bus_km: 0.105,
    train_km: 0.041,
    flight_short_km: 0.255,
    flight_long_km: 0.150,
    bike_km: 0.0,
    walk_km: 0.0
  },
  energy: {
    electricity_kwh: 0.233, // Depends on region, 0.233 is a global avg example
    gas_kwh: 0.203,
    water_m3: 0.344
  },
  food: {
    beef_kg: 27.0,
    chicken_kg: 6.9,
    vegetables_kg: 2.0,
    dairy_kg: 3.2
  },
  shopping: {
    clothes_item: 15.0,
    electronics_item: 50.0
  }
};
