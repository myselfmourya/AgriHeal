import { supabase } from '../lib/supabase';
import { analyticsService } from './analyticsService';

export const communityService = {
  // Posts — community_posts is keyed by author_id = auth.uid() (set explicitly
  // on write, same convention as crops.farmer_id / livestock.farmer_id). The
  // display name/avatar are denormalized onto the post itself, so reads need
  // no join.
  async getPosts() {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('id, author_id, author_name, author_avatar, content, likes, tags, image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      analyticsService.trackEvent('FETCH_POSTS_FAILED', { error: error.message });
      throw error;
    }
  },

  async createPost(content, category = 'Question', { authorName = 'Farmer', authorAvatar = null, imageUrl = null } = {}) {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          author_id: session?.user?.id || null,
          author_name: authorName,
          author_avatar: authorAvatar,
          content,
          tags: [category],
          image_url: imageUrl,
        }])
        .select('id, author_id, author_name, author_avatar, content, likes, tags, image_url, created_at')
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

  async getComments(postId) {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select('id, author_id, author_name, content, is_ai, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  async addComment(postId, content, { isAi = false, authorName = 'Farmer' } = {}) {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase
        .from('community_comments')
        .insert([{
          post_id: postId,
          author_id: session?.user?.id || null,
          author_name: isAi ? 'Vani AI' : authorName,
          content,
          is_ai: isAi,
        }])
        .select('id, author_id, author_name, content, is_ai, created_at')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  async toggleLike(postId) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const userId = session.user.id;

      const { data: existing } = await supabase
        .from('community_post_likes')
        .select('post_id')
        .eq('post_id', postId)
        .eq('author_id', userId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('community_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('author_id', userId);
        if (error) throw error;
        return { liked: false };
      }

      const { error } = await supabase
        .from('community_post_likes')
        .insert([{ post_id: postId, author_id: userId }]);
      if (error) throw error;
      return { liked: true };
    } catch (error) {
      console.error('Error toggling like:', error);
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
      // community_group_members(count) asks PostgREST for a per-group row
      // count via the FK relationship, so member counts are real, not fabricated.
      const { data, error } = await supabase
        .from('community_groups')
        .select('id, name, emoji, description, community_group_members(count)')
        .order('name', { ascending: true });
      if (error) return [];
      return (data || []).map((g) => ({
        id: g.id,
        name: g.name,
        emoji: g.emoji,
        desc: g.description,
        members: g.community_group_members?.[0]?.count ?? 0,
      }));
    } catch (error) { return []; }
  },

  async getMyGroupIds() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from('community_group_members')
        .select('group_id')
        .eq('member_id', session.user.id);
      if (error) return [];
      return (data || []).map((r) => r.group_id);
    } catch (error) { return []; }
  },

  async joinGroup(groupId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('community_group_members')
      .insert([{ group_id: groupId, member_id: session.user.id }]);
    if (error) throw error;
  },

  async leaveGroup(groupId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('community_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('member_id', session.user.id);
    if (error) throw error;
  },

  async getFarmers() {
    try {
      const { data, error } = await supabase.from('farmers').select('*').limit(20);
      if (error) return [];
      return data || [];
    } catch (error) { return []; }
  },

  async getMyEventRegistrations() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('member_id', session.user.id);
      if (error) return [];
      return (data || []).map((r) => r.event_id);
    } catch (error) { return []; }
  },

  async registerForEvent(eventId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('event_registrations')
      .insert([{ event_id: String(eventId), member_id: session.user.id }]);
    if (error) throw error;
  },

  async unregisterFromEvent(eventId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', String(eventId))
      .eq('member_id', session.user.id);
    if (error) throw error;
  },

  // Uploads a post photo to the public community-post-images bucket under
  // the current user's own folder (required by the bucket's RLS policy),
  // and returns its public URL.
  async uploadPostImage(file) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('community-post-images')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;

    const { data } = supabase.storage.from('community-post-images').getPublicUrl(path);
    return data.publicUrl;
  },
};

