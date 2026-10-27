/**
 * Satellite Service
 * Fetches real vegetation-health (NDVI) data via the Supabase `satellite-proxy`
 * Edge Function, which queries Microsoft Planetary Computer's public Sentinel-2
 * catalog server-side.
 */
import { supabase } from '../lib/supabase';

/**
 * Fetch NDVI (vegetation health) for a farm location.
 * Returns { ndvi, sceneDate, cloudCover, itemId }.
 */
export const fetchVegetationHealth = async (lat, lon) => {
  const { data, error } = await supabase.functions.invoke('satellite-proxy', { body: { lat, lon } });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};
