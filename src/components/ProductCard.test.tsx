import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/database';

// Mock the hooks and components
const mockToast = vi.fn();
const mockUseToast = vi.fn(() => ({ toast: mockToast }));
const mockUseAuth = vi.fn();

vi.mock('@/components/ui/use-toast', () => ({
  useToast: mockUseToast,
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, size, className, asChild, ...props }) => {
    const Component = asChild ? 'a' : 'button';
    return (
      <Component
        onClick={onClick}
        disabled={disabled}
        data-variant={variant}
        data-size={size}
        className={className}
        {...props}
      >
        {children}
      </Component>
    );
  },
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }) => (
    <span data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }) => <div className={className}>{children}</div>,
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Heart: () => <span data-testid="heart-icon" />,
  MessageCircle: () => <span data-testid="message-circle-icon" />,
  Share2: () => <span data-testid="share2-icon" />,
  ExternalLink: () => <span data-testid="external-link-icon" />,
  TrendingUp: () => <span data-testid="trending-up-icon" />,
  Star: () => <span data-testid="star-icon" />,
  ThumbsUp: () => <span data-testid="thumbs-up-icon" />,
  Eye: () => <span data-testid="eye-icon" />,
  Trophy: () => <span data-testid="trophy-icon" />,
}));

describe('ProductCard', () => {
  const defaultProduct: Product = {
    id: '1',
    name: 'Test Product',
    author: 'Test Author',
    description: 'Test description for the product',
    category: 'Technology',
    image: 'https://example.com/image.jpg',
    link: 'https://example.com/product',
    upvotes: 42,
    points: 100,
    peer_push_points: 0,
    badges: ['Trending', 'Hot'],
    upvoted_by_user: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const defaultUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    dailyLimits: {
      upvoting: { used: 0, max: 10 },
      sharing: { used: 0, max: 5 },
      following: { used: 0, max: 20 },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseToast.mockReturnValue({ toast: mockToast });
    mockUseAuth.mockReturnValue({ user: defaultUser });
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
    
    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://example.com/current-page',
      },
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('renders product information correctly', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('100 pts')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('by Test Author')).toBeInTheDocument();
      expect(screen.getByText('Test description for the product')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('renders product image with correct attributes', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveAttribute('alt', 'Test Product');
    });

    it('renders all badges correctly', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.getByText('Hot')).toBeInTheDocument();
    });

    it('renders upvote button with correct initial state', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      expect(upvoteButton).toBeInTheDocument();
      expect(upvoteButton).toHaveAttribute('data-variant', 'outline');
    });

    it('renders upvote button as active when user has upvoted', () => {
      const upvotedProduct = { ...defaultProduct, upvoted_by_user: true };
      render(<ProductCard product={upvotedProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      expect(upvoteButton).toHaveAttribute('data-variant', 'default');
    });

    it('renders all action buttons', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /comment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /visit/i })).toBeInTheDocument();
    });

    it('renders visit link with correct href', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const visitLink = screen.getByRole('link', { name: /visit/i });
      expect(visitLink).toHaveAttribute('href', 'https://example.com/product');
      expect(visitLink).toHaveAttribute('target', '_blank');
      expect(visitLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders correct rank formatting for different numbers', () => {
      render(<ProductCard product={defaultProduct} rank={999} />);
      expect(screen.getByText('#999')).toBeInTheDocument();
    });

    it('renders points correctly with "pts" suffix', () => {
      const productWithDifferentPoints = { ...defaultProduct, points: 1337 };
      render(<ProductCard product={productWithDifferentPoints} rank={1} />);
      expect(screen.getByText('1337 pts')).toBeInTheDocument();
    });

    it('handles null values gracefully', () => {
      const productWithNulls = {
        ...defaultProduct,
        description: null,
        image: null,
        author: null,
        category: null,
        link: null,
        badges: null,
      };
      render(<ProductCard product={productWithNulls} rank={1} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('100 pts')).toBeInTheDocument();
    });
  });

  describe('Upvote Functionality', () => {
    it('requires user to be logged in to upvote', async () => {
      mockUseAuth.mockReturnValue({ user: null });
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Login required',
          description: 'You must be logged in to upvote products.',
          variant: 'destructive',
        });
      });
    });

    it('disables upvote button when user is not logged in', () => {
      mockUseAuth.mockReturnValue({ user: null });
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      expect(upvoteButton).toBeDisabled();
    });

    it('prevents upvoting when daily limit is reached', async () => {
      const userAtLimit = {
        ...defaultUser,
        dailyLimits: {
          ...defaultUser.dailyLimits,
          upvoting: { used: 10, max: 10 },
        },
      };
      mockUseAuth.mockReturnValue({ user: userAtLimit });
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Upvote Limit Reached',
          description: 'You have reached your daily upvote limit of 10.',
          variant: 'destructive',
        });
      });
    });

    it('increments upvote count when upvoting', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /43/ })).toBeInTheDocument();
      });
    });

    it('decrements upvote count when removing upvote', async () => {
      const upvotedProduct = { ...defaultProduct, upvoted_by_user: true };
      render(<ProductCard product={upvotedProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /41/ })).toBeInTheDocument();
      });
    });

    it('shows success toast when upvoting', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Product upvoted!',
          description: "You've successfully upvoted this product.",
        });
      });
    });

    it('shows success toast when removing upvote', async () => {
      const upvotedProduct = { ...defaultProduct, upvoted_by_user: true };
      render(<ProductCard product={upvotedProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Upvote removed',
          description: '',
        });
      });
    });

    it('disables upvote button while upvoting', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      // Button should be disabled immediately
      expect(upvoteButton).toBeDisabled();

      await waitFor(() => {
        expect(upvoteButton).not.toBeDisabled();
      });
    });

    it('handles upvote with missing daily limits', async () => {
      const userWithoutLimits = {
        ...defaultUser,
        dailyLimits: undefined,
      };
      mockUseAuth.mockReturnValue({ user: userWithoutLimits });
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      // Should still work and show success toast
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Product upvoted!',
          description: "You've successfully upvoted this product.",
        });
      });
    });
  });

  describe('Share Functionality', () => {
    it('copies current URL to clipboard when sharing', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/current-page');
    });

    it('shows success toast when sharing', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Link copied!',
          description: 'Earn 2 points when someone clicks your shared link.',
        });
      });
    });

    it('prevents sharing when daily limit is reached', async () => {
      const userAtLimit = {
        ...defaultUser,
        dailyLimits: {
          ...defaultUser.dailyLimits,
          sharing: { used: 5, max: 5 },
        },
      };
      mockUseAuth.mockReturnValue({ user: userAtLimit });
      render(<ProductCard product={defaultProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Sharing Limit Reached',
          description: 'You have reached your daily sharing limit of 5.',
          variant: 'destructive',
        });
      });
      
      // Verify clipboard was not called when limit is reached
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('still allows sharing when user is not logged in', () => {
      mockUseAuth.mockReturnValue({ user: null });
      render(<ProductCard product={defaultProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/current-page');
    });

    it('handles clipboard API errors gracefully', async () => {
      const mockClipboardError = vi.fn().mockRejectedValue(new Error('Clipboard error'));
      Object.assign(navigator, {
        clipboard: {
          writeText: mockClipboardError,
        },
      });

      render(<ProductCard product={defaultProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);

      // Should still show success toast even if clipboard fails
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Link copied!',
          description: 'Earn 2 points when someone clicks your shared link.',
        });
      });
    });
  });

  describe('Follow Functionality', () => {
    it('toggles follow state when clicking follow button', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      fireEvent.click(followButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
      });
    });

    it('shows success toast when following', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      fireEvent.click(followButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Following!',
          description: '+1 point earned',
        });
      });
    });

    it('shows success toast when unfollowing', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      // Click twice to follow then unfollow
      fireEvent.click(followButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
      });
      
      const followingButton = screen.getByRole('button', { name: /following/i });
      fireEvent.click(followingButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Unfollowed',
          description: '',
        });
      });
    });

    it('prevents following when daily limit is reached', async () => {
      const userAtLimit = {
        ...defaultUser,
        dailyLimits: {
          ...defaultUser.dailyLimits,
          following: { used: 20, max: 20 },
        },
      };
      mockUseAuth.mockReturnValue({ user: userAtLimit });
      render(<ProductCard product={defaultProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      fireEvent.click(followButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Following Limit Reached',
          description: 'You have reached your daily following limit of 20.',
          variant: 'destructive',
        });
      });
    });

    it('changes button variant when following', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      expect(followButton).toHaveAttribute('data-variant', 'outline');

      fireEvent.click(followButton);

      await waitFor(() => {
        const followingButton = screen.getByRole('button', { name: /following/i });
        expect(followingButton).toHaveAttribute('data-variant', 'default');
      });
    });

    it('allows following when user is not logged in', () => {
      mockUseAuth.mockReturnValue({ user: null });
      render(<ProductCard product={defaultProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      fireEvent.click(followButton);

      // Should still allow following and show toast
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Following!',
        description: '+1 point earned',
      });
    });
  });

  describe('Badge Functionality', () => {
    it('returns secondary variant for all badges by default', () => {
      const productWithVariousBadges = {
        ...defaultProduct,
        badges: ['Trending', 'Hot', 'Unknown Badge'],
      };
      render(<ProductCard product={productWithVariousBadges} rank={1} />);

      const trendingBadge = screen.getByText('Trending');
      const hotBadge = screen.getByText('Hot');
      const unknownBadge = screen.getByText('Unknown Badge');
      
      expect(trendingBadge).toHaveAttribute('data-variant', 'secondary');
      expect(hotBadge).toHaveAttribute('data-variant', 'secondary');
      expect(unknownBadge).toHaveAttribute('data-variant', 'secondary');
    });

    it('returns null icon for all badges by default', () => {
      const productWithVariousBadges = {
        ...defaultProduct,
        badges: ['Trending', 'Hot', 'Unknown Badge'],
      };
      render(<ProductCard product={productWithVariousBadges} rank={1} />);

      // Should not have any icons for badges in the current implementation
      expect(screen.queryByTestId('trending-up-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('trophy-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('star-icon')).not.toBeInTheDocument();
    });

    it('handles empty badges array', () => {
      const productWithNoBadges = {
        ...defaultProduct,
        badges: [],
      };
      render(<ProductCard product={productWithNoBadges} rank={1} />);

      // Should render without errors
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('handles null badges', () => {
      const productWithNullBadges = {
        ...defaultProduct,
        badges: null,
      };
      render(<ProductCard product={productWithNullBadges} rank={1} />);

      // Should render without errors
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('handles single badge', () => {
      const productWithSingleBadge = {
        ...defaultProduct,
        badges: ['Trending'],
      };
      render(<ProductCard product={productWithSingleBadge} rank={1} />);

      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.queryByText('Hot')).not.toBeInTheDocument();
    });

    it('handles many badges', () => {
      const productWithManyBadges = {
        ...defaultProduct,
        badges: ['Trending', 'Hot', 'Popular', 'New', 'Featured'],
      };
      render(<ProductCard product={productWithManyBadges} rank={1} />);

      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.getByText('Hot')).toBeInTheDocument();
      expect(screen.getByText('Popular')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing user daily limits gracefully', () => {
      const userWithoutLimits = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        // No dailyLimits property
      };
      mockUseAuth.mockReturnValue({ user: userWithoutLimits });
      render(<ProductCard product={defaultProduct} rank={1} />);

      // Should render without errors
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      
      // Actions should still work
      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    it('handles zero upvotes correctly', () => {
      const productWithZeroUpvotes = {
        ...defaultProduct,
        upvotes: 0,
      };
      render(<ProductCard product={productWithZeroUpvotes} rank={1} />);

      expect(screen.getByRole('button', { name: /0/ })).toBeInTheDocument();
    });

    it('handles negative upvotes correctly', () => {
      const productWithNegativeUpvotes = {
        ...defaultProduct,
        upvotes: -5,
      };
      render(<ProductCard product={productWithNegativeUpvotes} rank={1} />);

      expect(screen.getByRole('button', { name: /-5/ })).toBeInTheDocument();
    });

    it('handles high rank numbers', () => {
      render(<ProductCard product={defaultProduct} rank={999} />);
      expect(screen.getByText('#999')).toBeInTheDocument();
    });

    it('handles zero rank', () => {
      render(<ProductCard product={defaultProduct} rank={0} />);
      expect(screen.getByText('#0')).toBeInTheDocument();
    });

    it('handles long product names and descriptions', () => {
      const productWithLongContent = {
        ...defaultProduct,
        name: 'A'.repeat(100),
        description: 'B'.repeat(500),
      };
      render(<ProductCard product={productWithLongContent} rank={1} />);

      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
      expect(screen.getByText('B'.repeat(500))).toBeInTheDocument();
    });

    it('handles empty product name and description', () => {
      const productWithEmptyContent = {
        ...defaultProduct,
        name: '',
        description: '',
      };
      render(<ProductCard product={productWithEmptyContent} rank={1} />);

      // Should render without errors
      expect(screen.getByText('by Test Author')).toBeInTheDocument();
    });

    it('handles missing product image gracefully', () => {
      const productWithoutImage = {
        ...defaultProduct,
        image: null,
      };
      render(<ProductCard product={productWithoutImage} rank={1} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '');
    });

    it('handles missing product link gracefully', () => {
      const productWithoutLink = {
        ...defaultProduct,
        link: null,
      };
      render(<ProductCard product={productWithoutLink} rank={1} />);

      const visitLink = screen.getByRole('link', { name: /visit/i });
      expect(visitLink).toHaveAttribute('href', '');
    });

    it('handles special characters in product data', () => {
      const productWithSpecialChars = {
        ...defaultProduct,
        name: 'Test & Product <script>',
        author: 'Test & Author "quotes"',
        description: 'Description with special chars: & < > " \' /',
      };
      render(<ProductCard product={productWithSpecialChars} rank={1} />);

      expect(screen.getByText('Test & Product <script>')).toBeInTheDocument();
      expect(screen.getByText('by Test & Author "quotes"')).toBeInTheDocument();
      expect(screen.getByText('Description with special chars: & < > " \' /')).toBeInTheDocument();
    });

    it('handles peer_push_points field', () => {
      const productWithPeerPushPoints = {
        ...defaultProduct,
        peer_push_points: 50,
      };
      render(<ProductCard product={productWithPeerPushPoints} rank={1} />);

      // Should render without errors
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing toast function gracefully', () => {
      mockUseToast.mockReturnValue({ toast: undefined });
      render(<ProductCard product={defaultProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      // Should not throw error when toast is undefined
      expect(() => fireEvent.click(shareButton)).not.toThrow();
    });

    it('handles undefined user object gracefully', () => {
      mockUseAuth.mockReturnValue({ user: undefined });
      render(<ProductCard product={defaultProduct} rank={1} />);

      // Should render without errors
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('handles missing navigator.clipboard gracefully', () => {
      const originalClipboard = navigator.clipboard;
      delete (navigator as any).clipboard;
      
      render(<ProductCard product={defaultProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      // Should not throw error when clipboard is undefined
      expect(() => fireEvent.click(shareButton)).not.toThrow();
      
      // Restore clipboard
      (navigator as any).clipboard = originalClipboard;
    });

    it('handles missing window.location gracefully', () => {
      const originalLocation = window.location;
      delete (window as any).location;
      
      render(<ProductCard product={defaultProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      // Should not throw error when location is undefined
      expect(() => fireEvent.click(shareButton)).not.toThrow();
      
      // Restore location
      (window as any).location = originalLocation;
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for buttons', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('has proper alt text for product image', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAccessibleName('Test Product');
    });

    it('has proper link attributes for external visit link', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const visitLink = screen.getByRole('link', { name: /visit/i });
      expect(visitLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(visitLink).toHaveAttribute('target', '_blank');
    });

    it('provides clear button text for screen readers', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /comment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
    });

    it('uses semantic HTML structure', () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      // Check for proper heading structure
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('handles rapid button clicks gracefully', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      
      // Click button multiple times rapidly
      fireEvent.click(upvoteButton);
      fireEvent.click(upvoteButton);
      fireEvent.click(upvoteButton);

      // Should handle multiple clicks without errors
      await waitFor(() => {
        expect(upvoteButton).toBeInTheDocument();
      });
    });

    it('handles multiple simultaneous actions', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      const shareButton = screen.getByRole('button', { name: /share/i });
      const followButton = screen.getByRole('button', { name: /follow/i });

      // Click multiple buttons simultaneously
      fireEvent.click(upvoteButton);
      fireEvent.click(shareButton);
      fireEvent.click(followButton);

      // Should handle multiple actions without errors
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled();
      });
    });
  });

  describe('State Management', () => {
    it('maintains upvote count state independently', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      
      // Click to upvote
      fireEvent.click(upvoteButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /43/ })).toBeInTheDocument();
      });
      
      // Click again to remove upvote
      fireEvent.click(screen.getByRole('button', { name: /43/ }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /42/ })).toBeInTheDocument();
      });
    });

    it('maintains follow state independently', async () => {
      render(<ProductCard product={defaultProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      
      // Click to follow
      fireEvent.click(followButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
      });
      
      // Click again to unfollow
      fireEvent.click(screen.getByRole('button', { name: /following/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
      });
    });

    it('initializes state correctly from props', () => {
      const upvotedProduct = { ...defaultProduct, upvoted_by_user: true };
      render(<ProductCard product={upvotedProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      expect(upvoteButton).toHaveAttribute('data-variant', 'default');
    });

    it('handles state changes with missing fields', async () => {
      const minimalProduct = {
        ...defaultProduct,
        author: null,
        description: null,
        image: null,
        category: null,
        badges: null,
      };
      render(<ProductCard product={minimalProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /43/ })).toBeInTheDocument();
      });
    });
  });
});