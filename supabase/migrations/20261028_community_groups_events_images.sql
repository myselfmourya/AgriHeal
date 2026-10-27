-- 20261028_community_groups_events_images.sql
--
-- Finishes the real Community backend: the Groups and Farmers/Connect tabs
-- in src/pages/CommunityPage.jsx are still 100% client-side mock state
-- (join/register toggles reset on reload, nothing persisted), and
-- community_posts has no column for an attached photo. This migration adds:
--   - community_groups + community_group_members (persisted join/leave)
--   - event_registrations (persisted event signup, keyed by event id text
--     since there is no `events` table live yet — see 20261023's own note
--     that `events` may not exist; registrations are keyed loosely by
--     event_id text so this works whether or not that table exists)
--   - community_posts.image_url (nullable; populated by a new Storage
--     bucket upload from CreatePostModal)
--
-- Follows the same auth.uid()-scoped RLS convention as 20261027_fix_rls_policies.sql.

-- ============================================================
-- community_posts: optional attached photo
-- ============================================================
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS image_url text;

-- ============================================================
-- community_groups (shared directory, seeded manually/by admins;
-- app code never inserts/updates/deletes groups themselves)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  emoji text DEFAULT '🌾',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view groups" ON community_groups;
CREATE POLICY "Anyone can view groups"
  ON community_groups FOR SELECT
  USING (true);

-- Seed the same topic taxonomy CommunityPage.jsx's GROUPS fallback array
-- used, minus its fabricated "12.5k members" style counts — real member
-- counts are now computed live from community_group_members.
INSERT INTO community_groups (name, emoji, description) VALUES
  ('Paddy Farmers India', '🌾', 'Best practices for rice cultivation across India'),
  ('Organic Farming Network', '🌱', 'Chemical-free, sustainable farming techniques'),
  ('Dairy & Livestock', '🐄', 'Cattle care, milk yield, animal health'),
  ('Vegetable Growers', '🍅', 'Seasonal vegetables, pricing, market tips'),
  ('Telangana Kisan Sabha', '📍', 'Local farmers network — Warangal & Karimnagar'),
  ('Medicinal Plants', '🌿', 'Turmeric, Aloe vera, Ashwagandha cultivation')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- community_group_members (join/leave, owned via member_id)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_group_members (
  group_id uuid REFERENCES community_groups(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES public.farmers(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (group_id, member_id)
);

ALTER TABLE community_group_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view group membership" ON community_group_members;
CREATE POLICY "Anyone can view group membership"
  ON community_group_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can join groups" ON community_group_members;
CREATE POLICY "Users can join groups"
  ON community_group_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can leave groups" ON community_group_members;
CREATE POLICY "Users can leave groups"
  ON community_group_members FOR DELETE
  TO authenticated
  USING (auth.uid() = member_id);

-- ============================================================
-- event_registrations (owned via member_id; event_id is loosely
-- typed as text, not an FK, since the `events` table's live
-- existence is unconfirmed per 20261023_community_fixes.sql)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_registrations (
  event_id text NOT NULL,
  member_id uuid REFERENCES public.farmers(id) ON DELETE CASCADE NOT NULL,
  registered_at timestamptz DEFAULT now(),
  PRIMARY KEY (event_id, member_id)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view event registrations" ON event_registrations;
CREATE POLICY "Anyone can view event registrations"
  ON event_registrations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can register for events" ON event_registrations;
CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can unregister from events" ON event_registrations;
CREATE POLICY "Users can unregister from events"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = member_id);

-- ============================================================
-- Storage bucket for post photos. Public read (posts are a public
-- feed); upload/delete restricted to files under the uploader's own
-- auth.uid() folder prefix, e.g. "<uid>/<timestamp>-photo.jpg".
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-post-images', 'community-post-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view post images" ON storage.objects;
CREATE POLICY "Anyone can view post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community-post-images');

DROP POLICY IF EXISTS "Users can upload own post images" ON storage.objects;
CREATE POLICY "Users can upload own post images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'community-post-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own post images" ON storage.objects;
CREATE POLICY "Users can delete own post images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'community-post-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
