-- Create tables for the CapCraft AI application

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  subscription_status TEXT,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile settings table
CREATE TABLE IF NOT EXISTS profile_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  default_tone TEXT DEFAULT 'casual',
  default_language TEXT DEFAULT 'en',
  preferred_hashtags TEXT[] DEFAULT '{}',
  emoji_style TEXT DEFAULT 'moderate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved captions table
CREATE TABLE IF NOT EXISTS saved_captions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  text TEXT NOT NULL,
  tone TEXT,
  language TEXT,
  hashtags TEXT[],
  emojis TEXT[],
  scheduled_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instagram accounts table
CREATE TABLE IF NOT EXISTS instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  instagram_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  username TEXT NOT NULL,
  profile_picture_url TEXT,
  followers_count INTEGER,
  media_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Caption templates table
CREATE TABLE IF NOT EXISTS caption_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  category TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post analytics table
CREATE TABLE IF NOT EXISTS post_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES saved_captions(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption_id UUID REFERENCES saved_captions(id) ON DELETE CASCADE,
  instagram_account_id UUID REFERENCES instagram_accounts(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE caption_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profile settings policies
DROP POLICY IF EXISTS "Users can view their own settings" ON profile_settings;
CREATE POLICY "Users can view their own settings"
  ON profile_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own settings" ON profile_settings;
CREATE POLICY "Users can update their own settings"
  ON profile_settings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own settings" ON profile_settings;
CREATE POLICY "Users can insert their own settings"
  ON profile_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Saved captions policies
DROP POLICY IF EXISTS "Users can view their own captions" ON saved_captions;
CREATE POLICY "Users can view their own captions"
  ON saved_captions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own captions" ON saved_captions;
CREATE POLICY "Users can insert their own captions"
  ON saved_captions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own captions" ON saved_captions;
CREATE POLICY "Users can update their own captions"
  ON saved_captions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own captions" ON saved_captions;
CREATE POLICY "Users can delete their own captions"
  ON saved_captions FOR DELETE
  USING (auth.uid() = user_id);

-- Instagram accounts policies
DROP POLICY IF EXISTS "Users can view their own Instagram accounts" ON instagram_accounts;
CREATE POLICY "Users can view their own Instagram accounts"
  ON instagram_accounts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own Instagram accounts" ON instagram_accounts;
CREATE POLICY "Users can insert their own Instagram accounts"
  ON instagram_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own Instagram accounts" ON instagram_accounts;
CREATE POLICY "Users can update their own Instagram accounts"
  ON instagram_accounts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own Instagram accounts" ON instagram_accounts;
CREATE POLICY "Users can delete their own Instagram accounts"
  ON instagram_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Caption templates policies
DROP POLICY IF EXISTS "Users can view their own templates or public ones" ON caption_templates;
CREATE POLICY "Users can view their own templates or public ones"
  ON caption_templates FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can insert their own templates" ON caption_templates;
CREATE POLICY "Users can insert their own templates"
  ON caption_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own templates" ON caption_templates;
CREATE POLICY "Users can update their own templates"
  ON caption_templates FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own templates" ON caption_templates;
CREATE POLICY "Users can delete their own templates"
  ON caption_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Post analytics policies
DROP POLICY IF EXISTS "Users can view analytics for their own posts" ON post_analytics;
CREATE POLICY "Users can view analytics for their own posts"
  ON post_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM saved_captions
      WHERE saved_captions.id = post_id
      AND saved_captions.user_id = auth.uid()
    )
  );

-- Scheduled posts policies
DROP POLICY IF EXISTS "Users can view their own scheduled posts" ON scheduled_posts;
CREATE POLICY "Users can view their own scheduled posts"
  ON scheduled_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM saved_captions
      WHERE saved_captions.id = caption_id
      AND saved_captions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own scheduled posts" ON scheduled_posts;
CREATE POLICY "Users can insert their own scheduled posts"
  ON scheduled_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM saved_captions
      WHERE saved_captions.id = caption_id
      AND saved_captions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own scheduled posts" ON scheduled_posts;
CREATE POLICY "Users can update their own scheduled posts"
  ON scheduled_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM saved_captions
      WHERE saved_captions.id = caption_id
      AND saved_captions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own scheduled posts" ON scheduled_posts;
CREATE POLICY "Users can delete their own scheduled posts"
  ON scheduled_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM saved_captions
      WHERE saved_captions.id = caption_id
      AND saved_captions.user_id = auth.uid()
    )
  );

-- Enable realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table profile_settings;
alter publication supabase_realtime add table saved_captions;
alter publication supabase_realtime add table instagram_accounts;
alter publication supabase_realtime add table caption_templates;
alter publication supabase_realtime add table post_analytics;
alter publication supabase_realtime add table scheduled_posts;
