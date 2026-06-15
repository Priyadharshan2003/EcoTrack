// Use local dev server during development, or Vercel production URL
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api';

interface CalculateRequest {
  activities: any[];
}

export const apiClient = {
  async calculateFootprint(data: CalculateRequest) {
    const res = await fetch(`${API_BASE_URL}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to calculate footprint');
    return res.json();
  },

  async getInsights(data: { user_id: string; recent_activities: any[]; total_emissions: number }) {
    const res = await fetch(`${API_BASE_URL}/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to fetch insights');
    return res.json();
  },

  async purchaseOffset(data: { user_id: string; amount_kg: number; habitat_id: string }) {
    const res = await fetch(`${API_BASE_URL}/offset/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to purchase offset');
    return res.json();
  }
};
