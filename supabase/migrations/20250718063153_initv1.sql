-- Enable RLS extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view all categories
-- CREATE POLICY select_categories ON categories FOR SELECT TO authenticated USING (true);

-- Create a table for user profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view their own profile
-- CREATE POLICY select_profiles ON profiles FOR SELECT TO authenticated USING (id = auth.uid());

-- Policy to allow authenticated users to insert their own profile
-- CREATE POLICY insert_profiles ON profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Policy to allow authenticated users to update their own profile
-- CREATE POLICY update_profiles ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- Create the products table
CREATE TABLE products (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(255) NOT NULL,
 description TEXT,
 image VARCHAR(255),
 author VARCHAR(255),
 points INTEGER DEFAULT 0,
 upvotes INTEGER DEFAULT 0,
 badges TEXT[],
 category VARCHAR(255),
 link VARCHAR(255),
 peer_push_points INTEGER DEFAULT 0,
 user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view all products
-- CREATE POLICY select_products ON products FOR SELECT TO authenticated USING (true);

-- Policy to allow authenticated users to insert their own products
-- CREATE POLICY insert_products ON products FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Policy to allow authenticated users to update their own products
-- CREATE POLICY update_products ON products FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Policy to allow authenticated users to delete their own products
-- CREATE POLICY delete_products ON products FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_products_author ON products (author);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_user_id ON products (user_id);

-- Create the notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  link TEXT
);

-- Enable Row Level Security (RLS) for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own notifications
-- CREATE POLICY select_notifications ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Policy to allow users to update their own notifications
-- CREATE POLICY update_notifications ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Policy to allow users to delete their own notifications
-- CREATE POLICY delete_notifications ON notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create the badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(255)
);

-- Enable Row Level Security (RLS) for badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view all badges
-- CREATE POLICY select_badges ON badges FOR SELECT TO authenticated USING (true);

-- Create the user_badges table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

-- Enable Row Level Security (RLS) for user_badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view their own user_badges
-- CREATE POLICY select_user_badges ON user_badges FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Create the tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL
);

-- Enable Row Level Security (RLS) for tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view all tags
-- CREATE POLICY select_tags ON tags FOR SELECT TO authenticated USING (true);

-- Create the product_tags join table
CREATE TABLE product_tags (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- Enable Row Level Security (RLS) for product_tags
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view all product_tags
-- CREATE POLICY select_product_tags ON product_tags FOR SELECT TO authenticated USING (true);

-- Create the product_upvotes table
CREATE TABLE product_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- Enable Row Level Security (RLS) for product_upvotes
ALTER TABLE product_upvotes ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert their own upvotes
-- CREATE POLICY insert_product_upvotes ON product_upvotes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Policy to allow authenticated users to view all upvotes
-- CREATE POLICY select_product_upvotes ON product_upvotes FOR SELECT TO authenticated USING (true);

-- Policy to allow authenticated users to delete their own upvotes
-- CREATE POLICY delete_product_upvotes ON product_upvotes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create function to handle upvotes
CREATE OR REPLACE FUNCTION handle_upvote(p_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO product_upvotes (user_id, product_id)
  VALUES (auth.uid(), p_product_id)
  ON CONFLICT (user_id, product_id) DO NOTHING;
END;
$$;