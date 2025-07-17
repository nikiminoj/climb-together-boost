import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  TrendingUp,
  Star,
  ThumbsUp,
  Eye,
  Trophy,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast'; // Assuming toast is now a component
import { upvoteProduct } from '@/integrations/supabase/client'; // Assuming upvoteProduct is in this path
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string; // Assuming product ID is a UUID (string)
  name: string;
  description: string;
  image: string;
  author: string;
  points: number;
  upvotes: number;
  badges: string[];
  category: string;
  link: string;
  upvoted_by_user?: boolean; // Optional: Indicates if the current user has upvoted this product
}

interface ProductCardProps {
  product: Product;
  rank: number;
  // We will get user from useAuth
}

export const ProductCard = ({ product, rank }: ProductCardProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(product.upvotes);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(
    product.upvoted_by_user || false,
  ); // Use prop for initial state

  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'You must be logged in to upvote products.',
        variant: 'destructive',
      });
      return; // Exit if user is not logged in
    }

    if (
      user &&
      user.dailyLimits &&
      user.dailyLimits.upvoting.used >= user.dailyLimits.upvoting.max
    ) {
      toast({
        title: 'Upvote Limit Reached',
        description: `You have reached your daily upvote limit of ${user.dailyLimits.upvoting.max}.`,
        variant: 'destructive',
      });
      return; // Exit if daily limit reached
    }

    setIsUpvoting(true);
    const previousUpvoteCount = upvoteCount;
    const previousHasUpvoted = hasUpvoted;

    try {
      const newUpvoteCount = previousHasUpvoted
        ? upvoteCount - 1
        : upvoteCount + 1;
      setUpvoteCount(newUpvoteCount);
      setHasUpvoted(!hasUpvoted);

      // TODO: Handle potential errors and revert optimistic update
    } catch (error) {
      console.error('Upvote failed:', error);
      toast({
        title: 'Upvote failed',
        description: 'Could not process your upvote. Please try again.',
        variant: 'destructive',
      });
      // Revert optimistic update on failure
      setUpvoteCount(previousUpvoteCount);
      setHasUpvoted(previousHasUpvoted);
    } finally {
      setIsUpvoting(false);
      toast({
        title: hasUpvoted ? 'Upvote removed' : 'Product upvoted!',
        description: hasUpvoted
          ? ''
          : "You've successfully upvoted this product.",
      });
    }
  };

  const handleShare = () => {
    if (
      user &&
      user.dailyLimits &&
      user.dailyLimits.sharing.used >= user.dailyLimits.sharing.max
    ) {
      toast({
        title: 'Sharing Limit Reached',
        description: `You have reached your daily sharing limit of ${user.dailyLimits.sharing.max}.`,
        variant: 'destructive',
      });
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied!',
      description: 'Earn 2 points when someone clicks your shared link.',
    });
  };

  const handleFollow = () => {
    if (
      user &&
      user.dailyLimits &&
      user.dailyLimits.following.used >= user.dailyLimits.following.max
    ) {
      toast({
        title: 'Following Limit Reached',
        description: `You have reached your daily following limit of ${user.dailyLimits.following.max}.`,
        variant: 'destructive',
      });
      return;
    }

    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? 'Unfollowed' : 'Following!',
      description: isFollowing ? '' : '+1 point earned',
    });
  };

  // TODO: Update this function to use badge data fetched from the database
  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      // case "Trending": return "default";
      // case "Product of the Day": return "secondary";
      // case "Hot": return "destructive";
      // case "Rising": return "outline";
      default:
        return 'secondary';
    }
  };

  // TODO: Update this function to use badge data fetched from the database (including icons)
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      // case "Trending": return <TrendingUp className="h-3 w-3" />;
      // case "Product of the Day": return <Trophy className="h-3 w-3" />;
      // case "Hot": return <Star className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Rank */}
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              #{rank}
            </div>
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
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.name}
                  </h3>
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
                  variant={hasUpvoted ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleUpvote}
                  disabled={isUpvoting || !user} // Disable if upvoting or not logged in
                  className="flex items-center gap-2"
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${hasUpvoted ? 'fill-current' : ''}`}
                  />
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
                  variant={isFollowing ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleFollow}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
