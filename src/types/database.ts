
// Updated database types to match Drizzle schema
export interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  author: string | null;
  points: number | null;
  upvotes: number | null;
  peerPushPoints: number | null;
  badges: string[] | null;
  category: string | null;
  link: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  upvoted_by_user?: boolean; // Added for ProductCard usage
}

export interface Category {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  icon: string | null;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string | null;
  message: string;
  type: string;
  read: boolean | null;
  link: string | null;
  createdAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string | null;
  badgeId: string | null;
  earnedAt: Date;
  badges: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface Profile {
  id: string;
  username: string | null;
  createdAt: Date;
}
