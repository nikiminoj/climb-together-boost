-- Create a table for user profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE UNIQUE,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE RLS;

-- Policy to allow authenticated users to view their own profile
CREATE POLICY select_profiles ON profiles FOR SELECT TO authenticated USING (id = auth.uid());

-- Policy to allow authenticated users to insert their own profile (happens on user creation)
CREATE POLICY insert_profiles ON profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Policy to allow authenticated users to update their own profile
CREATE POLICY update_profiles ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- Optional: Create a function to create a profile for new users
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS trigger AS $$
-- begin
--   insert into public.profiles (id, username)
--   values (new.id, new.raw_user_meta_data->>'username');
--   return new;
-- end;
-- $$ language plpgsql security definer;

-- Optional: Create a trigger to call the handle_new_user function on new user creation
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();