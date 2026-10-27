/**
 * Voice Action Registry
 * A module-level singleton (not React state) so it can be read from
 * VaniContext — which lives above the router and doesn't know which page
 * is mounted — while pages register/unregister their own actions as they
 * mount/unmount via the useVoiceActions hook.
 *
 * Each registered action describes itself in plain language so Vani's AI
 * can match a farmer's natural-language request to the right action and
 * the right parameters, instead of requiring fixed command phrases.
 */

const registry = new Map(); // id -> { id, description, params, destructive, handler }
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn());

export const registerVoiceAction = (action) => {
  if (!action?.id || typeof action.handler !== 'function') {
    throw new Error('registerVoiceAction requires { id, handler }');
  }
  registry.set(action.id, {
    description: '',
    params: {},
    destructive: false,
    ...action,
  });
  notify();
  return () => {
    registry.delete(action.id);
    notify();
  };
};

export const getVoiceActions = () => Array.from(registry.values());

/** Plain-language list for the AI prompt: id, what it does, what params it takes. */
export const describeVoiceActions = () =>
  getVoiceActions().map((a) => ({
    id: a.id,
    description: a.description,
    params: a.params,
    destructive: a.destructive,
  }));

export const getVoiceAction = (id) => registry.get(id);

export const subscribeVoiceActions = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
