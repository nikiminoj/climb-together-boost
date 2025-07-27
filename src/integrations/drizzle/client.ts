
import { supabase } from '@/integrations/supabase/client';

export async function getNotifications() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    // Map snake_case to camelCase
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      message: item.message,
      type: item.type,
      read: item.read || false,
      link: item.link,
      createdAt: item.created_at ? new Date(item.created_at) : new Date()
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    return false;
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error deleting notification ${notificationId}:`, error);
    return false;
  }
}

export async function getAllBadges() {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*');

    if (error) {
      console.error('Error fetching all badges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all badges:', error);
    return [];
  }
}

export async function getUserBadges(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        id,
        earned_at,
        badges (
          id,
          name,
          description,
          icon
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error(`Error fetching badges for user ${userId}:`, error);
      return [];
    }

    // Map to match expected structure
    return (data || []).map(item => ({
      id: item.id,
      earnedAt: item.earned_at ? new Date(item.earned_at) : new Date(),
      badges: item.badges ? {
        id: item.badges.id,
        name: item.badges.name,
        description: item.badges.description,
        icon: item.badges.icon,
      } : { id: '', name: '', description: null, icon: null },
    }));
  } catch (error) {
    console.error(`Error fetching badges for user ${userId}:`, error);
    return [];
  }
}

export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    // Map snake_case to camelCase
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      icon: item.icon,
      createdAt: item.created_at ? new Date(item.created_at) : new Date()
    }));
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
    let query = supabase
      .from('products')
      .select('*')
      .eq('category', categoryId);

    // Apply date range filter
    if (filters?.publishedDateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (filters.publishedDateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          query = query.gte('created_at', startDate.toISOString());
          break;
        case 'this-week':
          const dayOfWeek = now.getDay();
          startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
          startDate.setHours(0, 0, 0, 0);
          query = query.gte('created_at', startDate.toISOString());
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          query = query.gte('created_at', startDate.toISOString());
          break;
        case 'previous-month':
          const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          query = query.gte('created_at', prevMonth.toISOString()).lt('created_at', endPrevMonth.toISOString());
          break;
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    let result = data || [];

    // Apply promoted filter (client-side since Supabase doesn't have array contains easily)
    if (filters?.isPromoted) {
      result = result.filter(product => {
        const badges = product.badges || [];
        return badges.some((badge: string) => ['Trending', 'Product of the Day', 'Hot'].includes(badge));
      });
    }

    // Map snake_case to camelCase
    return result.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      author: item.author,
      upvotes: item.upvotes || 0,
      points: item.points || 0,
      peerPushPoints: item.peer_push_points || 0,
      badges: item.badges,
      category: item.category,
      link: item.link,
      userId: item.user_id,
      createdAt: item.created_at ? new Date(item.created_at) : new Date(),
      updatedAt: item.updated_at ? new Date(item.updated_at) : new Date()
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error(`Error fetching user profile for ${userId}:`, error);
      return null;
    }

    return {
      id: data.id,
      username: data.username,
      createdAt: data.created_at ? new Date(data.created_at) : new Date()
    };
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    return null;
  }
}

export async function getUserRole(userId: string) {
  // Since user_roles table doesn't exist yet in Supabase types, return default role
  // TODO: Uncomment once user_roles table is added to Supabase
  /*
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(`Error fetching user role for ${userId}:`, error);
      return 'user';
    }

    return data?.role || 'user';
  } catch (error) {
    console.error(`Error fetching user role for ${userId}:`, error);
    return 'user';
  }
  */
  return 'user';
}

export async function generateAvailableUsername(email: string) {
  const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  let username = baseUsername;
  let counter = 1;

  // Check if username exists and increment if needed
  while (true) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (!data) {
      break; // Username is available
    }
    
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
}

export async function upvoteProduct(productId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if user already upvoted
    const { data: existingUpvote } = await supabase
      .from('product_upvotes')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (!existingUpvote) {
      const { error } = await supabase
        .from('product_upvotes')
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (error) {
        console.error(`Error upvoting product ${productId}:`, error);
        return false;
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error upvoting product ${productId}:`, error);
    return false;
  }
}
