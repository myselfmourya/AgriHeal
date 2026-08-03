import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncService } from './syncService';
import { db } from './db';

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user-id' } } } })
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null })
    })
  }
}));

vi.mock('../lib/db', () => ({
  db: {
    syncQueue: {
      toArray: vi.fn().mockResolvedValue([]),
      delete: vi.fn().mockResolvedValue(),
      put: vi.fn().mockResolvedValue()
    }
  }
}));

describe('syncService Background Sync', () => {
  beforeEach(async () => {
    await db.clearAll();
    vi.clearAllMocks();
  });

  it('should process sync queue items', async () => {
    // Add items to queue
    await db.addCrop({ id: 1, name: 'Wheat' });
    await db.addExpense({ id: 1, amount: 100 });

    // Mock fetch to simulate successful sync
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
    await syncService.syncData();

    // Verify queue is empty after sync
    const queue = await db.getSyncQueue();
    expect(queue.length).toBe(0);
  });

  it('should retain items on sync failure', async () => {
    await db.addCrop({ id: 1, name: 'Wheat' });

    // Mock db.removeSyncItem to simulate failure
    const originalRemove = db.removeSyncItem;
    db.removeSyncItem = vi.fn().mockRejectedValue(new Error('Network error'));

    await syncService.syncData();

    // Verify queue still has the item
    const queue = await db.getSyncQueue();
    expect(queue.length).toBe(1);
    
    // Restore
    db.removeSyncItem = originalRemove;
  });
});
