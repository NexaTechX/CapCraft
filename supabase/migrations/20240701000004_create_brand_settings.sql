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

-- Create RLS policies for brand_settings
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own brand settings" ON public.brand_settings;
CREATE POLICY "Users can view their own brand settings"
ON public.brand_settings FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own brand settings" ON public.brand_settings;
CREATE POLICY "Users can update their own brand settings"
ON public.brand_settings FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own brand settings" ON public.brand_settings;
CREATE POLICY "Users can insert their own brand settings"
ON public.brand_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.brand_settings;
