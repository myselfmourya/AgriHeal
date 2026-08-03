import Dexie from 'dexie';

export const db = new Dexie('AgriHealLocalDB');

db.version(1).stores({
  livestock: 'id, user_id, animal_type, isSynced',
  equipment: 'id, user_id, equipment_name, isSynced',
  vitals: 'id, user_id, date, isSynced',
  financial: 'id, user_id, date, type, isSynced',
  docs: 'id, user_id, type, date, isSynced',
  reports: 'id, user_id, date, type, isSynced',
  cropHistory: 'id, user_id, date, crop, isSynced',
  syncQueue: '++id, table, operation, payload, timestamp'
});

db.queueLivestockSync = async (operation, payload) => {
  return await db.syncQueue.add({
    table: 'livestock',
    operation,
    payload,
    timestamp: new Date().toISOString(),
    retryCount: 0
  });
};

db.queueEquipmentSync = async (operation, payload) => {
  return await db.syncQueue.add({
    table: 'equipment',
    operation,
    payload,
    timestamp: new Date().toISOString(),
    retryCount: 0
  });
};

