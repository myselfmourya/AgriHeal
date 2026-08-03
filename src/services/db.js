import localforage from 'localforage';

// Configure LocalForage to use IndexedDB
localforage.config({
  name: 'AgriHealDB',
  version: 1.0,
  storeName: 'farm_os_data', 
  description: 'Offline database for AgriHeal Farm OS'
});

// Initialize individual stores (localforage manages these internally, 
// we use distinct keys for different data types, or we can create separate instances)

const cropsStore = localforage.createInstance({ name: 'AgriHealDB', storeName: 'crops' });
const expensesStore = localforage.createInstance({ name: 'AgriHealDB', storeName: 'expenses' });
const tasksStore = localforage.createInstance({ name: 'AgriHealDB', storeName: 'tasks' });
const syncQueueStore = localforage.createInstance({ name: 'AgriHealDB', storeName: 'sync_queue' });

const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

export const db = {
  // --- Crops ---
  getCrops: async () => {
    const crops = [];
    await cropsStore.iterate((value) => { crops.push(value); });
    return crops;
  },
  addCrop: async (crop) => {
    const newCrop = { ...crop, id: generateId(), createdAt: new Date().toISOString(), synced: false };
    await cropsStore.setItem(newCrop.id, newCrop);
    await syncQueueStore.setItem(`crop_${newCrop.id}`, { type: 'ADD_CROP', payload: newCrop, timestamp: new Date().toISOString() });
    return newCrop;
  },
  updateCrop: async (cropId, updatedFields) => {
    const crop = await cropsStore.getItem(cropId);
    if (!crop) return null;
    const newCrop = { ...crop, ...updatedFields, updatedAt: new Date().toISOString() };
    await cropsStore.setItem(cropId, newCrop);
    await syncQueueStore.setItem(`crop_update_${cropId}_${Date.now()}`, { type: 'UPDATE_CROP', payload: newCrop, timestamp: new Date().toISOString() });
    return newCrop;
  },
  deleteCrop: async (cropId) => {
    await cropsStore.removeItem(cropId);
    await syncQueueStore.setItem(`crop_delete_${cropId}_${Date.now()}`, { type: 'DELETE_CROP', payload: { id: cropId }, timestamp: new Date().toISOString() });
    return true;
  },
  
  // --- Expenses ---
  getExpenses: async () => {
    const expenses = [];
    await expensesStore.iterate((value) => { expenses.push(value); });
    return expenses;
  },
  addExpense: async (expense) => {
    const newExpense = { ...expense, id: generateId(), createdAt: new Date().toISOString(), synced: false };
    await expensesStore.setItem(newExpense.id, newExpense);
    await syncQueueStore.setItem(`expense_${newExpense.id}`, { type: 'ADD_EXPENSE', payload: newExpense, timestamp: new Date().toISOString() });
    return newExpense;
  },
  updateExpense: async (expenseId, updatedFields) => {
    const expense = await expensesStore.getItem(expenseId);
    if (!expense) return null;
    const newExpense = { ...expense, ...updatedFields, updatedAt: new Date().toISOString() };
    await expensesStore.setItem(expenseId, newExpense);
    await syncQueueStore.setItem(`expense_update_${expenseId}_${Date.now()}`, { type: 'UPDATE_EXPENSE', payload: newExpense, timestamp: new Date().toISOString() });
    return newExpense;
  },
  deleteExpense: async (expenseId) => {
    await expensesStore.removeItem(expenseId);
    await syncQueueStore.setItem(`expense_delete_${expenseId}_${Date.now()}`, { type: 'DELETE_EXPENSE', payload: { id: expenseId }, timestamp: new Date().toISOString() });
    return true;
  },

  // --- Sync Queue ---
  getSyncQueue: async () => {
    const queue = [];
    await syncQueueStore.iterate((value, key) => { queue.push({ key, ...value }); });
    // Sort by timestamp
    return queue.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },
  removeSyncItem: async (key) => {
    await syncQueueStore.removeItem(key);
  },
  updateSyncItem: async (item) => {
    // Save updated item (e.g. with new retryCount) back to sync queue
    const { key, ...itemData } = item;
    await syncQueueStore.setItem(key, itemData);
  },
  
  // --- Global ---
  clearAll: async () => {
    await cropsStore.clear();
    await expensesStore.clear();
    await tasksStore.clear();
    await syncQueueStore.clear();
  }
};
