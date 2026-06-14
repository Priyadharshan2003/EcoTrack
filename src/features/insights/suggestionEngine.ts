import { UserContext } from '@/types';

export interface Insight {
  id: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionType?: 'reduce' | 'offset';
}

export function generateSuggestions(context: UserContext): Insight[] {
  const suggestions: Insight[] = [];

  if (context.dominantSource === 'cab_travel' || context.habits.includes('frequent_cab')) {
    suggestions.push({
      id: 'insight_cab',
      title: 'Transport emissions are high',
      description: 'You\'ve taken several cabs recently. Consider carpooling or taking the metro for your next commute to boost your Eco Score.',
      actionLabel: 'View transit options',
      actionType: 'reduce'
    });
  }

  if (context.dominantSource === 'food_order' || context.habits.includes('frequent_delivery')) {
    suggestions.push({
      id: 'insight_food',
      title: 'Delivery impact',
      description: 'Food deliveries have a hidden packaging impact. Try cooking at home or choosing restaurants with eco-friendly packaging.',
      actionLabel: 'See recipes',
      actionType: 'reduce'
    });
  }

  if (context.trendStatus === 'declining') {
    suggestions.push({
      id: 'insight_trend_bad',
      title: 'Your emissions are trending up',
      description: `Your footprint is up by ${context.trend}% compared to the baseline. Consider offsetting to balance it out.`,
      actionLabel: 'Offset now',
      actionType: 'offset'
    });
  } else if (context.trendStatus === 'improving') {
    suggestions.push({
      id: 'insight_trend_good',
      title: 'Great job!',
      description: `Your emissions are down by ${Math.abs(context.trend)}%. Keep up the good work!`,
    });
  }

  if (context.habits.includes('active_commuter')) {
    suggestions.push({
      id: 'insight_active',
      title: 'Eco-Champion!',
      description: 'Your walking and biking habits are saving a lot of carbon. Keep the streak alive!'
    });
  }

  // Fallback
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'insight_general',
      title: 'Did you know?',
      description: 'Unplugging electronics when not in use can save up to 10% on your energy bill and reduce emissions.'
    });
  }

  return suggestions;
}
