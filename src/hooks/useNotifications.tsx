
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  supabase,
} from '../integrations/supabase/client';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getNotifications(),
    enabled: !!userId, // Only fetch if userId exists (user is logged in)
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const removeNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const markAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const removeNotification = (notificationId: string) => {
    removeNotificationMutation.mutate(notificationId);
  };

  // Optional: Realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('New notification received:', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return {
    data: notifications,
    isLoading,
    isError: !!error,
    markAsRead,
    removeNotification,
    isMarkingAsRead: markAsReadMutation.isPending,
    isRemovingNotification: removeNotificationMutation.isPending,
  };
};
