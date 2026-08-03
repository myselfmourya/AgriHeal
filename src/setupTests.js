import '@testing-library/jest-dom';

// Mock matchMedia if it doesn't exist in JSDOM
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock localStorage and sessionStorage
const storageMock = (function () {
  let store = {};
  return {
    getItem: function (key) { return store[key] || null; },
    setItem: function (key, value) { store[key] = value.toString(); },
    clear: function () { store = {}; },
    removeItem: function (key) { delete store[key]; },
    key: function(index) { return Object.keys(store)[index] || null; },
    get length() { return Object.keys(store).length; }
  };
})();

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', { value: storageMock });
  Object.defineProperty(window, 'sessionStorage', { value: storageMock });
}

// Mock localforage for testing since jsdom doesn't support IndexedDB
vi.mock('localforage', () => {
  const createInstance = () => {
    const map = new Map();
    return {
      setItem: async (k, v) => { map.set(k, v); return v; },
      getItem: async (k) => map.get(k) || null,
      removeItem: async (k) => { map.delete(k); },
      clear: async () => { map.clear(); },
      iterate: async (cb) => {
        for (const [k, v] of map.entries()) {
          await cb(v, k);
        }
      }
    };
  };
  
  const defaultInstance = createInstance();
  return {
    default: {
      config: vi.fn(),
      createInstance: () => createInstance(),
      ...defaultInstance
    }
  };
});



