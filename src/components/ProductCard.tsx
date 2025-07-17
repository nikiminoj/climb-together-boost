
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ExternalLink, 
  TrendingUp,
  Star,
  Eye,
  Trophy
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  author: string;
  points: number;
  upvotes: number;
  badges: string[];
  category: string;
  link: string;
}

interface ProductCardProps {
  product: Product;
  rank: number;
  currentUser: any;
}

export const ProductCard = ({ product, rank, currentUser }: ProductCardProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(product.upvotes);

  const handleUpvote = () => {
    if (currentUser.dailyLimits.upvoting.used >= currentUser.dailyLimits.upvoting.max) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily upvoting limit of 20 points.",
        variant: "destructive"
      });
      return;
    }

    setIsUpvoted(!isUpvoted);
    setUpvoteCount(prev => isUpvoted ? prev - 1 : prev + 1);
    
    toast({
      title: isUpvoted ? "Upvote removed" : "Product upvoted!",
      description: isUpvoted ? "" : "+1 point earned",
    });
  };

  const handleShare = () => {
    if (currentUser.dailyLimits.sharing.used >= currentUser.dailyLimits.sharing.max) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily sharing limit of 20 points.",
        variant: "destructive"
      });
      return;
    }

    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Earn 2 points when someone clicks your shared link.",
    });
  };

  const handleFollow = () => {
    if (currentUser.dailyLimits.following.used >= currentUser.dailyLimits.following.max) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily following limit of 40 points.",
        variant: "destructive"
      });
      return;
    }

    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following!",
      description: isFollowing ? "" : "+1 point earned",
    });
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "Trending": return "default";
      case "Product of the Day": return "secondary";
      case "Hot": return "destructive";
      case "Rising": return "outline";
      default: return "secondary";
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Trending": return <TrendingUp className="h-3 w-3" />;
      case "Product of the Day": return <Trophy className="h-3 w-3" />;
      case "Hot": return <Star className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Rank */}
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">#{rank}</div>
            <div className="text-sm text-gray-500">{product.points} pts</div>
          </div>

          {/* Product Image */}
          <div className="flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">by {product.author}</p>
                </div>
                <Badge variant="outline" className="ml-4">
                  {product.category}
                </Badge>
              </div>
              
              <p className="text-gray-700 mb-3">{product.description}</p>
              
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.badges.map((badge) => (
                  <Badge 
                    key={badge} 
                    variant={getBadgeVariant(badge)}
                    className="flex items-center gap-1"
                  >
                    {getBadgeIcon(badge)}
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant={isUpvoted ? "default" : "outline"}
                  size="sm"
                  onClick={handleUpvote}
                  className="flex items-center gap-2"
                >
                  <Heart className={`h-4 w-4 ${isUpvoted ? "fill-current" : ""}`} />
                  {upvoteCount}
                </Button>

                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>

                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Comment
                </Button>

                <Button
                  variant={isFollowing ? "default" : "outline"}
                  size="sm"
                  onClick={handleFollow}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
