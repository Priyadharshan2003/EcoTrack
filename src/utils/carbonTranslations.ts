// carbonTranslations.ts
// Converts raw kg CO₂ values into human-scale equivalents users actually understand.

export function toHumanScale(kg: number): string {
  if (kg < 0.1) return `${(kg * 1000).toFixed(0)}g — a few smartphone charges`;
  if (kg < 0.5) return `≈ ${(kg * 3.75).toFixed(1)} km by car`;
  if (kg < 1)   return `≈ ${(kg * 3.75).toFixed(1)} km in a petrol car`;
  if (kg < 5)   return `≈ ${Math.round(kg * 3.75)} km in a diesel car`;
  if (kg < 20)  return `≈ ${(kg / 6).toFixed(1)} hours of flying`;
  if (kg < 100) return `≈ ${(kg / 22).toFixed(1)} trees needed to offset`;
  return `≈ ${(kg / 120).toFixed(1)} domestic flights`;
}

export function toTrueCostLabel(type: string, kg: number): string {
  switch (type) {
    case 'cab_travel':
      return `${(kg * 0.18).toFixed(2)} m² of rainforest is stressed by this trip's CO₂`;
    case 'food_order':
      return `Packaging + delivery = ${(kg * 1.5).toFixed(1)} km equivalent by car`;
    case 'streaming':
      return `${Math.round(kg * 60)} mins of streaming = 1 smartphone charge`;
    case 'walk':
    case 'bike':
      return `Great choice! ${(5 - kg).toFixed(1)} kg CO₂ saved vs driving`;
    default:
      return `${toHumanScale(kg)} of CO₂ equivalent`;
  }
}

export function toOffsetAction(kg: number): string {
  const credits = Math.ceil(kg * 10);
  return `Offset for ${credits} credits →`;
}
