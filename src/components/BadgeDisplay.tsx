import React from 'react';
import { useUserBadges } from '@/hooks/useUserBadges';

interface BadgeDisplayProps {
  userId: string;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ userId }) => {
  const { data: badges, isLoading, isError, error } = useUserBadges(userId);

  if (isLoading) {
    return <div>Loading badges...</div>;
  }

  if (isError) {
    return <div>Error loading badges: {error?.message}</div>;
  }

  if (!badges || badges.length === 0) {
    return <div>No badges earned yet.</div>;
  }

  return (
    <div className="badge-display-container">
      <h2>Earned Badges</h2>
      <div className="badges-list">
        {badges.map((userBadge) => (
          <div key={userBadge.id} className="badge-item" title={userBadge.badges.description || ''}>
            {/* Assuming badge.icon is a URL or a class name */}
            {userBadge.badges.icon && (
              <img src={userBadge.badges.icon} alt={userBadge.badges.name} className="badge-icon" />
            )}
            <span className="badge-name">{userBadge.badges.name}</span>
            {/* Optional: Implement a more sophisticated tooltip on hover */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeDisplay;
