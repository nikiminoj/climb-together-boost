
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '@/integrations/drizzle/client';
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
    enabled: !!userId,
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
