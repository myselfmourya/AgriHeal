import { db } from './db';
import { supabase } from '../lib/supabase';

export const dataManagementService = {
  /**
   * Aggregates local state simulating a data export for the "Right to Portability".
   * This generates a JSON blob of all the user's local data and triggers a download.
   */
  exportUserData: async () => {
    try {
      const dbCrops = await db.getCrops();
      const dbExpenses = await db.getExpenses();
      
      const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        farmerProfile: JSON.parse(localStorage.getItem('ah-profile') || '{}'),
        farmSettings: JSON.parse(localStorage.getItem('agriheal-settings') || '{}'),
        crops: dbCrops.length > 0 ? dbCrops : JSON.parse(localStorage.getItem('ah-my-crops') || '[]'),
        expenses: dbExpenses.length > 0 ? dbExpenses : JSON.parse(localStorage.getItem('ah_expenses') || '[]'),
        inventory: JSON.parse(localStorage.getItem('ah_inventory') || '[]'),
        tasks: JSON.parse(localStorage.getItem('ah_tasks') || '[]'),
        aiHistory: JSON.parse(localStorage.getItem('vani_history') || '[]'),
        consents: JSON.parse(localStorage.getItem('ah_consents') || '{}'),
        auditLogs: JSON.parse(localStorage.getItem('ah_audit_logs') || '[]')
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `AgriHeal_Export_${new Date().getTime()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      return true;
    } catch (error) {
      console.error("Failed to export user data:", error);
      return false;
    }
  },

  /**
   * Securely wipes all local data simulating the "Right to be Forgotten".
   * In a real environment, this would call a DELETE /api/user endpoint first.
   */
  deleteAccount: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete account on server");
      }

      // Clear localStorage
      const lang = localStorage.getItem('ah-lang');
      localStorage.clear();
      sessionStorage.clear();
      if (lang) {
        localStorage.setItem('ah-lang', lang);
      }
      
      // Also clear IndexedDB
      await db.clearAll();
      
      return true;
    } catch (error) {
      console.error("Failed to delete account data:", error);
      return false;
    }
  }
};
