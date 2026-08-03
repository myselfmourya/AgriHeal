import { describe, it, expect, vi } from 'vitest';
import { generateVaniResponse, buildFarmContext } from '../aiService';

// Mock Supabase so tests don't require a real DB connection
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }) },
    functions: { invoke: vi.fn().mockResolvedValue({ data: { text: 'mocked AI response' }, error: null }) },
    from: vi.fn(() => ({ insert: vi.fn().mockResolvedValue({ error: null }) })),
  })),
}));


describe('aiService', () => {
  describe('buildFarmContext', () => {
    it('should format farmer and weather context properly', () => {
      const farmerContext = { name: 'Test Farmer', location: 'Hyderabad', crops: [{ name: 'Rice' }] };
      const weatherContext = { temperature: '32°C', condition: 'Sunny' };
      
      const contextStr = buildFarmContext(farmerContext, weatherContext);
      
      expect(contextStr).toContain('Test Farmer');
      expect(contextStr).toContain('Hyderabad');
      expect(contextStr).toContain('32°C');
      expect(contextStr).toContain('Sunny');
      expect(contextStr).toContain('Rice');
    });

    it('should handle missing context gracefully', () => {
      const contextStr = buildFarmContext(null, null);
      
      expect(contextStr).toContain('Unknown');
      expect(contextStr).toContain('30°C'); // default
      expect(contextStr).toContain('None listed');
    });
  });

  describe('generateVaniResponse (Proxy Engine)', () => {
    it('should resolve with a text response from the AI proxy', async () => {
      const response = await generateVaniResponse('my crop has curling leaves', null, 'en-IN');
      // The Supabase mock returns { data: { text: 'mocked response' } }
      expect(response).toBeDefined();
      expect(typeof response.text === 'string' || typeof response === 'string').toBe(true);
    });

    it('should not throw for Hindi language input', async () => {
      await expect(
        generateVaniResponse('मंडी में price क्या है', null, 'hi-IN')
      ).resolves.toBeDefined();
    });

    it('should not throw for Telugu language input', async () => {
      await expect(
        generateVaniResponse('hello something unrelated', null, 'te-IN')
      ).resolves.toBeDefined();
    });
  });
});
