import { StateCreator } from 'zustand';
import { StoreState } from '../index';

export interface CarbonSlice {
  carbonScore: number;
  ecoScore: number;
  totalOffset: number;
  
  updateCarbonScore: (amount: number) => void;
  updateEcoScore: (amount: number) => void;
}

export const createCarbonSlice: StateCreator<StoreState, [], [], CarbonSlice> = (set) => ({
  carbonScore: 0,
  ecoScore: 72,
  totalOffset: 0,

  updateCarbonScore: (amount) => set((state) => ({ carbonScore: Math.max(0, state.carbonScore + amount) })),
  updateEcoScore: (amount) => set((state) => ({ ecoScore: Math.max(0, Math.min(100, state.ecoScore + amount)) })),
});
