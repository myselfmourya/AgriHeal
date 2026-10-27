-- Applied 2026-10-27 to the live AgriHeal DB.
--
-- Problem: every one of these 7 tables currently had a single RLS policy
-- called "Allow all public":
--   using (true) with check (true) to public, for ALL commands
-- "to public" means literally anyone, including unauthenticated requests.
-- Combined with "using (true)", this grants full read/write access to
-- every row to every visitor, once Data API exposure is turned back on.
--
-- This migration drops that blanket policy on each table and replaces it
-- with policies scoped to the owning user (verified against the live
-- schema via `supabase db query`), matching what the app's own code
-- actually relies on (src/services/*.js, src/contexts/FarmerContext.jsx).
--
-- Run this BEFORE re-enabling "Exposed tables" in Data API settings.

-- ============================================================
-- farmers (id = auth.uid(); already has correct scoped policies
-- alongside the dangerous one — only the blanket policy is removed)
-- ============================================================
drop policy if exists "Allow all public" on public.farmers;
-- Existing policies kept as-is:
--   "Users can view own farmer row"   (SELECT, authenticated, auth.uid() = id)
--   "Users can insert own farmer row" (INSERT, authenticated, auth.uid() = id)
--   "Users can update own farmer row" (UPDATE, authenticated, auth.uid() = id)
--   "Users can delete own farmer row" (DELETE, authenticated, auth.uid() = id)
--   "Users can manage own profile"    (ALL,    public,        auth.uid() = id)

-- ============================================================
-- crops (owned via farmer_id -> farmers.id = auth.uid())
-- ============================================================
drop policy if exists "Allow all public" on public.crops;

drop policy if exists "Users can view own crops" on public.crops;
create policy "Users can view own crops"
  on public.crops for select
  to authenticated
  using (auth.uid() = farmer_id);

drop policy if exists "Users can insert own crops" on public.crops;
create policy "Users can insert own crops"
  on public.crops for insert
  to authenticated
  with check (auth.uid() = farmer_id);

drop policy if exists "Users can update own crops" on public.crops;
create policy "Users can update own crops"
  on public.crops for update
  to authenticated
  using (auth.uid() = farmer_id)
  with check (auth.uid() = farmer_id);

drop policy if exists "Users can delete own crops" on public.crops;
create policy "Users can delete own crops"
  on public.crops for delete
  to authenticated
  using (auth.uid() = farmer_id);

-- ============================================================
-- livestock (owned via farmer_id -> farmers.id = auth.uid())
-- ============================================================
drop policy if exists "Allow all public" on public.livestock;

drop policy if exists "Users can view own livestock" on public.livestock;
create policy "Users can view own livestock"
  on public.livestock for select
  to authenticated
  using (auth.uid() = farmer_id);

drop policy if exists "Users can insert own livestock" on public.livestock;
create policy "Users can insert own livestock"
  on public.livestock for insert
  to authenticated
  with check (auth.uid() = farmer_id);

drop policy if exists "Users can update own livestock" on public.livestock;
create policy "Users can update own livestock"
  on public.livestock for update
  to authenticated
  using (auth.uid() = farmer_id)
  with check (auth.uid() = farmer_id);

drop policy if exists "Users can delete own livestock" on public.livestock;
create policy "Users can delete own livestock"
  on public.livestock for delete
  to authenticated
  using (auth.uid() = farmer_id);

-- ============================================================
-- vendors (no owner column — shared read-only directory.
-- src/services/vendorsService.js never inserts/updates/deletes,
-- so no write policy is added; writes are blocked by default.)
-- ============================================================
drop policy if exists "Allow all public" on public.vendors;

drop policy if exists "Anyone can view vendors" on public.vendors;
create policy "Anyone can view vendors"
  on public.vendors for select
  using (true);

-- ============================================================
-- community_posts (owned via author_id; public read feed —
-- matches src/services/communityService.js createPost())
-- ============================================================
drop policy if exists "Allow all public" on public.community_posts;

drop policy if exists "Anyone can view posts" on public.community_posts;
create policy "Anyone can view posts"
  on public.community_posts for select
  using (true);

drop policy if exists "Users can create own posts" on public.community_posts;
create policy "Users can create own posts"
  on public.community_posts for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "Users can update own posts" on public.community_posts;
create policy "Users can update own posts"
  on public.community_posts for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Users can delete own posts" on public.community_posts;
create policy "Users can delete own posts"
  on public.community_posts for delete
  to authenticated
  using (auth.uid() = author_id);

-- ============================================================
-- community_comments (owned via author_id; public read —
-- matches communityService.js addComment(), including the
-- is_ai=true "Vani AI" comments, which are still inserted
-- under the real logged-in user's session/author_id)
-- ============================================================
drop policy if exists "Allow all public" on public.community_comments;

drop policy if exists "Anyone can view comments" on public.community_comments;
create policy "Anyone can view comments"
  on public.community_comments for select
  using (true);

drop policy if exists "Users can create own comments" on public.community_comments;
create policy "Users can create own comments"
  on public.community_comments for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "Users can update own comments" on public.community_comments;
create policy "Users can update own comments"
  on public.community_comments for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Users can delete own comments" on public.community_comments;
create policy "Users can delete own comments"
  on public.community_comments for delete
  to authenticated
  using (auth.uid() = author_id);

-- ============================================================
-- community_post_likes (owned via author_id; public read so
-- like counts/who-liked can be shown; no update needed —
-- matches communityService.js toggleLike(), which inserts to
-- like and deletes to unlike)
-- ============================================================
drop policy if exists "Allow all public" on public.community_post_likes;

drop policy if exists "Anyone can view likes" on public.community_post_likes;
create policy "Anyone can view likes"
  on public.community_post_likes for select
  using (true);

drop policy if exists "Users can like posts" on public.community_post_likes;
create policy "Users can like posts"
  on public.community_post_likes for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "Users can unlike own likes" on public.community_post_likes;
create policy "Users can unlike own likes"
  on public.community_post_likes for delete
  to authenticated
  using (auth.uid() = author_id);
