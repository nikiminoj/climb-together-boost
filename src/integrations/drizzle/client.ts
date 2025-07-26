
import { db } from '@/lib/db';
import { 
  products, 
  categories, 
  badges, 
  userBadges, 
  notifications, 
  productUpvotes,
  profiles,
  userRoles
} from '@/lib/schema';
import { eq, desc, and, gte, lt, arrayContains } from 'drizzle-orm';
import { supabase } from '@/integrations/supabase/client';

export async function getNotifications() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt));

    return result;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId));
    return true;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    return false;
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await db
      .delete(notifications)
      .where(eq(notifications.id, notificationId));
    return true;
  } catch (error) {
    console.error(`Error deleting notification ${notificationId}:`, error);
    return false;
  }
}

export async function getAllBadges() {
  try {
    const result = await db.select().from(badges);
    return result;
  } catch (error) {
    console.error('Error fetching all badges:', error);
    return [];
  }
}

export async function getUserBadges(userId: string) {
  try {
    const result = await db
      .select({
        id: userBadges.id,
        earnedAt: userBadges.earnedAt,
        badges: {
          id: badges.id,
          name: badges.name,
          description: badges.description,
          icon: badges.icon,
        },
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId));

    return result;
  } catch (error) {
    console.error(`Error fetching badges for user ${userId}:`, error);
    return [];
  }
}

export async function getCategories() {
  try {
    const result = await db.select().from(categories);
    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getProductsByCategory(categoryId: string, filters?: {
  isPromoted?: boolean;
  publishedDateRange?: 'today' | 'this-week' | 'this-month' | 'previous-month';
}) {
  try {
    let baseQuery = db.select().from(products);
    let conditions = [eq(products.category, categoryId)];

    // Apply filters
    if (filters?.isPromoted) {
      // Check if badges array contains promoted badges
      conditions.push(
        arrayContains(products.badges, ['Trending', 'Product of the Day', 'Hot'])
      );
    }

    if (filters?.publishedDateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (filters.publishedDateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'this-week':
          const dayOfWeek = now.getDay();
          startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'previous-month':
          const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          conditions.push(
            and(
              gte(products.createdAt, prevMonth),
              lt(products.createdAt, endPrevMonth)
            )
          );
          break;
      }

      if (filters.publishedDateRange !== 'previous-month') {
        conditions.push(gte(products.createdAt, startDate));
      }
    }

    const result = await baseQuery.where(and(...conditions));
    return result;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function getUserProfile(userId: string) {
  try {
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    return null;
  }
}

export async function getUserRole(userId: string) {
  try {
    const result = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId))
      .limit(1);

    return result[0]?.role || 'user';
  } catch (error) {
    console.error(`Error fetching user role for ${userId}:`, error);
    return 'user';
  }
}

export async function upvoteProduct(productId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if user already upvoted
    const existingUpvote = await db
      .select()
      .from(productUpvotes)
      .where(
        and(
          eq(productUpvotes.userId, user.id),
          eq(productUpvotes.productId, productId)
        )
      )
      .limit(1);

    if (existingUpvote.length === 0) {
      await db.insert(productUpvotes).values({
        userId: user.id,
        productId: productId,
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error upvoting product ${productId}:`, error);
    return false;
  }
}
