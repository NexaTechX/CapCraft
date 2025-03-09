-- Create profile_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profile_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  avatar_url TEXT,
  default_tone TEXT DEFAULT 'casual',
  default_language TEXT DEFAULT 'en',
  preferred_hashtags TEXT[] DEFAULT '{}',
  emoji_style TEXT DEFAULT 'moderate',
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create saved_captions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.saved_captions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  tone TEXT,
  language TEXT,
  hashtags TEXT[],
  emojis TEXT[],
  scheduled_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scheduled_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caption_id UUID REFERENCES public.saved_captions(id),
  platform TEXT DEFAULT 'instagram',
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create brand_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.brand_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT DEFAULT 'My Brand',
  default_tone TEXT DEFAULT 'casual',
  default_language TEXT DEFAULT 'en',
  preferred_hashtags TEXT[] DEFAULT '{}',
  emoji_style TEXT DEFAULT 'moderate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT,
  avatar_url TEXT,
  subscription_status TEXT,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create instagram_accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.instagram_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  instagram_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  username TEXT NOT NULL,
  profile_picture_url TEXT,
  followers_count INTEGER,
  media_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own profile settings" ON public.profile_settings;
CREATE POLICY "Users can view their own profile settings"
ON public.profile_settings FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile settings" ON public.profile_settings;
CREATE POLICY "Users can update their own profile settings"
ON public.profile_settings FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile settings" ON public.profile_settings;
CREATE POLICY "Users can insert their own profile settings"
ON public.profile_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add similar policies for other tables
DROP POLICY IF EXISTS "Users can view their own saved captions" ON public.saved_captions;
CREATE POLICY "Users can view their own saved captions"
ON public.saved_captions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved captions" ON public.saved_captions;
CREATE POLICY "Users can insert their own saved captions"
ON public.saved_captions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own saved captions" ON public.saved_captions;
CREATE POLICY "Users can update their own saved captions"
ON public.saved_captions FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved captions" ON public.saved_captions;
CREATE POLICY "Users can delete their own saved captions"
ON public.saved_captions FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_captions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.brand_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.instagram_accounts;