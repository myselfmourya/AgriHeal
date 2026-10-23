-- 20261023_community_fixes.sql
--
-- NOTE: the live database's actual schema has drifted from the earlier
-- committed migrations (20260728/20260729/20260730) — those describe
-- `profiles`, `expenses`, `experts`, `bookings`, `events`, `learning_videos`,
-- `equipment_records` etc. which do NOT exist in the live project. The real
-- live schema instead has a simpler, already-working set of tables:
-- farmers, crops, livestock, vendors, community_posts — all keyed by
-- `farmers.id = auth.uid()` (set explicitly on upsert in ProfileSetup.jsx),
-- not by a formal FK to auth.users or to a `profiles` table.
--
-- This migration adds what the real Community feature needs on top of the
-- REAL `community_posts` table (id, author_name, author_avatar, content,
-- likes, tags, created_at) — an author link for ownership, plus comments
-- and likes tables, following the same `farmer_id`-style convention used
-- by crops/livestock.

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.farmers(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS community_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES public.farmers(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  is_ai boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all public" ON community_comments FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS community_post_likes (
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES public.farmers(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, author_id)
);

ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all public" ON community_post_likes FOR ALL USING (true) WITH CHECK (true);

-- Keep community_posts.likes in sync with community_post_likes rows.
CREATE OR REPLACE FUNCTION community_posts_sync_likes() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET likes = COALESCE(likes, 0) + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET likes = GREATEST(COALESCE(likes, 1) - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_community_post_likes_sync ON community_post_likes;
CREATE TRIGGER trg_community_post_likes_sync
AFTER INSERT OR DELETE ON community_post_likes
FOR EACH ROW EXECUTE PROCEDURE community_posts_sync_likes();
