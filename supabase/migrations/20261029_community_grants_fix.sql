-- 20261028b_community_grants_fix.sql
--
-- 20261028_community_groups_events_images.sql's new tables (community_groups,
-- community_group_members, event_registrations) got RLS policies but never
-- the underlying SQL GRANTs to the anon/authenticated roles that PostgREST
-- (Supabase's Data API) also requires. Existing tables like community_posts
-- have these grants already (set up by Supabase at project init); plain
-- `CREATE TABLE` in a migration does not inherit them automatically, so
-- every request against the new tables returned 403 regardless of RLS.
-- RLS still narrows rows per-policy as before — this only restores the
-- table-level access PostgREST needs to even attempt a query.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_groups TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_group_members TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_registrations TO anon, authenticated;
