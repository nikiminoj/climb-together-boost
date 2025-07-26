
import { Notification } from '@/types/database';

// Map Drizzle notification to Supabase format for compatibility
export const mapNotificationToSupabaseFormat = (notification: Notification) => {
  return {
    id: notification.id,
    user_id: notification.userId || '',
    message: notification.message,
    type: notification.type,
    read: notification.read,
    link: notification.link,
    created_at: notification.createdAt.toISOString(),
  };
};

export const mapNotificationsToSupabaseFormat = (notifications: Notification[]) => {
  return notifications.map(mapNotificationToSupabaseFormat);
};
