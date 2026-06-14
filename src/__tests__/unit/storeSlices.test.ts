import { useStore } from '@/store';

describe('Store Slices', () => {
  beforeEach(() => {
    useStore.setState({
      carbonScore: 0,
      ecoPoints: 0,
      verifiedActivities: [],
      pendingActivities: [
        { id: 'test_1', type: 'cab_travel', title: 'Cab', description: '', confidence: 0.9, inferred_from: [], status: 'pending', emissions_kg: 5, timestamp: '' }
      ]
    });
  });

  it('verifyActivity updates carbonScore and adds points', () => {
    const { verifyActivity } = useStore.getState();
    verifyActivity('test_1', true);
    
    const state = useStore.getState();
    expect(state.carbonScore).toBe(5);
    expect(state.ecoPoints).toBe(50);
    expect(state.verifiedActivities).toHaveLength(1);
    expect(state.pendingActivities).toHaveLength(0);
  });
});
