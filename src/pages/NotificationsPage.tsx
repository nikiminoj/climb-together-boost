import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationList from '@/components/NotificationList'; // Import NotificationList
import { Button } from '@/components/ui/button';

const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const { data: notifications, isLoading, isError } = useNotifications();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Notifications</h1>
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Notifications</h1>
        <p className="text-red-500">Error loading notifications.</p>
      </div>
    );
  }

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'unread') {
      return !notification.read;
    }
    return true; // 'all' filter
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Notifications</h1>

      <div className="flex space-x-4 mb-6">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          All
        </Button>
        <Button variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>
          Unread
        </Button>
      </div>

      <NotificationList notifications={filteredNotifications} />
    </div>
  );
};

export default NotificationsPage;