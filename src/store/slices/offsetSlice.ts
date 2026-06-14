import { StateCreator } from 'zustand';
import { OffsetTransaction } from '@/types';
import { StoreState } from '../index';

export interface OffsetSlice {
  offsetHistory: OffsetTransaction[];
  purchaseOffset: (offset: OffsetTransaction, costInPoints?: number) => void;
}

export const createOffsetSlice: StateCreator<StoreState, [], [], OffsetSlice> = (set) => ({
  offsetHistory: [],
  purchaseOffset: (offset, costInPoints = 0) => 
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
        ecoPoints: newPoints
      };
    }),
});
