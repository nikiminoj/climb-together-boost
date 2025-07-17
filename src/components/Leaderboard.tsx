
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Award } from "lucide-react";

const topUsers = [
  { name: "Sarah Chen", points: 1245, rank: 1 },
  { name: "Mike Rodriguez", points: 1089, rank: 2 },
  { name: "Alex Kim", points: 967, rank: 3 },
  { name: "Emma Wilson", points: 892, rank: 4 },
  { name: "David Park", points: 756, rank: 5 },
];

export const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-orange-500" />;
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-600 bg-yellow-50";
      case 2: return "text-gray-600 bg-gray-50";
      case 3: return "text-orange-600 bg-orange-50";
      default: return "text-purple-600 bg-purple-50";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Top Builders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topUsers.map((user) => (
            <div 
              key={user.rank}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className={`w-8 h-8 rounded-full flex items-center justify-center p-0 ${getRankColor(user.rank)}`}
                >
                  {getRankIcon(user.rank) || `#${user.rank}`}
                </Badge>
                <div>
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-gray-600">{user.points} points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
