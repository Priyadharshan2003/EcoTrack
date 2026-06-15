import { StateCreator } from 'zustand';
import { Activity } from '@/types';
import { StoreState } from '../index';
import { calculateImpactCredits } from '@/constants/habitats'; // Assumes this exists, else will resolve

export interface ActivitySlice {
  pendingActivities: Activity[];
  verifiedActivities: Activity[];
  
  addPendingActivities: (activities: Activity[]) => void;
  verifyActivity: (id: string, isConfirmed: boolean) => Promise<void>;
}

export const createActivitySlice: StateCreator<StoreState, [], [], ActivitySlice> = (set, get) => ({
  pendingActivities: [
    {
      id: 'seed_1',
      type: 'cab_travel',
      title: 'Morning Commute',
      description: 'Ola ride to Koramangala — 8.2 km',
      confidence: 0.94,
      inferred_from: ['location', 'payment'],
      status: 'pending',
      emissions_kg: 2.1,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'seed_2',
      type: 'food_order',
      title: 'Lunch Order',
      description: 'Swiggy delivery from Burger King',
      confidence: 0.98,
      inferred_from: ['app_usage', 'payment'],
      status: 'pending',
      emissions_kg: 1.4,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'seed_3',
      type: 'walk',
      title: 'Evening Walk',
      description: 'Walked 2.3 km to the park',
      confidence: 0.91,
      inferred_from: ['steps', 'location'],
      status: 'pending',
      emissions_kg: 0.0,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    }
  ],
  verifiedActivities: [],

  addPendingActivities: (activities) => 
    set((state) => ({ pendingActivities: [...state.pendingActivities, ...activities] })),

  verifyActivity: async (id, isConfirmed) => {
    // Optimistic update for UI snap
    set((state) => {
      const activity = state.pendingActivities.find((a) => a.id === id);
      if (!activity) return state;

      const updatedActivity: Activity = { ...activity, status: isConfirmed ? 'verified' : 'rejected' };
      
      const newScore = isConfirmed ? state.carbonScore + activity.emissions_kg : state.carbonScore;
      const newEcoScore = Math.max(0, Math.min(100, 100 - (newScore / 10)));
      
      let newPoints = state.ecoPoints;
      let newImpactCredits = state.impactCredits;
      let newTransactions = state.transactions;

      if (isConfirmed) {
        newPoints += 50; 
        const savingsKg = Math.max(0, 5 - activity.emissions_kg);
        const creditsEarned = Math.round(savingsKg * 10);
        newImpactCredits += creditsEarned;

        newTransactions = [
          {
            id: `txn_${Date.now()}`,
            type: 'EARN',
            amount: 50,
            currency: 'PTS',
            title: `Verified: ${activity.title}`,
            timestamp: new Date().toISOString()
          },
          ...state.transactions
        ];
      }

      return {
        pendingActivities: state.pendingActivities.filter((a) => a.id !== id),
        verifiedActivities: isConfirmed 
          ? [...state.verifiedActivities, updatedActivity]
          : state.verifiedActivities,
        carbonScore: newScore,
        ecoScore: newEcoScore,
        ecoPoints: newPoints,
        impactCredits: newImpactCredits,
        transactions: newTransactions
      };
    });
    
    // Call backend to re-calculate or log
    try {
      const state = get();
      const activity = state.verifiedActivities.find(a => a.id === id);
      if (isConfirmed && activity) {
        // Sync with backend async (fire and forget for now)
        fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api'}/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activities: [activity] })
        }).catch(() => {}); // silent fail for robust UX
      }
    } catch (e) {
      console.error(e);
    }
  },
});
