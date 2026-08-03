// Lightweight Supabase mock for unit tests.
// Prevents tests from needing a real @supabase/supabase-js package or network.
import { vi } from 'vitest';

export const createClient = vi.fn(() => ({
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: { text: 'mocked response' }, error: null }),
  },
  from: vi.fn(() => ({
    insert: vi.fn().mockResolvedValue({ error: null }),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
}));
