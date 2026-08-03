import { supabase } from '../lib/supabase';

export const expertsService = {
  getExperts: async () => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          id,
          name,
          specialty,
          experience_years,
          rating,
          hourly_rate,
          language,
          profile_image_url
        `)
        .eq('verified', true);
        
      if (error) throw error;
      
      // Transform slightly to match component expectations
      return data.map(exp => ({
        id: exp.id,
        name: exp.name,
        specialty: exp.specialty,
        experience: `${exp.experience_years} Years`,
        rating: exp.rating || 4.5,
        fee: exp.hourly_rate || 200,
        languages: exp.language || ['English'],
        image: exp.profile_image_url || 'https://i.pravatar.cc/150?img=11',
        availability: exp.availability || []
      }));
    } catch (err) {
      console.error('Error fetching experts from Supabase:', err);
      return [];
    }
  },

  bookConsultation: async (expertId, slot) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      // In a real app, you would parse the slot into a proper timestamp
      const scheduledAt = new Date();
      scheduledAt.setHours(scheduledAt.getHours() + 24); // book 24h from now

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          farmer_id: session.user.id,
          expert_id: expertId,
          scheduled_at: scheduledAt.toISOString(),
          status: 'scheduled'
        })
        .select()
        .single();
        
      if (error) throw error;

      return {
        success: true,
        bookingId: data.id,
        slot: slot,
        status: data.status
      };
    } catch (err) {
      console.error('Booking failed:', err);
      throw err;
    }
  },
  
  getTeleconsultationToken: async (roomName, participantName) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/livekit-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ roomName, participantName })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch teleconsultation token");
      }

      const { token } = await response.json();
      return token;
    } catch (err) {
      console.error('Token fetch failed:', err);
      throw err;
    }
  }
};
