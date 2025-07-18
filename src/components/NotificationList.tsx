
import React from 'react';
import { Tables } from '@/integrations/supabase/types';

type Notification = Tables<'notifications'>;

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return <div className="p-4">No notifications yet.</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Notifications</h3>
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`border-b py-2 ${!notification.read ? 'font-bold' : ''}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p>{notification.message}</p>
                <span className="text-sm text-gray-500">
                  {new Date(notification.created_at || '').toLocaleString()}
                </span>
              </div>
              <div className="flex space-x-2">
                {!notification.read && (
                  <button
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
