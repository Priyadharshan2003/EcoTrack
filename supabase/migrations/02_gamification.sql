-- Add points to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points integer DEFAULT 0;

-- Function to calculate points when an action is logged
CREATE OR REPLACE FUNCTION public.calculate_action_points()
RETURNS trigger AS $$
DECLARE
  earned_points integer := 10; -- Base points for taking action
BEGIN
  -- Reward lower emission actions with bonus points
  IF new.co2_kg < 2.0 THEN
    earned_points := earned_points + 5;
  END IF;

  -- Update the user's total points
  UPDATE public.profiles
  SET points = points + earned_points,
      updated_at = timezone('utc'::text, now())
  WHERE id = new.user_id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the point calculation after a carbon action is inserted
DROP TRIGGER IF EXISTS on_carbon_action_insert ON public.carbon_actions;
CREATE TRIGGER on_carbon_action_insert
  AFTER INSERT ON public.carbon_actions
  FOR EACH ROW EXECUTE FUNCTION public.calculate_action_points();
