import { supabase } from '../lib/supabase';
import { analyticsService } from './analyticsService';

export const communityService = {
  // Posts
  async getPosts() {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          user:user_id(
            id,
            raw_user_meta_data
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      analyticsService.trackEvent('FETCH_POSTS_FAILED', { error: error.message });
      throw error;
    }
  },

  async createPost(content, imageUrl = null) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          user_id: session.user.id,
          content,
          image_url: imageUrl
        }])
        .select()
        .single();

      if (error) throw error;
      analyticsService.trackEvent('POST_CREATED');
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      analyticsService.trackEvent('CREATE_POST_FAILED', { error: error.message });
      throw error;
    }
  },

  // Events
  async getEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .gte('date', new Date().toISOString());

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Learning Videos
  async getLearningVideos(category = null) {
    try {
      let query = supabase.from('learning_videos').select('*').order('created_at', { ascending: false });
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  async getGroups() {
    try {
      const { data, error } = await supabase.from('community_groups').select('*');
      if (error) return [];
      return data || [];
    } catch (error) { return []; }
  },
  async getFarmers() {
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(20);
      if (error) return [];
      return data || [];
    } catch (error) { return []; }
  }
};

