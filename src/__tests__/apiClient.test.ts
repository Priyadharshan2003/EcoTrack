import { apiClient } from '../utils/apiClient';

// Mock the global fetch
global.fetch = jest.fn();

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculateFootprint should make a POST request with correct payload', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success', total_emissions_kg: 2.5 }),
    });

    const payload = { activities: [{ id: '1', type: 'cab_travel' }] };
    const result = await apiClient.calculateFootprint(payload);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/calculate'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload)
      })
    );
    expect(result.total_emissions_kg).toBe(2.5);
  });

  it('getInsights should handle API failures', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(apiClient.getInsights({
      user_id: 'u1',
      recent_activities: [],
      total_emissions: 0
    })).rejects.toThrow('Failed to fetch insights');
  });
});
