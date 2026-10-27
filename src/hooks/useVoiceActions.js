import { useEffect, useRef } from 'react';
import { registerVoiceAction } from '../services/voiceActionRegistry';

/**
 * Registers this page's voice-operable actions with Vani while mounted,
 * and unregisters them on unmount so Vani only ever "sees" what's
 * actually on screen right now.
 *
 * Usage:
 *   useVoiceActions([
 *     {
 *       id: 'crops.addCrop',
 *       description: 'Add a new crop to the farmer's crop list, given a crop name',
 *       params: { cropName: 'string, required' },
 *       destructive: false, // creates data but is easily undone/edited — not a hard delete/payment
 *       handler: ({ cropName }) => { ...actually add the crop, return a result... },
 *     },
 *     {
 *       id: 'crops.deleteCrop',
 *       description: 'Permanently delete a crop by name',
 *       params: { cropName: 'string, required' },
 *       destructive: true, // Vani will ask "did you mean to delete X? say yes" first
 *       handler: ({ cropName }) => { ... },
 *     },
 *   ], [cropsListDependency]);
 *
 * `handler` may be async and may return a string — if it does, that string
 * is spoken back to the farmer as confirmation of what happened (e.g.
 * "Added Tomato to your crops."). Throwing in a handler is caught by Vani
 * and spoken as a failure, so handlers don't need their own try/catch
 * purely for voice feedback.
 */
export function useVoiceActions(actions, deps = []) {
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const unregisterFns = actionsRef.current.map((action) =>
      registerVoiceAction({ ...action, handler: (params) => actionsRef.current.find((a) => a.id === action.id).handler(params) })
    );
    return () => unregisterFns.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
