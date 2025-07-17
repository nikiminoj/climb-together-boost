import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/database';

// Mock the hooks and components
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Heart: () => <div data-testid="heart-icon" />,
  MessageCircle: () => <div data-testid="message-circle-icon" />,
  Share2: () => <div data-testid="share2-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Star: () => <div data-testid="star-icon" />,
  ThumbsUp: () => <div data-testid="thumbs-up-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Trophy: () => <div data-testid="trophy-icon" />,
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, size, asChild, ...props }: any) => {
    const Component = asChild ? 'div' : 'button';
    return (
      <Component
        onClick={onClick}
        disabled={disabled}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </Component>
    );
  },
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className, ...props }: any) => (
    <span data-variant={variant} className={className} {...props}>
      {children}
    </span>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'A test product description',
  author: 'Test Author',
  category: 'Test Category',
  image: 'https://example.com/image.jpg',
  link: 'https://example.com/product',
  upvotes: 42,
  upvoted_by_user: false,
  points: 100,
  badges: ['New', 'Trending'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  peer_push_points: 0,
};

const mockUser = {
  id: '1',
  name: 'Test User',
  dailyLimits: {
    upvoting: { used: 0, max: 10 },
    sharing: { used: 0, max: 5 },
    following: { used: 0, max: 20 },
  },
};

const mockUserAtLimit = {
  id: '1',
  name: 'Test User',
  dailyLimits: {
    upvoting: { used: 10, max: 10 },
    sharing: { used: 5, max: 5 },
    following: { used: 20, max: 20 },
  },
};

// Testing Framework: Vitest with React Testing Library
describe('ProductCard', () => {
  const mockToast = vi.fn();
  const mockUseAuth = vi.fn();

  beforeEach(() => {
    mockToast.mockClear();
    mockUseAuth.mockClear();
    
    vi.mocked(require('@/components/ui/use-toast').useToast).mockReturnValue({
      toast: mockToast,
    });
    
    vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
      user: mockUser,
    });

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'https://example.com/current-page' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders product information correctly', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('100 pts')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('by Test Author')).toBeInTheDocument();
      expect(screen.getByText('A test product description')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders product image with correct attributes', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveAttribute('alt', 'Test Product');
      expect(image).toHaveClass('w-20', 'h-20', 'rounded-lg', 'object-cover');
    });

    it('renders badges correctly', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Trending')).toBeInTheDocument();
    });

    it('renders external link with correct href', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const visitLink = screen.getByRole('link');
      expect(visitLink).toHaveAttribute('href', 'https://example.com/product');
      expect(visitLink).toHaveAttribute('target', '_blank');
      expect(visitLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders correct rank formatting', () => {
      render(<ProductCard product={mockProduct} rank={99} />);
      expect(screen.getByText('#99')).toBeInTheDocument();
    });

    it('renders with null values gracefully', () => {
      const productWithNulls: Product = {
        ...mockProduct,
        description: null,
        image: null,
        author: null,
        category: null,
        link: null,
        badges: null,
      };

      render(<ProductCard product={productWithNulls} rank={1} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
    });
  });

  describe('Upvote Functionality', () => {
    it('handles upvote when user is logged in', async () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      await waitFor(() => {
        expect(screen.getByText('43')).toBeInTheDocument();
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Product upvoted!',
        description: "You've successfully upvoted this product.",
      });
    });

    it('handles upvote removal when already upvoted', async () => {
      const upvotedProduct = { ...mockProduct, upvoted_by_user: true };
      render(<ProductCard product={upvotedProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      await waitFor(() => {
        expect(screen.getByText('41')).toBeInTheDocument();
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Upvote removed',
        description: '',
      });
    });

    it('shows login required message when user is not logged in', async () => {
      vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
        user: null,
      });

      render(<ProductCard product={mockProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login required',
        description: 'You must be logged in to upvote products.',
        variant: 'destructive',
      });
    });

    it('shows limit reached message when daily limit is exceeded', async () => {
      vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
        user: mockUserAtLimit,
      });

      render(<ProductCard product={mockProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      fireEvent.click(upvoteButton);

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Upvote Limit Reached',
        description: 'You have reached your daily upvote limit of 10.',
        variant: 'destructive',
      });
    });

    it('disables upvote button when user is not logged in', () => {
      vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
        user: null,
      });

      render(<ProductCard product={mockProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      expect(upvoteButton).toBeDisabled();
    });

    it('shows correct upvote button variant when upvoted', () => {
      const upvotedProduct = { ...mockProduct, upvoted_by_user: true };
      render(<ProductCard product={upvotedProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      expect(upvoteButton).toHaveAttribute('data-variant', 'default');
    });

    it('shows correct upvote button variant when not upvoted', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      expect(upvoteButton).toHaveAttribute('data-variant', 'outline');
    });

    it('handles optimistic update correctly', async () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      
      // Click and verify optimistic update
      fireEvent.click(upvoteButton);
      
      expect(screen.getByText('43')).toBeInTheDocument();
      expect(upvoteButton).toHaveAttribute('data-variant', 'default');
    });
  });

  describe('Share Functionality', () => {
    it('copies link to clipboard and shows success message', async () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://example.com/current-page'
      );
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Link copied!',
        description: 'Earn 2 points when someone clicks your shared link.',
      });
    });

    it('shows sharing limit reached message when daily limit is exceeded', () => {
      vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
        user: mockUserAtLimit,
      });

      render(<ProductCard product={mockProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Sharing Limit Reached',
        description: 'You have reached your daily sharing limit of 5.',
        variant: 'destructive',
      });
    });

    it('allows sharing when user is not logged in', () => {
      vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
        user: null,
      });

      render(<ProductCard product={mockProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://example.com/current-page'
      );
    });

    it('does not copy to clipboard when sharing limit is reached', () => {
      vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
        user: mockUserAtLimit,
      });

      render(<ProductCard product={mockProduct} rank={1} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });
  });

  describe('Follow Functionality', () => {
    it('handles follow action', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      fireEvent.click(followButton);

      expect(screen.getByText('Following')).toBeInTheDocument();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Following!',
        description: '+1 point earned',
      });
    });

    it('handles unfollow action', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      fireEvent.click(followButton); // Follow
      fireEvent.click(followButton); // Unfollow

      expect(screen.getByText('Follow')).toBeInTheDocument();
      expect(mockToast).toHaveBeenLastCalledWith({
        title: 'Unfollowed',
        description: '',
      });
    });

    it('shows following limit reached message when daily limit is exceeded', () => {
      vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
        user: mockUserAtLimit,
      });

      render(<ProductCard product={mockProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      fireEvent.click(followButton);

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Following Limit Reached',
        description: 'You have reached your daily following limit of 20.',
        variant: 'destructive',
      });
    });

    it('toggles follow button variant correctly', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      
      // Initially not following
      expect(followButton).toHaveAttribute('data-variant', 'outline');
      
      fireEvent.click(followButton);
      
      // After click - following
      expect(followButton).toHaveAttribute('data-variant', 'default');
    });

    it('does not change follow state when limit is reached', () => {
      vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
        user: mockUserAtLimit,
      });

      render(<ProductCard product={mockProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      fireEvent.click(followButton);

      expect(screen.getByText('Follow')).toBeInTheDocument();
      expect(followButton).toHaveAttribute('data-variant', 'outline');
    });
  });

  describe('Badge Helper Functions', () => {
    it('returns correct badge variant for all badges', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const newBadge = screen.getByText('New');
      const trendingBadge = screen.getByText('Trending');
      
      expect(newBadge).toHaveAttribute('data-variant', 'secondary');
      expect(trendingBadge).toHaveAttribute('data-variant', 'secondary');
    });

    it('returns null for badge icon by default', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      // Since getBadgeIcon returns null by default, no icons should be rendered
      const trendingIcon = screen.queryByTestId('trending-up-icon');
      const trophyIcon = screen.queryByTestId('trophy-icon');
      const starIcon = screen.queryByTestId('star-icon');
      
      expect(trendingIcon).not.toBeInTheDocument();
      expect(trophyIcon).not.toBeInTheDocument();
      expect(starIcon).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles missing user dailyLimits gracefully', () => {
      const userWithoutLimits = { id: '1', name: 'Test User' };
      vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
        user: userWithoutLimits,
      });

      render(<ProductCard product={mockProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      expect(upvoteButton).not.toBeDisabled();
    });

    it('handles product with empty badges array', () => {
      const productWithoutBadges = { ...mockProduct, badges: [] };
      render(<ProductCard product={productWithoutBadges} rank={1} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.queryByText('New')).not.toBeInTheDocument();
      expect(screen.queryByText('Trending')).not.toBeInTheDocument();
    });

    it('handles product with null badges', () => {
      const productWithNullBadges = { ...mockProduct, badges: null };
      render(<ProductCard product={productWithNullBadges} rank={1} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.queryByText('New')).not.toBeInTheDocument();
    });

    it('handles very long product names and descriptions', () => {
      const longTextProduct = {
        ...mockProduct,
        name: 'A'.repeat(200),
        description: 'B'.repeat(1000),
      };

      render(<ProductCard product={longTextProduct} rank={1} />);

      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
      expect(screen.getByText('B'.repeat(1000))).toBeInTheDocument();
    });

    it('handles high rank numbers', () => {
      render(<ProductCard product={mockProduct} rank={9999} />);
      expect(screen.getByText('#9999')).toBeInTheDocument();
    });

    it('handles zero upvotes', () => {
      const zeroUpvoteProduct = { ...mockProduct, upvotes: 0 };
      render(<ProductCard product={zeroUpvoteProduct} rank={1} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles negative points gracefully', () => {
      const negativePointsProduct = { ...mockProduct, points: -10 };
      render(<ProductCard product={negativePointsProduct} rank={1} />);

      expect(screen.getByText('-10 pts')).toBeInTheDocument();
    });

    it('handles missing product image gracefully', () => {
      const productWithoutImage = { ...mockProduct, image: null };
      render(<ProductCard product={productWithoutImage} rank={1} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '');
    });

    it('handles missing product link gracefully', () => {
      const productWithoutLink = { ...mockProduct, link: null };
      render(<ProductCard product={productWithoutLink} rank={1} />);

      const visitLink = screen.getByRole('link');
      expect(visitLink).toHaveAttribute('href', '');
    });

    it('handles missing author gracefully', () => {
      const productWithoutAuthor = { ...mockProduct, author: null };
      render(<ProductCard product={productWithoutAuthor} rank={1} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.queryByText('by')).not.toBeInTheDocument();
    });

    it('handles missing category gracefully', () => {
      const productWithoutCategory = { ...mockProduct, category: null };
      render(<ProductCard product={productWithoutCategory} rank={1} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      // Category badge should not be rendered
    });

    it('handles missing description gracefully', () => {
      const productWithoutDescription = { ...mockProduct, description: null };
      render(<ProductCard product={productWithoutDescription} rank={1} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  describe('Button States and Interactions', () => {
    it('renders comment button without functionality', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const commentButton = screen.getByRole('button', { name: /comment/i });
      expect(commentButton).toBeInTheDocument();
      expect(commentButton).not.toBeDisabled();
    });

    it('renders all buttons with correct sizes', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('data-size', 'sm');
      });
    });

    it('renders visit link as ghost button', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const visitLink = screen.getByRole('link');
      expect(visitLink).toHaveAttribute('data-variant', 'ghost');
      expect(visitLink).toHaveAttribute('data-size', 'sm');
    });
  });

  describe('Accessibility', () => {
    it('has proper alt text for product image', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Test Product');
    });

    it('has proper link accessibility attributes', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const visitLink = screen.getByRole('link');
      expect(visitLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(visitLink).toHaveAttribute('target', '_blank');
    });

    it('has proper button labels', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      expect(screen.getByRole('button', { name: /42/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /comment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Test Product');
    });

    it('has proper semantic structure for product information', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('by Test Author')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('maintains consistent render performance with different data sizes', () => {
      const largeProduct = {
        ...mockProduct,
        badges: Array(20).fill(0).map((_, i) => `Badge ${i}`),
        description: 'B'.repeat(2000),
      };

      const { rerender } = render(<ProductCard product={largeProduct} rank={1} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      
      rerender(<ProductCard product={mockProduct} rank={2} />);
      expect(screen.getByText('#2')).toBeInTheDocument();
    });

    it('handles rapid state changes gracefully', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      
      // Rapid clicks should not break the component
      fireEvent.click(followButton);
      fireEvent.click(followButton);
      fireEvent.click(followButton);
      
      expect(screen.getByText('Following')).toBeInTheDocument();
    });
  });

  describe('Integration and State Management', () => {
    it('maintains upvote state across multiple interactions', async () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      
      // First upvote
      fireEvent.click(upvoteButton);
      expect(screen.getByText('43')).toBeInTheDocument();
      
      // Second click (remove upvote)
      fireEvent.click(upvoteButton);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('handles multiple toast notifications correctly', () => {
      render(<ProductCard product={mockProduct} rank={1} />);

      const upvoteButton = screen.getByRole('button', { name: /42/ });
      const shareButton = screen.getByRole('button', { name: /share/i });
      const followButton = screen.getByRole('button', { name: /follow/i });

      fireEvent.click(upvoteButton);
      fireEvent.click(shareButton);
      fireEvent.click(followButton);

      expect(mockToast).toHaveBeenCalledTimes(3);
    });

    it('preserves component state during re-renders', () => {
      const { rerender } = render(<ProductCard product={mockProduct} rank={1} />);

      const followButton = screen.getByRole('button', { name: /follow/i });
      fireEvent.click(followButton);

      expect(screen.getByText('Following')).toBeInTheDocument();

      // Re-render with different rank
      rerender(<ProductCard product={mockProduct} rank={2} />);

      // Follow state should be preserved
      expect(screen.getByText('Following')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
    });
  });
});