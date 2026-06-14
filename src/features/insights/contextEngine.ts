import { Activity, UserContext, ActivityType, CarbonTrend } from '@/types';

export function generateUserContext(
  verifiedActivities: Activity[],
  carbonScore: number,
  ecoScore: number,
  previousCarbonScore: number = 0 // Mock historical context for POC
): UserContext {
  
  // Find dominant source
  const emissionsByType: Record<ActivityType, number> = {
    cab_travel: 0,
    food_order: 0,
    streaming: 0,
    walk: 0,
    bike: 0
  };

  verifiedActivities.forEach(act => {
    emissionsByType[act.type] += act.emissions_kg;
  });

  let dominantSource: ActivityType | null = null;
  let maxEmissions = -1;
  Object.entries(emissionsByType).forEach(([type, emissions]) => {
    if (emissions > maxEmissions && emissions > 0) {
      maxEmissions = emissions;
      dominantSource = type as ActivityType;
    }
  });

  // Calculate trend
  // For the POC, we simulate a trend based on difference
  const diff = carbonScore - previousCarbonScore;
  let trend = 0;
  let trendStatus: CarbonTrend = 'stable';
  
  if (previousCarbonScore > 0) {
    trend = (diff / previousCarbonScore) * 100;
  } else if (carbonScore > 0) {
    // If no previous score, but current > 0, we treat it as an increase
    trend = 100;
  }
  
  if (trend > 5) trendStatus = 'declining'; // more emissions = declining eco status
  else if (trend < -5) trendStatus = 'improving'; // less emissions = improving eco status

  // Generate behavior tags (habits)
  const habits: string[] = [];
  const cabCount = verifiedActivities.filter(a => a.type === 'cab_travel').length;
  if (cabCount > 1) habits.push('frequent_cab'); // adjusted threshold for mock data
  
  const deliveryCount = verifiedActivities.filter(a => a.type === 'food_order').length;
  if (deliveryCount > 1) habits.push('frequent_delivery');

  const walkBikeCount = verifiedActivities.filter(a => a.type === 'walk' || a.type === 'bike').length;
  if (walkBikeCount > 1) habits.push('active_commuter');

  return {
    dominantSource,
    trend: Math.round(trend),
    trendStatus,
    ecoScore,
    habits
  };
}
