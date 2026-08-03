import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { syncService } from './syncService';

export const recordsService = {
  // Livestock
  async getLivestock() {
    try {
      // First try local
      const local = await db.livestock.toArray();
      if (local.length > 0) return local;

      // Then fetch from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from('livestock_records')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      // Save to local
      if (data) {
        await db.livestock.bulkPut(data.map(d => ({
          ...d,
          isSynced: 1,
          syncAction: 'none'
        })));
      }
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async addLivestock(record) {
    const newRecord = {
      ...record,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      isSynced: 0,
      syncAction: 'create'
    };
    await db.livestock.add(newRecord);
    await db.queueLivestockSync('create', newRecord);
    syncService.syncData().catch(e => console.warn('[Records] Background sync failed:', e));
    return newRecord;
  },

  // Equipment (Farm Tools/Records)
  async getEquipment() {
    try {
      const local = await db.equipment.toArray();
      if (local.length > 0) return local;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from('equipment_records')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      if (data) {
        await db.equipment.bulkPut(data.map(d => ({
          ...d,
          isSynced: 1,
          syncAction: 'none'
        })));
      }
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getVitals() {
    try {
      return await db.vitals.toArray();
    } catch(e) { return []; }
  },
  
  async getFinancial() {
    try {
      return await db.financial.toArray();
    } catch(e) { return []; }
  },
  
  async getDocs() {
    try {
      return await db.docs.toArray();
    } catch(e) { return []; }
  },
  
  async getReports() {
    try {
      return await db.reports.toArray();
    } catch(e) { return []; }
  },
  
  async getCropHistory() {
    try {
      return await db.cropHistory.toArray();
    } catch(e) { return []; }
  }
};
