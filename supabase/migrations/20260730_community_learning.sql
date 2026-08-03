-- 20260730_community_learning.sql

-- Community Posts
CREATE TABLE community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  type TEXT CHECK (type IN ('Workshop', 'Market', 'Meeting', 'Other')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Videos
CREATE TABLE learning_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INT, -- in seconds
  category TEXT,
  tags TEXT[],
  language TEXT DEFAULT 'en-IN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Livestock Records
CREATE TABLE livestock_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_type TEXT NOT NULL,
  count INT DEFAULT 1,
  health_status TEXT,
  last_vaccination DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Records
CREATE TABLE equipment_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('Active', 'Maintenance', 'Broken')),
  last_service DATE,
  next_service DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_records ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read community_posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read learning_videos" ON learning_videos FOR SELECT USING (true);

-- Insert policies (authenticated)
CREATE POLICY "Users can insert community_posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert livestock" ON livestock_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert equipment" ON equipment_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update policies
CREATE POLICY "Users can update own community_posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can update own livestock" ON livestock_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can update own equipment" ON equipment_records FOR UPDATE USING (auth.uid() = user_id);

-- Delete policies
CREATE POLICY "Users can delete own community_posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own livestock" ON livestock_records FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own equipment" ON equipment_records FOR DELETE USING (auth.uid() = user_id);

-- Only user can read own records
CREATE POLICY "Users can read own livestock" ON livestock_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own equipment" ON equipment_records FOR SELECT USING (auth.uid() = user_id);
