// src/types/database.ts

export interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  author: string | null;
  points: number;
  upvotes: number;
  badges: string[] | null;
  category: string | null; // Assuming category is stored as text or category ID, adjust if using foreign key relationship directly
  link: string | null;
  created_at: string;
  updated_at: string;
  peer_push_points: number;
  upvoted_by_user?: boolean; // Added based on ProductCard usage
  // Add other product fields as needed based on your schema
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}