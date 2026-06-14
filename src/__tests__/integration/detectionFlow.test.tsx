import { useStore } from '@/store';
import { generateUserContext } from '@/features/insights/contextEngine';
import { adjustConfidence } from '@/features/detection/learningEngine';

describe('Detection -> Verification -> Insight Pipeline', () => {
  beforeEach(() => {
    useStore.setState({
      carbonScore: 10,
      ecoScore: 80,
      verifiedActivities: [],
      ecoPoints: 100,
      pendingActivities: [
        { id: 'act_1', type: 'food_order', title: 'Swiggy', description: '', confidence: 0.8, inferred_from: [], status: 'pending', emissions_kg: 3, timestamp: '' }
      ]
    });
  });

  it('completes the full flow correctly', () => {
    // 1. Verify Activity
    const { verifyActivity } = useStore.getState();
    verifyActivity('act_1', true);
    
    const stateAfterVerify = useStore.getState();
    expect(stateAfterVerify.carbonScore).toBe(13); // 10 + 3
    expect(stateAfterVerify.verifiedActivities).toHaveLength(1);
    
    // 2. Adjust Detection Confidence
    const newConfidence = adjustConfidence(0.8, true);
    expect(newConfidence).toBeGreaterThan(0.8);
    
    // 3. Generate Context and Insights
    const context = generateUserContext(stateAfterVerify.verifiedActivities, stateAfterVerify.carbonScore, stateAfterVerify.ecoScore, 10);
    expect(context.dominantSource).toBe('food_order');
    expect(context.trend).toBe(30); // (13-10)/10 * 100
  });
});
