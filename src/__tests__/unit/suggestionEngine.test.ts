import { generateSuggestions } from '@/features/insights/suggestionEngine';
import { UserContext } from '@/types';

describe('Suggestion Engine', () => {
  it('generates transport suggestions for cab habits', () => {
    const context: UserContext = {
      dominantSource: 'cab_travel',
      trend: 10,
      trendStatus: 'declining',
      ecoScore: 50,
      habits: ['frequent_cab']
    };
    
    const suggestions = generateSuggestions(context);
    expect(suggestions.some(s => s.id === 'insight_cab')).toBe(true);
    expect(suggestions.some(s => s.id === 'insight_trend_bad')).toBe(true);
  });

  it('generates positive feedback for active commuters', () => {
    const context: UserContext = {
      dominantSource: null,
      trend: -10,
      trendStatus: 'improving',
      ecoScore: 90,
      habits: ['active_commuter']
    };
    
    const suggestions = generateSuggestions(context);
    expect(suggestions.some(s => s.id === 'insight_active')).toBe(true);
    expect(suggestions.some(s => s.id === 'insight_trend_good')).toBe(true);
  });
});
