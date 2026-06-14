export type ActivityType = 'cab_travel' | 'food_order' | 'streaming' | 'walk' | 'bike';

export type ActivityStatus = 'pending' | 'verified' | 'rejected';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  confidence: number;
  inferred_from: string[];
  status: ActivityStatus;
  emissions_kg: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface OffsetTransaction {
  id: string;
  title: string;
  impact_kg: number;
  price: number;
  currency: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  type: 'EARN' | 'SPEND' | 'OFFSET';
  amount: number;
  currency: 'PTS' | 'INR';
  title: string;
  timestamp: string;
}

export interface Challenge {
  id: string;
  title: string;
  progress: number;
  target: number;
  daysLeft: number;
}

// Added Context Engine types
export type CarbonTrend = 'improving' | 'declining' | 'stable';

export interface UserContext {
  dominantSource: ActivityType | null;
  trend: number; // e.g., +12% or -5%
  trendStatus: CarbonTrend;
  ecoScore: number;
  habits: string[]; // e.g., ['heavy_commuter', 'frequent_cab']
}
