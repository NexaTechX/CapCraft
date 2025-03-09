-- Fix profile_settings table columns
ALTER TABLE IF EXISTS public.profile_settings
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create RLS policies for profile_settings
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

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

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_settings;
