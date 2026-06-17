import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserProfile {
  commuteType: string;
  dietType: string;
  cabUsageFrequency: string;
  hasCompletedOnboarding: boolean;
  publicLeaderboard: boolean;
  showBadges: boolean;
}

interface CarbonStore {
  totalEmissions: number;
  offsetsPurchased: number;
  netFootprint: number;
  carbonCredits: number;
  currentStreak: number;
  badges: string[];
  profile: UserProfile;
  
  setEmissions: (emissions: number) => void;
  setOffsets: (offsets: number) => void;
  updateNet: () => void;
  addCredits: (amount: number) => void;
  incrementStreak: () => void;
  unlockBadge: (badge: string) => void;
  completeOnboarding: (profile: Omit<UserProfile, 'hasCompletedOnboarding' | 'publicLeaderboard' | 'showBadges'>) => void;
  updateGamificationSettings: (settings: Partial<Pick<UserProfile, 'publicLeaderboard' | 'showBadges'>>) => void;
}

export const useCarbonStore = create<CarbonStore>()(
  persist(
    (set, get) => ({
      totalEmissions: 1204,
      offsetsPurchased: 500,
      netFootprint: 704,
      carbonCredits: 150,
      currentStreak: 12,
      badges: ['Eco Starter', 'Tree Hugger'],
      profile: {
        commuteType: '',
        dietType: '',
        cabUsageFrequency: '',
        hasCompletedOnboarding: false,
        publicLeaderboard: true,
        showBadges: true,
      },
      setEmissions: (emissions) => set({ totalEmissions: emissions }),
      setOffsets: (offsets) => set({ offsetsPurchased: offsets }),
      updateNet: () => set({ netFootprint: get().totalEmissions - get().offsetsPurchased }),
      addCredits: (amount) => set({ carbonCredits: get().carbonCredits + amount }),
      incrementStreak: () => set({ currentStreak: get().currentStreak + 1 }),
      unlockBadge: (badge) => set({ 
        badges: get().badges.includes(badge) ? get().badges : [...get().badges, badge] 
      }),
      completeOnboarding: (newProfile) => set({ 
        profile: { ...get().profile, ...newProfile, hasCompletedOnboarding: true }
      }),
      updateGamificationSettings: (settings) => set({
        profile: { ...get().profile, ...settings }
      })
    }),
    {
      name: 'carbon-storage',
    }
  )
)

// Selectors to prevent unnecessary re-renders
export const selectTotalEmissions = (state: CarbonStore) => state.totalEmissions;
export const selectProfile = (state: CarbonStore) => state.profile;
export const selectCurrentStreak = (state: CarbonStore) => state.currentStreak;
export const selectCarbonCredits = (state: CarbonStore) => state.carbonCredits;
export const selectBadges = (state: CarbonStore) => state.badges;
