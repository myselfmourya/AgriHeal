import { db } from './db';
import { db as dexieDb } from '../lib/db';
import { supabase } from '../lib/supabase';

/**
 * Service responsible for syncing offline IndexedDB data with the backend API.
 */
export const syncService = {
  isSyncing: false,
  maxRetries: 3,
  
  syncData: async () => {
    if (syncService.isSyncing) return;
    if (!navigator.onLine) {
      console.log("[SyncService] Device is offline. Sync deferred.");
      return;
    }

    try {
      syncService.isSyncing = true;
      
      // Get the currently logged in user
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        console.log("[SyncService] User not authenticated. Sync deferred.");
        return;
      }

      const queue = await db.getSyncQueue();
      const dexieQueue = await dexieDb.syncQueue.toArray();
      
      if (queue.length === 0 && dexieQueue.length === 0) {
        console.log("[SyncService] No pending items to sync.");
        return;
      }
      
      if (queue.length > 0) {
        console.log(`[SyncService] Found ${queue.length} localforage items to sync...`);

        for (const item of queue) {
          // Skip dead-letter items (failed too many times)
          if (item.retryCount && item.retryCount >= syncService.maxRetries) {
            console.warn(`[SyncService] Skipping dead-letter item ${item.key} (Max retries reached).`);
            continue;
          }

          console.log(`[SyncService] Syncing item: ${item.type}`, item.payload);
          
          let error = null;
          
          if (item.type === 'ADD_CROP') {
            // Push crop to supabase (Upsert for idempotency)
            const { error: insertError } = await supabase.from('crops').upsert({
              id: item.payload.id,
              user_id: user.id,
              name: item.payload.name,
              area: item.payload.area,
              planting_date: item.payload.plantingDate,
              status: item.payload.status || 'growing',
            }, { onConflict: 'id' });
            error = insertError;
          } else if (item.type === 'ADD_EXPENSE') {
            // Push expense to supabase (Upsert for idempotency)
            const { error: insertError } = await supabase.from('expenses').upsert({
              id: item.payload.id,
              user_id: user.id,
              crop_id: item.payload.cropId,
              category: item.payload.category,
              amount: item.payload.amount,
              date: item.payload.date,
              notes: item.payload.notes,
            }, { onConflict: 'id' });
            error = insertError;
          } else if (item.type === 'UPDATE_CROP') {
            const { error: updateError } = await supabase.from('crops').update({
              name: item.payload.name,
              area: item.payload.area,
              status: item.payload.status,
            }).eq('id', item.payload.id);
            error = updateError;
          } else if (item.type === 'DELETE_CROP') {
            const { error: deleteError } = await supabase.from('crops').delete().eq('id', item.payload.id);
            error = deleteError;
          } else if (item.type === 'UPDATE_EXPENSE') {
            const { error: updateError } = await supabase.from('expenses').update({
              category: item.payload.category,
              amount: item.payload.amount,
              date: item.payload.date,
              notes: item.payload.notes,
            }).eq('id', item.payload.id);
            error = updateError;
          } else if (item.type === 'DELETE_EXPENSE') {
            const { error: deleteError } = await supabase.from('expenses').delete().eq('id', item.payload.id);
            error = deleteError;
          }
          
          if (error) {
            console.error(`[SyncService] Failed to sync item ${item.key}:`, error);
            // Increment retry count or initialize it
            item.retryCount = (item.retryCount || 0) + 1;
            item.lastError = error.message;
            item.lastAttempt = new Date().toISOString();
            
            // If max retries reached, it becomes a dead letter
            if (item.retryCount >= syncService.maxRetries) {
              console.error(`[SyncService] Item ${item.key} moved to dead-letter queue.`);
            }
            
            // Update item in indexeddb to save retry count
            await db.updateSyncItem(item);
          } else {
            // Once successful, remove from sync queue
            await db.removeSyncItem(item.key);
            console.log(`[SyncService] Successfully synced ${item.key}`);
          }
        }
      }

      // Process Dexie sync queue
      if (dexieQueue.length > 0) {
        console.log(`[SyncService] Found ${dexieQueue.length} Dexie items to sync...`);

        for (const item of dexieQueue) {
          if (item.retryCount && item.retryCount >= syncService.maxRetries) {
            console.warn(`[SyncService] Skipping dead-letter Dexie item ${item.id} (Max retries reached).`);
            continue;
          }

          console.log(`[SyncService] Syncing Dexie item: ${item.table} ${item.operation}`, item.payload);

          let error = null;
          const tableName = item.table?.endsWith('_records') ? item.table : `${item.table}_records`;

          if (item.operation === 'create') {
            const recordData = {
              ...item.payload,
              user_id: item.payload?.user_id || user.id,
            };
            delete recordData.isSynced;
            delete recordData.syncAction;

            const { error: upsertError } = await supabase
              .from(tableName)
              .upsert(recordData, { onConflict: 'id' });
            error = upsertError;
          } else if (item.operation === 'update') {
            const recordData = {
              ...item.payload,
            };
            delete recordData.isSynced;
            delete recordData.syncAction;

            const recordId = item.payload?.id || item.payload;
            const { error: updateError } = await supabase
              .from(tableName)
              .update(recordData)
              .eq('id', recordId);
            error = updateError;
          } else if (item.operation === 'delete') {
            const recordId = typeof item.payload === 'object' ? item.payload?.id : item.payload;
            const { error: deleteError } = await supabase
              .from(tableName)
              .delete()
              .eq('id', recordId);
            error = deleteError;
          }

          if (error) {
            console.error(`[SyncService] Failed to sync Dexie item ${item.id}:`, error);
            item.retryCount = (item.retryCount || 0) + 1;
            item.lastError = error.message;
            item.lastAttempt = new Date().toISOString();

            if (item.retryCount >= syncService.maxRetries) {
              console.error(`[SyncService] Dexie item ${item.id} moved to dead-letter queue.`);
            }

            await dexieDb.syncQueue.put(item);
          } else {
            await dexieDb.syncQueue.delete(item.id);
            console.log(`[SyncService] Successfully synced Dexie item ${item.id}`);
          }
        }
      }
      
      console.log("[SyncService] Sync complete.");
    } catch (error) {
      console.error("[SyncService] Error during sync:", error);
    } finally {
      syncService.isSyncing = false;
    }
  },

  // Listen for online events to trigger background sync
  init: () => {
    window.addEventListener('online', () => {
      console.log("[SyncService] Device went online. Triggering sync...");
      syncService.syncData();
    });
    
    // Attempt sync on initialization if online
    if (navigator.onLine) {
      syncService.syncData();
    }
  }
};
