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
ALTER TABLE notifications ENABLE RLS;

-- Policy to allow users to view their own notifications
CREATE POLICY select_notifications ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Policy to allow users to update their own notifications (e.g., mark as read)
CREATE POLICY update_notifications ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Policy to allow users to delete their own notifications
CREATE POLICY delete_notifications ON notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create the badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(255) -- e.g., a path to an icon image or a class name
);

-- Enable Row Level Security (RLS) for badges
ALTER TABLE badges ENABLE RLS;

-- Policy to allow authenticated users to view all badges
CREATE POLICY select_badges ON badges FOR SELECT TO authenticated USING (true);

-- Create the user_badges table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, badge_id) -- Ensure a user can only earn a specific badge once
);

-- Enable Row Level Security (RLS) for user_badges
ALTER TABLE user_badges ENABLE RLS;

-- Policy to allow authenticated users to view their own user_badges
CREATE POLICY select_user_badges ON user_badges FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Assuming 'products' table already exists, alter it to add ranking columns
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
 -- Add timestamps for created and updated at
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create an index on the author column for faster lookups
CREATE INDEX idx_products_author ON products (author);

-- Optional: Create an index on the category column for faster lookups
CREATE INDEX idx_products_category ON products (category);
-- If your products table has a different structure, you'll need to adjust this.
ALTER TABLE products
ADD COLUMN peer_push_points INTEGER DEFAULT 0,
ADD COLUMN upvotes INTEGER DEFAULT 0;

-- Create the product_upvotes table
CREATE TABLE product_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, product_id) -- Ensure a user can only upvote a product once
);

-- Enable Row Level Security (RLS) for product_upvotes
ALTER TABLE product_upvotes ENABLE RLS;

-- Policy to allow authenticated users to insert their own upvotes
CREATE POLICY insert_product_upvotes ON product_upvotes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Policy to allow authenticated users to view all upvotes (optional, depending on your needs)
-- CREATE POLICY select_product_upvotes ON product_upvotes FOR SELECT TO authenticated USING (true);

-- Policy to allow authenticated users to delete their own upvotes (for unvoting)
CREATE POLICY delete_product_upvotes ON product_upvotes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION handle_upvote(p_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert a new record into product_upvotes
  INSERT INTO product_upvotes (user_id, product_id)
  VALUES (auth.uid(), p_product_id)
  ON CONFLICT (user_id, product_id) DO NOTHING; -- Prevent duplicate upvotes

  -- Note: The products.upvotes count will be updated by a trigger, not here.
END;
$$;

CREATE OR REPLACE FUNCTION handle_upvote(p_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert a new record into product_upvotes
  INSERT INTO product_upvotes (user_id, product_id)
  VALUES (auth.uid(), p_product_id)
  ON CONFLICT (user_id, product_id) DO NOTHING; -- Prevent duplicate upvotes

  -- Note: The products.upvotes count will be updated by a trigger, not here.
END;
$$;
