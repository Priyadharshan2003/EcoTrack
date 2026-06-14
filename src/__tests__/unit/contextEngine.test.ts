import { generateUserContext } from '@/features/insights/contextEngine';
import { Activity } from '@/types';

describe('Context Engine', () => {
  it('identifies dominant source and declining trend correctly', () => {
    const verifiedActivities: Activity[] = [
      { id: '1', type: 'cab_travel', emissions_kg: 5, timestamp: '', title: '', description: '', confidence: 1, inferred_from: [], status: 'verified' },
      { id: '2', type: 'cab_travel', emissions_kg: 6, timestamp: '', title: '', description: '', confidence: 1, inferred_from: [], status: 'verified' },
    ];
    
    const context = generateUserContext(verifiedActivities, 15, 72, 10);
    
    expect(context.dominantSource).toBe('cab_travel');
    expect(context.habits).toContain('frequent_cab');
    expect(context.trend).toBe(50); // (15 - 10) / 10 * 100
    expect(context.trendStatus).toBe('declining');
  });

  it('identifies active commuter habit and improving trend', () => {
    const verifiedActivities: Activity[] = [
      { id: '1', type: 'walk', emissions_kg: 0, timestamp: '', title: '', description: '', confidence: 1, inferred_from: [], status: 'verified' },
      { id: '2', type: 'bike', emissions_kg: 0, timestamp: '', title: '', description: '', confidence: 1, inferred_from: [], status: 'verified' },
    ];
    
    const context = generateUserContext(verifiedActivities, 5, 80, 10);
    
    expect(context.habits).toContain('active_commuter');
    expect(context.trendStatus).toBe('improving');
  });
});
