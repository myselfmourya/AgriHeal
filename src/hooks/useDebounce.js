import { useMemo, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

/**
 * Custom hook to debounce a callback function using lodash.
 * 
 * @param {Function} callback - The function to debounce
 * @param {number} delay - The debounce delay in milliseconds
 * @returns {Function} The debounced function
 */
export function useDebounceCallback(callback, delay = 500) {
  // Use ref to store the latest callback without triggering re-renders
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFunction = useMemo(
    () => debounce((...args) => callbackRef.current(...args), delay),
    [delay]
  );

  // Clean up the debounce timer on unmount
  useEffect(() => {
    return () => {
      debouncedFunction.cancel();
    };
  }, [debouncedFunction]);

  return debouncedFunction;
}

/**
 * Custom hook to debounce a value. Useful for delaying state updates
 * like search inputs until the user stops typing.
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - The debounce delay in milliseconds
 * @returns {any} The debounced value
 */
import { useState } from 'react';

export function useDebounceValue(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
