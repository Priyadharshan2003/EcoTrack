import { UserContext } from '@/types';

type Intent = 'reduce' | 'feedback' | 'compare' | 'explain' | 'general';

export function detectIntent(message: string): Intent {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('reduce') || lowerMsg.includes('lower') || lowerMsg.includes('cut')) return 'reduce';
  if (lowerMsg.includes('feedback') || lowerMsg.includes('issue') || lowerMsg.includes('wrong') || lowerMsg.includes('mistake')) return 'feedback';
  if (lowerMsg.includes('compare') || lowerMsg.includes('average') || lowerMsg.includes('others')) return 'compare';
  if (lowerMsg.includes('explain') || lowerMsg.includes('why') || lowerMsg.includes('what is') || lowerMsg.includes('how')) return 'explain';
  return 'general';
}

export function generateAssistantResponse(message: string, context: UserContext): string {
  const intent = detectIntent(message);

  switch (intent) {
    case 'reduce':
      if (context.dominantSource) {
        return `To reduce your footprint, focus on your primary emission source: ${context.dominantSource.replace('_', ' ')}. Check out the offset market or try switching up your habits.`;
      }
      return 'To reduce your footprint, try walking or biking for short trips, and consider offsetting any unavoidable emissions.';
    case 'feedback':
      return 'Thanks for the feedback! I learn every time you verify or reject an activity. This helps improve my detection confidence for your future activities.';
    case 'compare':
      return `Your Eco Score is ${context.ecoScore.toFixed(0)}/100, and your emissions trend is currently ${context.trendStatus} (${context.trend > 0 ? '+' : ''}${context.trend}%). Keep aiming for a higher score!`;
    case 'explain':
      const habitStr = context.habits.length > 0 ? context.habits.map(h => h.replace('_', ' ')).join(' and ') : 'steady user';
      return `Your carbon score is calculated based on activities we detect. Based on your history, I'd say you are a ${habitStr}. Every choice counts!`;
    default:
      return "I'm your Context-Aware Carbon AI. I can help you reduce your footprint, compare your stats, explain your emissions, or take feedback. What's on your mind?";
  }
}
