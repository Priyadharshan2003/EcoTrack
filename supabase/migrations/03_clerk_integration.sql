-- 1. Create Clerk integration function
CREATE OR REPLACE FUNCTION public.requesting_user_id()
RETURNS text AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ LANGUAGE sql STABLE;

-- 2. Drop the trigger that creates users automatically in Supabase (Clerk will handle this, or we can just rely on the table having data if we sync)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Modify public.profiles to drop the foreign key constraint and change to text
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- We need to drop all foreign keys pointing to public.profiles(id) before altering the type
ALTER TABLE public.carbon_actions DROP CONSTRAINT IF EXISTS carbon_actions_user_id_fkey;
ALTER TABLE public.carbon_summaries DROP CONSTRAINT IF EXISTS carbon_summaries_user_id_fkey;
ALTER TABLE public.user_badges DROP CONSTRAINT IF EXISTS user_badges_user_id_fkey;

-- Also ai_insights_cache if it exists and has fkey
-- Actually ai_insights_cache didn't have an explicit fkey in 01_summary_and_cache, but it uses user_id

-- Alter columns from uuid to text
ALTER TABLE public.profiles ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE public.carbon_actions ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE public.carbon_summaries ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE public.user_badges ALTER COLUMN user_id TYPE text USING user_id::text;

-- Re-add foreign keys
ALTER TABLE public.carbon_actions ADD CONSTRAINT carbon_actions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.carbon_summaries ADD CONSTRAINT carbon_summaries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.user_badges ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- If ai_insights_cache and carbon_summary were created in 01_summary_and_cache
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'carbon_summary' AND column_name = 'user_id') THEN
    ALTER TABLE public.carbon_summary ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'ai_insights_cache' AND column_name = 'user_id') THEN
    ALTER TABLE public.ai_insights_cache ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END $$;

-- 4. Re-write all RLS policies to use requesting_user_id()
-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (requesting_user_id() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (requesting_user_id() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (requesting_user_id() = id);

-- Carbon Actions
DROP POLICY IF EXISTS "Users can view own actions" ON public.carbon_actions;
DROP POLICY IF EXISTS "Users can insert own actions" ON public.carbon_actions;
DROP POLICY IF EXISTS "Users can delete own actions" ON public.carbon_actions;
CREATE POLICY "Users can view own actions" ON public.carbon_actions FOR SELECT USING (requesting_user_id() = user_id);
CREATE POLICY "Users can insert own actions" ON public.carbon_actions FOR INSERT WITH CHECK (requesting_user_id() = user_id);
CREATE POLICY "Users can delete own actions" ON public.carbon_actions FOR DELETE USING (requesting_user_id() = user_id);

-- Carbon Summaries
DROP POLICY IF EXISTS "Users can view own summaries" ON public.carbon_summaries;
DROP POLICY IF EXISTS "Users can insert own summaries" ON public.carbon_summaries;
DROP POLICY IF EXISTS "Users can update own summaries" ON public.carbon_summaries;
CREATE POLICY "Users can view own summaries" ON public.carbon_summaries FOR SELECT USING (requesting_user_id() = user_id);
CREATE POLICY "Users can insert own summaries" ON public.carbon_summaries FOR INSERT WITH CHECK (requesting_user_id() = user_id);
CREATE POLICY "Users can update own summaries" ON public.carbon_summaries FOR UPDATE USING (requesting_user_id() = user_id);

-- User Badges
DROP POLICY IF EXISTS "Users can view own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (requesting_user_id() = user_id);
CREATE POLICY "Users can insert own badges" ON public.user_badges FOR INSERT WITH CHECK (requesting_user_id() = user_id);
