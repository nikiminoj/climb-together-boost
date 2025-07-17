import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Target,
  Share2,
  Heart,
  MessageCircle,
  Eye,
} from 'lucide-react';

interface UserStatsProps {
  user: {
    name: string;
    points: number;
    rank: number;
    dailyLimits: {
      sharing: { used: number; max: number };
      upvoting: { used: number; max: number };
      commenting: { used: number; max: number };
      following: { used: number; max: number };
    };
  };
}

export const UserStats = ({ user }: UserStatsProps) => {
  const getProgressColor = (used: number, max: number) => {
    const percentage = (used / max) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      {/* User Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {user.points}
            </div>
            <div className="text-sm text-gray-600">Total Points</div>
            <Badge variant="secondary" className="mt-2">
              Rank #{user.rank}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Daily Limits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Daily Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Share2 className="h-4 w-4" />
                  Sharing
                </div>
                <span className="text-xs text-gray-600">
                  {user.dailyLimits.sharing.used}/{user.dailyLimits.sharing.max}
                </span>
              </div>
              <Progress
                value={
                  (user.dailyLimits.sharing.used /
                    user.dailyLimits.sharing.max) *
                  100
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="h-4 w-4" />
                  Upvoting
                </div>
                <span className="text-xs text-gray-600">
                  {user.dailyLimits.upvoting.used}/
                  {user.dailyLimits.upvoting.max}
                </span>
              </div>
              <Progress
                value={
                  (user.dailyLimits.upvoting.used /
                    user.dailyLimits.upvoting.max) *
                  100
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4" />
                  Commenting
                </div>
                <span className="text-xs text-gray-600">
                  {user.dailyLimits.commenting.used}/
                  {user.dailyLimits.commenting.max}
                </span>
              </div>
              <Progress
                value={
                  (user.dailyLimits.commenting.used /
                    user.dailyLimits.commenting.max) *
                  100
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  Following
                </div>
                <span className="text-xs text-gray-600">
                  {user.dailyLimits.following.used}/
                  {user.dailyLimits.following.max}
                </span>
              </div>
              <Progress
                value={
                  (user.dailyLimits.following.used /
                    user.dailyLimits.following.max) *
                  100
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
