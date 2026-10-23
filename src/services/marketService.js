/**
 * Market Price Service
 * Fetches live mandi (APMC) prices via the Supabase `market-proxy` Edge
 * Function, which calls data.gov.in server-side using DATA_GOV_IN_API_KEY.
 * Returns [] on any failure — callers decide how to present "no live data"
 * (e.g. falling back to labeled reference prices), never fabricated numbers.
 */
import { supabase } from '../lib/supabase';

export const fetchMarketPrices = async (state = 'Telangana', commodity = null) => {
  try {
    const { data, error } = await supabase.functions.invoke('market-proxy', {
      body: { state, commodity },
    });
    if (error) throw error;

    const records = data?.records || [];
    return records.map(mapRecord).filter(Boolean);
  } catch (error) {
    console.warn('Live market price fetch failed:', error.message || error);
    return [];
  }
};

const mapRecord = (record) => {
  const price = parseInt(record.modal_price || record.min_price, 10);
  if (!price) return null;
  return {
    crop: record.commodity,
    price,
    minPrice: parseInt(record.min_price, 10) || price,
    maxPrice: parseInt(record.max_price, 10) || price,
    unit: 'Quintal',
    market: record.market,
    district: record.district,
    state: record.state,
    arrivalDate: record.arrival_date,
    source: 'data.gov.in (APMC)',
    timestamp: new Date().toISOString(),
  };
};
