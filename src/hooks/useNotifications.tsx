import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationAsRead, deleteNotification, supabase } from '../integrations/supabase/client';
import { useEffect, useState } from 'react';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id || null);
    };
    fetchSession();
  }, []);

  const { data: notifications, isLoading, error } = useQuery({
    enabled: !!userId, // Only fetch if userId exists (user is logged in)
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
    },
  });

  const removeNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
    },
  });

  const markAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const removeNotification = (notificationId: string) => {
    removeNotificationMutation.mutate(notificationId);
  };

  // Optional: Realtime subscription (can be added here or in a separate effect)
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('New notification received:', payload);
          queryClient.invalidateQueries(['notifications', userId]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);


  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    removeNotification,
    isMarkingAsRead: markAsReadMutation.isLoading,
    isRemovingNotification: removeNotificationMutation.isLoading,
  };
};