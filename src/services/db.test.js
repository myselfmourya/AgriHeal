import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './db';
import localforage from 'localforage';

describe('db.js Database Wrapper', () => {
  beforeEach(async () => {
    await db.clearAll();
  });

  it('should save and retrieve crops', async () => {
    const crop = { name: 'Wheat' };
    const saved = await db.addCrop(crop);
    const retrieved = await db.getCrops();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].name).toBe('Wheat');
    expect(retrieved[0].id).toBe(saved.id);
  });

  it('should save and retrieve expenses', async () => {
    const expense = { amount: 100 };
    const saved = await db.addExpense(expense);
    const retrieved = await db.getExpenses();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].amount).toBe(100);
    expect(retrieved[0].id).toBe(saved.id);
  });

  it('should add to sync queue when adding item', async () => {
    const crop = { name: 'Corn' };
    await db.addCrop(crop);
    const queue = await db.getSyncQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].type).toBe('ADD_CROP');
    expect(queue[0].payload.name).toBe('Corn');
  });

  it('should clear the database', async () => {
    await db.addCrop({ name: 'Wheat' });
    await db.clearAll();
    const retrieved = await db.getCrops();
    expect(retrieved).toEqual([]);
  });
});
