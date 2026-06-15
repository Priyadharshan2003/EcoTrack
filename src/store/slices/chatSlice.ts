import { StateCreator } from 'zustand';
import { ChatMessage } from '@/types';
import { StoreState } from '../index';
import { apiClient } from '@/utils/apiClient';

export interface ChatSlice {
  chatHistory: ChatMessage[];
  isChatLoading: boolean;
  addChatMessage: (message: ChatMessage) => void;
  sendChatMessage: (messageText: string) => Promise<void>;
}

export const createChatSlice: StateCreator<StoreState, [], [], ChatSlice> = (set, get) => ({
  chatHistory: [
    { id: '1', role: 'assistant', text: 'Hi! I am EcoTrack AI. How can I help you reduce your carbon footprint today?', timestamp: new Date().toISOString() }
  ],
  isChatLoading: false,
  addChatMessage: (message) => set((state) => ({ chatHistory: [...state.chatHistory, message] })),
  sendChatMessage: async (messageText) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: messageText, timestamp: new Date().toISOString() };
    set((state) => ({ chatHistory: [...state.chatHistory, userMsg], isChatLoading: true }));
    
    try {
      const state = get();
      const response = await apiClient.getInsights({
        user_id: 'default_user',
        recent_activities: state.verifiedActivities.slice(0, 5),
        total_emissions: state.carbonScore
      });
      
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: response.insight, 
        timestamp: new Date().toISOString() 
      };
      set((state) => ({ chatHistory: [...state.chatHistory, aiMsg], isChatLoading: false }));
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: "I'm having trouble connecting to the cloud right now, but remember: every small sustainable choice adds up!", 
        timestamp: new Date().toISOString() 
      };
      set((state) => ({ chatHistory: [...state.chatHistory, errorMsg], isChatLoading: false }));
    }
  }
});
