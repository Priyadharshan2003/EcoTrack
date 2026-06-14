import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserSlice, createUserSlice } from './slices/userSlice';
import { CarbonSlice, createCarbonSlice } from './slices/carbonSlice';
import { ActivitySlice, createActivitySlice } from './slices/activitySlice';
import { ChatSlice, createChatSlice } from './slices/chatSlice';
import { OffsetSlice, createOffsetSlice } from './slices/offsetSlice';

export * from '@/types';

export type StoreState = UserSlice & CarbonSlice & ActivitySlice & ChatSlice & OffsetSlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createCarbonSlice(...a),
      ...createActivitySlice(...a),
      ...createChatSlice(...a),
      ...createOffsetSlice(...a),
    }),
    {
      name: 'ecotrack-storage-v8', // bumped version
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
