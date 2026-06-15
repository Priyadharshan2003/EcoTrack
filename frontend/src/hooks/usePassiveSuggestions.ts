import { useState, useEffect } from 'react';
import { useCarbonStore } from '@/store/useCarbonStore';

export interface Suggestion {
  id: string;
  type: 'transport' | 'food' | 'energy';
  message: string;
  value: number; // e.g. 12 km
  impact: number; // e.g. 2.3 kg CO2
}

export function usePassiveSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { profile } = useCarbonStore();

  useEffect(() => {
    // In a real app, this would read past entries and infer daily patterns.
    // Here we generate mock suggestions based on profile data.
    const newSuggestions: Suggestion[] = [];

    if (profile.commuteType === 'Car') {
      newSuggestions.push({
        id: 'sug_1',
        type: 'transport',
        message: 'You likely traveled 12km via car today.',
        value: 12,
        impact: 2.3
      });
    } else if (profile.commuteType === 'Metro') {
      newSuggestions.push({
        id: 'sug_2',
        type: 'transport',
        message: 'You likely traveled 10km via metro today.',
        value: 10,
        impact: 0.4
      });
    }

    if (profile.dietType === 'Vegetarian') {
      newSuggestions.push({
        id: 'sug_3',
        type: 'food',
        message: 'We recorded your vegetarian diet for today.',
        value: 1,
        impact: 1.7
      });
    }

    const timer = setTimeout(() => setSuggestions(newSuggestions), 0);
    return () => clearTimeout(timer);
  }, [profile.commuteType, profile.dietType]);

  const confirmSuggestion = (id: string) => {
    // In a real app, log it to the backend.
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  return {
    suggestions,
    confirmSuggestion,
    dismissSuggestion
  };
}
