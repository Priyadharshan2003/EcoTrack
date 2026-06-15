import { StateCreator } from 'zustand';
import { OffsetTransaction } from '@/types';
import { StoreState } from '../index';
import { apiClient } from '@/utils/apiClient';

export interface OffsetSlice {
  offsetHistory: OffsetTransaction[];
  isOffsetting: boolean;
  purchaseOffset: (offset: OffsetTransaction, costInPoints?: number) => Promise<void>;
}

export const createOffsetSlice: StateCreator<StoreState, [], [], OffsetSlice> = (set) => ({
  offsetHistory: [],
  isOffsetting: false,
  purchaseOffset: async (offset, costInPoints = 0) => {
    set({ isOffsetting: true });
    try {
      // Mocking user_id and relying on frontend transaction ID for now
      await apiClient.purchaseOffset({
        user_id: 'default_user',
        amount_kg: offset.impact_kg,
        habitat_id: offset.id,
      });

      set((state) => {
        const newTotalOffset = state.totalOffset + offset.impact_kg;
        const newEcoScore = Math.min(100, state.ecoScore + (offset.impact_kg * 0.5));
        const newPoints = Math.max(0, state.ecoPoints - costInPoints);
        
        const newTransaction = {
          id: `txn_offset_${Date.now()}`,
          type: offset.currency === 'PTS' ? 'SPEND' as const : 'OFFSET' as const,
          amount: offset.price,
          currency: offset.currency as 'PTS' | 'INR',
          title: `Offset: ${offset.title}`,
          timestamp: new Date().toISOString()
        };

        return {
          offsetHistory: [offset, ...state.offsetHistory],
          transactions: [newTransaction, ...state.transactions],
          totalOffset: newTotalOffset,
          ecoScore: newEcoScore,
          ecoPoints: newPoints,
          isOffsetting: false
        };
      });
    } catch (error) {
      console.error("Failed to purchase offset:", error);
      set({ isOffsetting: false });
    }
  }
});
