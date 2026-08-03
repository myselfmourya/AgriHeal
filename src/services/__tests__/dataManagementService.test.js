import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { dataManagementService } from '../dataManagementService';
import { supabase } from '../../lib/supabase';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    }
  }
}));

// Mock global fetch for the deleteAccount edge function call
global.fetch = vi.fn();
describe('dataManagementService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('exportUserData', () => {
    it('should generate a JSON download of user data', async () => {
      // Mock local storage data
      localStorage.setItem('ah-profile', JSON.stringify({ name: 'Test Farmer' }));
      
      // Mock DOM methods for downloading
      const createElementSpy = vi.spyOn(document, 'createElement');
      const clickSpy = vi.fn();
      const removeSpy = vi.fn();
      const setAttributeSpy = vi.fn();
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});

      createElementSpy.mockReturnValue({
        setAttribute: setAttributeSpy,
        click: clickSpy,
        remove: removeSpy
      });

      const success = await dataManagementService.exportUserData();
      
      expect(success).toBe(true);
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(setAttributeSpy).toHaveBeenCalledTimes(2);
      expect(setAttributeSpy).toHaveBeenCalledWith('download', expect.stringContaining('AgriHeal_Export_'));
      // Checking that href has the data
      expect(setAttributeSpy).toHaveBeenCalledWith('href', expect.stringContaining('data:text/json;charset=utf-8,'));
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('should clear all local and session storage except allowed keys', async () => {
      localStorage.setItem('ah-profile', JSON.stringify({ name: 'Test Farmer' }));
      localStorage.setItem('ah-lang', 'te');
      sessionStorage.setItem('temp-data', '123');
      
      // Mock active session
      supabase.auth.getSession.mockResolvedValue({
        data: { session: { access_token: 'fake-token' } }
      });
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });

      const success = await dataManagementService.deleteAccount();
      
      expect(success).toBe(true);
      expect(localStorage.getItem('ah-profile')).toBeNull();
      expect(sessionStorage.getItem('temp-data')).toBeNull();
      // Should preserve ah-lang
      expect(localStorage.getItem('ah-lang')).toBe('te');
    });
  });
});
