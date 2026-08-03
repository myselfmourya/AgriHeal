import '@testing-library/jest-dom';

// ── Storage mock (jsdom doesn't expose localStorage on globalThis by default) ──
const storageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] ?? null,
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: storageMock, writable: true });

// Mock import.meta.env for tests
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        DEV: true,
        PROD: false,
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key',
        VITE_LIVEKIT_URL: 'wss://test.livekit.cloud',
        VITE_WEATHER_API_KEY: 'test-weather-key',
        VITE_APP_ENV: 'test',
        VITE_DEFAULT_LANGUAGE: 'en-IN',
      },
    },
  },
  writable: true,
});

// Silence console.warn in tests unless explicitly needed
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = (...args) => {
    if (args[0]?.includes?.('[AI Provider]') || args[0]?.includes?.('[Vani]')) return;
    originalWarn(...args);
  };
});

afterEach(() => {
  console.warn = originalWarn;
});
