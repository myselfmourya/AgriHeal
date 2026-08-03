import useSWR from 'swr';
import { apiClient } from '../lib/apiClient';

/**
 * Custom hook wrapping SWR for API calls.
 * Implements stale-while-revalidate caching out-of-the-box.
 * 
 * @param {string|null} url - The API endpoint to fetch (pass null to pause fetching)
 * @param {Object} options - SWR configuration options
 * @returns {Object} { data, error, isLoading, isValidating, mutate }
 */
export function useApi(url, options = {}) {
  // Use our apiClient singleton as the default fetcher
  const fetcher = (fetchUrl) => apiClient.get(fetchUrl);

  const { data, error, mutate, isValidating } = useSWR(url, fetcher, {
    // Revalidate on focus ensures data stays fresh if user switches tabs
    revalidateOnFocus: true,
    // Add a reasonable deduping interval so rapid remounts don't trigger calls
    dedupingInterval: 2000,
    ...options,
  });

  return {
    data,
    error,
    isLoading: !error && !data && url !== null,
    isValidating,
    mutate
  };
}
