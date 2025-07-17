import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationsPage: React.FC = () => {
  const { data: notifications, isLoading, isError } = useNotifications();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Notifications</h1>

      {isLoading && <p>Loading notifications...</p>}
      {isError && <p>Error loading notifications.</p>}
      {!isLoading && !isError && (!notifications || notifications.length === 0) && (
        <p>No notifications found.</p>
      )}

      {!isLoading && !isError && notifications && notifications.length > 0 && (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="border-b py-2">
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;