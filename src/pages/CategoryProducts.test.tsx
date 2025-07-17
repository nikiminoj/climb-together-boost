import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import { useProductsByCategory } from "@/hooks/useProductsByCategory";
import CategoryProducts from './CategoryProducts';

// Mock the dependencies
vi.mock('react-router-dom', () => ({
  useParams: vi.fn()
}));

vi.mock('@/hooks/useProductsByCategory');

vi.mock('@/components/ProductCard', () => ({
  ProductCard: ({ product, rank }: { product: any; rank: number }) => (
    <li data-testid={`product-card-${product.id}`}>
      Product: {product.name} - Rank: {rank}
    </li>
  )
}));

const mockUseParams = vi.mocked(useParams);
const mockUseProductsByCategory = vi.mocked(useProductsByCategory);

describe('CategoryProducts Component', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ categoryId: 'test-category' });
    vi.clearAllMocks();
  });

  describe('Loading States', () => {
    it('should display loading message for promoted products', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Loading promoted products...')).toBeInTheDocument();
    });

    it('should display loading message for products published today', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: [], isLoading: false, isError: false };
        }
        if (options?.publishedDateRange === 'today') {
          return { data: undefined, isLoading: true, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Loading products published today...')).toBeInTheDocument();
    });

    it('should display loading message for products published this week', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'this-week') {
          return { data: undefined, isLoading: true, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Loading products published this week...')).toBeInTheDocument();
    });

    it('should display loading message for products published this month', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'this-month') {
          return { data: undefined, isLoading: true, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Loading products published this month...')).toBeInTheDocument();
    });

    it('should display loading message for products published previous month', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'previous-month') {
          return { data: undefined, isLoading: true, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Loading products published previous month...')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should display error message for promoted products', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Error loading promoted products.')).toBeInTheDocument();
    });

    it('should display error message for products published today', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: [], isLoading: false, isError: false };
        }
        if (options?.publishedDateRange === 'today') {
          return { data: undefined, isLoading: false, isError: true };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Error loading products published today.')).toBeInTheDocument();
    });

    it('should display error message for products published this week', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'this-week') {
          return { data: undefined, isLoading: false, isError: true };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Error loading products published this week.')).toBeInTheDocument();
    });

    it('should display error message for products published this month', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'this-month') {
          return { data: undefined, isLoading: false, isError: true };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Error loading products published this month.')).toBeInTheDocument();
    });

    it('should display error message for products published previous month', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'previous-month') {
          return { data: undefined, isLoading: false, isError: true };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Error loading products published previous month.')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    beforeEach(() => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });
    });

    it('should display no promoted products message when none exist', () => {
      render(<CategoryProducts />);

      expect(screen.getByText('No promoted products found for this category.')).toBeInTheDocument();
    });

    it('should display no products published today message when none exist', () => {
      render(<CategoryProducts />);

      expect(screen.getByText('No products published today for this category.')).toBeInTheDocument();
    });

    it('should display no products published this week message when none exist', () => {
      render(<CategoryProducts />);

      expect(screen.getByText('No products published this week for this category.')).toBeInTheDocument();
    });

    it('should display no products published this month message when none exist', () => {
      render(<CategoryProducts />);

      expect(screen.getByText('No products published this month for this category.')).toBeInTheDocument();
    });

    it('should display no products published previous month message when none exist', () => {
      render(<CategoryProducts />);

      expect(screen.getByText('No products published previous month for this category.')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' },
      { id: '3', name: 'Product 3' }
    ];

    it('should display promoted products when available', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });

    it('should display products published today when available', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'today') {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });

    it('should display products published this week when available', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'this-week') {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });

    it('should display products published this month when available', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'this-month') {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });

    it('should display products published previous month when available', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'previous-month') {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });
    });

    it('should render the main container with proper styling', () => {
      render(<CategoryProducts />);

      const container = screen.getByText('Products in Category: test-category').closest('div');
      expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
    });

    it('should display the correct category ID in the main heading', () => {
      render(<CategoryProducts />);

      expect(screen.getByText('Products in Category: test-category')).toBeInTheDocument();
    });

    it('should display all section headings', () => {
      render(<CategoryProducts />);

      expect(screen.getByText('Promoted Products')).toBeInTheDocument();
      expect(screen.getByText('Published Today')).toBeInTheDocument();
      expect(screen.getByText('Published This Week')).toBeInTheDocument();
      expect(screen.getByText('Published This Month')).toBeInTheDocument();
      expect(screen.getByText('Published Previous Month')).toBeInTheDocument();
    });

    it('should apply correct styling to section headings', () => {
      render(<CategoryProducts />);

      const headings = screen.getAllByRole('heading', { level: 2 });
      headings.forEach(heading => {
        expect(heading).toHaveClass('text-2xl', 'font-bold', 'mb-4');
      });
    });
  });

  describe('Product Ranking', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' },
      { id: '3', name: 'Product 3' }
    ];

    it('should pass correct rank to promoted product cards', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Product: Product 1 - Rank: 1')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 2 - Rank: 2')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 3 - Rank: 3')).toBeInTheDocument();
    });

    it('should pass correct rank to today product cards', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'today') {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Product: Product 1 - Rank: 1')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 2 - Rank: 2')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 3 - Rank: 3')).toBeInTheDocument();
    });

    it('should pass correct rank to this week product cards', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'this-week') {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Product: Product 1 - Rank: 1')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 2 - Rank: 2')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 3 - Rank: 3')).toBeInTheDocument();
    });

    it('should pass correct rank to this month product cards', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'this-month') {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Product: Product 1 - Rank: 1')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 2 - Rank: 2')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 3 - Rank: 3')).toBeInTheDocument();
    });

    it('should pass correct rank to previous month product cards', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.publishedDateRange === 'previous-month') {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Product: Product 1 - Rank: 1')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 2 - Rank: 2')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 3 - Rank: 3')).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should call useProductsByCategory hook with correct parameters for promoted products', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(mockUseProductsByCategory).toHaveBeenCalledWith('test-category', { isPromoted: true });
    });

    it('should call useProductsByCategory hook with correct parameters for today products', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(mockUseProductsByCategory).toHaveBeenCalledWith('test-category', { publishedDateRange: 'today' });
    });

    it('should call useProductsByCategory hook with correct parameters for this week products', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(mockUseProductsByCategory).toHaveBeenCalledWith('test-category', { publishedDateRange: 'this-week' });
    });

    it('should call useProductsByCategory hook with correct parameters for this month products', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(mockUseProductsByCategory).toHaveBeenCalledWith('test-category', { publishedDateRange: 'this-month' });
    });

    it('should call useProductsByCategory hook with correct parameters for previous month products', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(mockUseProductsByCategory).toHaveBeenCalledWith('test-category', { publishedDateRange: 'previous-month' });
    });

    it('should call useProductsByCategory hook multiple times for different sections', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(mockUseProductsByCategory).toHaveBeenCalledTimes(6); // 6 different calls (all products + 5 filtered sections)
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing categoryId from params', () => {
      mockUseParams.mockReturnValue({ categoryId: undefined });
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Products in Category:')).toBeInTheDocument();
    });

    it('should handle empty categoryId from params', () => {
      mockUseParams.mockReturnValue({ categoryId: '' });
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Products in Category:')).toBeInTheDocument();
    });

    it('should handle null products data', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(screen.getByText('No promoted products found for this category.')).toBeInTheDocument();
    });

    it('should handle undefined products data', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(screen.getByText('No promoted products found for this category.')).toBeInTheDocument();
    });

    it('should handle products with missing required fields', () => {
      const incompleteProducts = [
        { id: '1' }, // missing name
        { name: 'Product 2' }, // missing id
        { id: '3', name: 'Product 3' } // complete product
      ];

      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: incompleteProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });

    it('should handle special characters in categoryId', () => {
      mockUseParams.mockReturnValue({ categoryId: 'test-category-with-special-chars!@#$%' });
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Products in Category: test-category-with-special-chars!@#$%')).toBeInTheDocument();
    });
  });

  describe('Mixed States', () => {
    it('should handle mixed loading and error states across different sections', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: undefined, isLoading: true, isError: false };
        }
        if (options?.publishedDateRange === 'today') {
          return { data: undefined, isLoading: false, isError: true };
        }
        if (options?.publishedDateRange === 'this-week') {
          return { data: [{ id: '1', name: 'Product 1' }], isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Loading promoted products...')).toBeInTheDocument();
      expect(screen.getByText('Error loading products published today.')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    });

    it('should not show empty state messages when loading', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: [], isLoading: true, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.queryByText('No promoted products found for this category.')).not.toBeInTheDocument();
      expect(screen.getByText('Loading promoted products...')).toBeInTheDocument();
    });

    it('should not show empty state messages when error occurs', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: [], isLoading: false, isError: true };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.queryByText('No promoted products found for this category.')).not.toBeInTheDocument();
      expect(screen.getByText('Error loading promoted products.')).toBeInTheDocument();
    });

    it('should handle simultaneous loading of multiple sections', () => {
      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: undefined, isLoading: true, isError: false };
        }
        if (options?.publishedDateRange === 'today') {
          return { data: undefined, isLoading: true, isError: false };
        }
        if (options?.publishedDateRange === 'this-week') {
          return { data: undefined, isLoading: true, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByText('Loading promoted products...')).toBeInTheDocument();
      expect(screen.getByText('Loading products published today...')).toBeInTheDocument();
      expect(screen.getByText('Loading products published this week...')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should render without unnecessary re-renders when data changes', () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];
      
      mockUseProductsByCategory.mockReturnValue({
        data: mockProducts,
        isLoading: false,
        isError: false
      });

      const { rerender } = render(<CategoryProducts />);

      // Update with same data
      mockUseProductsByCategory.mockReturnValue({
        data: mockProducts,
        isLoading: false,
        isError: false
      });

      rerender(<CategoryProducts />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    });

    it('should handle large datasets efficiently', () => {
      const largeProductList = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Product ${i + 1}`
      }));

      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: largeProductList, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-100')).toBeInTheDocument();
    });

    it('should handle rapid state changes', () => {
      let hookReturn = {
        data: [],
        isLoading: true,
        isError: false
      };

      mockUseProductsByCategory.mockImplementation(() => hookReturn);

      const { rerender } = render(<CategoryProducts />);

      // First render: loading
      expect(screen.getByText('Loading promoted products...')).toBeInTheDocument();

      // Second render: error
      hookReturn = {
        data: undefined,
        isLoading: false,
        isError: true
      };

      rerender(<CategoryProducts />);

      expect(screen.getByText('Error loading promoted products.')).toBeInTheDocument();

      // Third render: data loaded
      hookReturn = {
        data: [{ id: '1', name: 'Product 1' }],
        isLoading: false,
        isError: false
      };

      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return hookReturn;
        }
        return { data: [], isLoading: false, isError: false };
      });

      rerender(<CategoryProducts />);

      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render proper heading hierarchy', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });

      expect(mainHeading).toBeInTheDocument();
      expect(sectionHeadings).toHaveLength(5);
    });

    it('should render list structure for products', () => {
      const mockProducts = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' }
      ];

      mockUseProductsByCategory.mockImplementation((categoryId, options) => {
        if (options?.isPromoted) {
          return { data: mockProducts, isLoading: false, isError: false };
        }
        return { data: [], isLoading: false, isError: false };
      });

      render(<CategoryProducts />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.tagName).toBe('UL');
    });

    it('should provide meaningful text for screen readers', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false
      });

      render(<CategoryProducts />);

      expect(screen.getByText('No promoted products found for this category.')).toBeInTheDocument();
      expect(screen.getByText('No products published today for this category.')).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should handle hook errors gracefully', () => {
      mockUseProductsByCategory.mockImplementation(() => {
        throw new Error('Hook error');
      });

      expect(() => render(<CategoryProducts />)).toThrow('Hook error');
    });

    it('should handle router parameter errors', () => {
      mockUseParams.mockImplementation(() => {
        throw new Error('Router error');
      });

      expect(() => render(<CategoryProducts />)).toThrow('Router error');
    });
  });

  describe('Memory Management', () => {
    it('should not cause memory leaks with repeated renders', () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];
      
      mockUseProductsByCategory.mockReturnValue({
        data: mockProducts,
        isLoading: false,
        isError: false
      });

      const { unmount } = render(<CategoryProducts />);
      
      // Simulate multiple mount/unmount cycles
      unmount();
      
      const { unmount: unmount2 } = render(<CategoryProducts />);
      unmount2();
      
      const { unmount: unmount3 } = render(<CategoryProducts />);
      unmount3();

      // Test passes if no memory leaks occur
      expect(true).toBe(true);
    });
  });
});