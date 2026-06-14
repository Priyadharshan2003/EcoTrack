import { StateCreator } from 'zustand';
import { ChatMessage } from '@/types';
import { StoreState } from '../index';

export interface ChatSlice {
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
}

export const createChatSlice: StateCreator<StoreState, [], [], ChatSlice> = (set) => ({
  chatHistory: [
    { id: '1', role: 'assistant', text: 'Hi! I am EcoTrack AI. How can I help you reduce your carbon footprint today?', timestamp: new Date().toISOString() }
  ],
  addChatMessage: (message) => set((state) => ({ chatHistory: [...state.chatHistory, message] })),
});
