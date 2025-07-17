-- Create the categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS) for categories
ALTER TABLE categories ENABLE RLS;

-- Policy to allow authenticated users to view all categories
CREATE POLICY select_categories ON categories FOR SELECT TO authenticated USING (true);