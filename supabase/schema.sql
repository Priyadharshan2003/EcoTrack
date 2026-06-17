-- Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Carbon Actions table
CREATE TABLE IF NOT EXISTS public.carbon_actions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL, -- 'Transport', 'Energy', 'Food', 'Shopping'
  subcategory text NOT NULL,
  distance_km numeric,
  value numeric,
  co2_kg numeric NOT NULL,
  logged_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Carbon Summaries table
CREATE TABLE IF NOT EXISTS public.carbon_summaries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  total_co2_kg numeric NOT NULL,
  UNIQUE(user_id, date)
);

-- Create User Badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id text NOT NULL,
  earned_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Carbon Actions Policies
CREATE POLICY "Users can view own actions" 
ON public.carbon_actions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own actions" 
ON public.carbon_actions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own actions" 
ON public.carbon_actions FOR DELETE USING (auth.uid() = user_id);

-- Carbon Summaries Policies
CREATE POLICY "Users can view own summaries" 
ON public.carbon_summaries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own summaries" 
ON public.carbon_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own summaries" 
ON public.carbon_summaries FOR UPDATE USING (auth.uid() = user_id);

-- User Badges Policies
CREATE POLICY "Users can view own badges" 
ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" 
ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
