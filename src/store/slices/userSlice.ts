import { StateCreator } from 'zustand';
import { Transaction, Challenge } from '@/types';
import { StoreState } from '../index';

export interface UserSlice {
  theme: 'light' | 'dark' | 'system';
  accent: string;
  streakDays: number;
  ecoPoints: number;
  activeChallenge: Challenge | null;
  isDeviceBannerDismissed: boolean;
  badges: string[];
  transactions: Transaction[];
  corporateEmail: string | null;
  impactCredits: number;
  selectedHabitat: string;
  userRegion: string | null;
  habitatProgress: Record<string, number>;
  hasSeenWelcome: boolean;
  lastActiveTimestamp: number;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAccent: (accent: string) => void;
  dismissDeviceBanner: () => void;
  setCorporateAuth: (email: string | null) => void;
  addPoints: (amount: number, reason: string) => void;
  setUserRegion: (region: string) => void;
  setSelectedHabitat: (habitatId: string) => void;
  redeemCredits: (credits: number, habitatId: string, protectedArea: number) => void;
  setHasSeenWelcome: () => void;
  updateLastActive: () => void;
}

export const createUserSlice: StateCreator<StoreState, [], [], UserSlice> = (set) => ({
  theme: 'dark',
  accent: 'green',
  streakDays: 3,
  ecoPoints: 450,
  activeChallenge: {
    id: 'c1',
    title: 'Reduce emissions by 10%',
    progress: 60,
    target: 100,
    daysLeft: 3
  },
  isDeviceBannerDismissed: false,
  badges: ['first_offset', 'low_transport'],
  transactions: [
    { id: 't1', type: 'EARN', amount: 200, currency: 'PTS', title: 'Welcome Bonus', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 't2', type: 'EARN', amount: 250, currency: 'PTS', title: '7-Day Streak Achieved', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ],
  corporateEmail: null,
  impactCredits: 50,
  selectedHabitat: 'mangrove',
  userRegion: 'india',
  habitatProgress: {},
  hasSeenWelcome: false,
  lastActiveTimestamp: Date.now(),

  setTheme: (theme) => set({ theme }),
  setAccent: (accent) => set({ accent }),
  dismissDeviceBanner: () => set({ isDeviceBannerDismissed: true }),
  setCorporateAuth: (email) => set({ corporateEmail: email }),
  addPoints: (amount, reason) => 
    set((state) => ({
      ecoPoints: state.ecoPoints + amount,
      transactions: [{
        id: `txn_reward_${Date.now()}`,
        type: 'EARN',
        amount,
        currency: 'PTS',
        title: reason,
        timestamp: new Date().toISOString()
      }, ...state.transactions]
    })),
  setUserRegion: (region) => set({ userRegion: region }),
  setSelectedHabitat: (habitatId) => set({ selectedHabitat: habitatId }),
  redeemCredits: (credits, habitatId, protectedArea) => set((state) => {
    if (state.impactCredits < credits) return state;
    return {
      impactCredits: state.impactCredits - credits,
      habitatProgress: {
        ...state.habitatProgress,
        [habitatId]: (state.habitatProgress[habitatId] || 0) + protectedArea
      }
    };
  }),
  setHasSeenWelcome: () => set({ hasSeenWelcome: true }),
  updateLastActive: () => set({ lastActiveTimestamp: Date.now() }),
});
