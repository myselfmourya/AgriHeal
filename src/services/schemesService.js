import { supabase } from '../lib/supabase';
import { filterSchemes } from '../data/schemesData';

export const fetchSchemes = async (profile) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn('Schemes Service: No active session, returning all schemes.');
    }

    // Give UI a small artificial delay to show a loading state, feels more dynamic
    await new Promise(resolve => setTimeout(resolve, 800));

    const schemesData = filterSchemes(profile);

    return {
      schemes: schemesData,
      source: 'local',
      timestamp: new Date().toISOString(),
      freshness: 'live'
    };

  } catch (error) {
    console.error('Schemes service failed:', error);
    throw error;
  }
};
