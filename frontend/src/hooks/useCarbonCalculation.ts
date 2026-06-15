import { EmissionFactors, TransportType, DietType } from "@/constants/emissionFactors";

export function useCarbonCalculation() {
  const calculateTransportEmissions = (type: TransportType, distanceKm: number): number => {
    const factor = EmissionFactors.transport[type];
    if (!factor) {
      console.warn(`Unknown transport type: ${type}`);
      return 0;
    }
    return parseFloat((factor * distanceKm).toFixed(2));
  };

  const calculateDietEmissions = (type: DietType): number => {
    const factor = EmissionFactors.diet[type];
    if (!factor) {
      console.warn(`Unknown diet type: ${type}`);
      return 0;
    }
    return factor;
  };

  return {
    calculateTransportEmissions,
    calculateDietEmissions
  };
}
