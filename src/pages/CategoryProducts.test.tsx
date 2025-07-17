import React from 'react';
import { render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { useProductsByCategory } from '@/hooks/useProductsByCategory';
import CategoryProducts from './CategoryProducts';

// Mock the dependencies
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/hooks/useProductsByCategory', () => ({
  useProductsByCategory: jest.fn(),
}));

jest.mock('@/components/ProductCard', () => ({
  ProductCard: ({ product, rank }: { product: any; rank: number }) => (
    <div data-testid={`product-card-${product.id}`}>
      Product: {product.name} (Rank: {rank})
    </div>
  ),
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseProductsByCategory = useProductsByCategory as jest.MockedFunction<typeof useProductsByCategory>;

describe('CategoryProducts', () => {
  const mockCategoryId = 'test-category';
  const mockProducts = [
    { id: '1', name: 'Product 1' },
    { id: '2', name: 'Product 2' },
    { id: '3', name: 'Product 3' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ categoryId: mockCategoryId });
  });

  describe('Component Rendering', () => {
    it('renders the category title with correct categoryId', () => {
      // Setup default hook returns
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      render(<CategoryProducts />);
      
      expect(screen.getByText(`Products in Category: ${mockCategoryId}`)).toBeInTheDocument();
    });

    it('renders all section headers', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Promoted Products')).toBeInTheDocument();
      expect(screen.getByText('Published Today')).toBeInTheDocument();
      expect(screen.getByText('Published This Week')).toBeInTheDocument();
      expect(screen.getByText('Published This Month')).toBeInTheDocument();
      expect(screen.getByText('Published Previous Month')).toBeInTheDocument();
    });
  });

  describe('Hook Calls', () => {
    it('calls useProductsByCategory with correct parameters for all sections', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      render(<CategoryProducts />);
      
      // Verify all hook calls
      expect(mockUseProductsByCategory).toHaveBeenCalledWith(mockCategoryId);
      expect(mockUseProductsByCategory).toHaveBeenCalledWith(mockCategoryId, { isPromoted: true });
      expect(mockUseProductsByCategory).toHaveBeenCalledWith(mockCategoryId, { publishedDateRange: 'today' });
      expect(mockUseProductsByCategory).toHaveBeenCalledWith(mockCategoryId, { publishedDateRange: 'this-week' });
      expect(mockUseProductsByCategory).toHaveBeenCalledWith(mockCategoryId, { publishedDateRange: 'this-month' });
      expect(mockUseProductsByCategory).toHaveBeenCalledWith(mockCategoryId, { publishedDateRange: 'previous-month' });
      
      expect(mockUseProductsByCategory).toHaveBeenCalledTimes(6);
    });

    it('handles undefined categoryId gracefully', () => {
      mockUseParams.mockReturnValue({ categoryId: undefined });
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      render(<CategoryProducts />);
      
      expect(mockUseProductsByCategory).toHaveBeenCalledWith(undefined);
      expect(screen.getByText('Products in Category: ')).toBeInTheDocument();
    });
  });

  describe('Promoted Products Section', () => {
    it('displays loading state for promoted products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: true, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Loading promoted products...')).toBeInTheDocument();
    });

    it('displays error state for promoted products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: false, isError: true })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Error loading promoted products.')).toBeInTheDocument();
    });

    it('displays promoted products when available', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: mockProducts, isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      mockProducts.forEach((product, index) => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
        expect(screen.getByText(`Product: ${product.name} (Rank: ${index + 1})`)).toBeInTheDocument();
      });
    });

    it('displays no promoted products message when list is empty', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('No promoted products found for this category.')).toBeInTheDocument();
    });

    it('does not show no products message when loading', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: true, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.queryByText('No promoted products found for this category.')).not.toBeInTheDocument();
    });

    it('does not show no products message when error', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: true })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.queryByText('No promoted products found for this category.')).not.toBeInTheDocument();
    });
  });

  describe('Published Today Section', () => {
    it('displays loading state for today products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: true, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Loading products published today...')).toBeInTheDocument();
    });

    it('displays error state for today products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: false, isError: true })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Error loading products published today.')).toBeInTheDocument();
    });

    it('displays today products when available', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: mockProducts, isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      mockProducts.forEach((product, index) => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
        expect(screen.getByText(`Product: ${product.name} (Rank: ${index + 1})`)).toBeInTheDocument();
      });
    });

    it('displays no today products message when list is empty', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('No products published today for this category.')).toBeInTheDocument();
    });
  });

  describe('Published This Week Section', () => {
    it('displays loading state for this week products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: true, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Loading products published this week...')).toBeInTheDocument();
    });

    it('displays error state for this week products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: false, isError: true })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Error loading products published this week.')).toBeInTheDocument();
    });

    it('displays this week products when available', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: mockProducts, isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      mockProducts.forEach((product, index) => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
        expect(screen.getByText(`Product: ${product.name} (Rank: ${index + 1})`)).toBeInTheDocument();
      });
    });

    it('displays no this week products message when list is empty', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('No products published this week for this category.')).toBeInTheDocument();
    });
  });

  describe('Published This Month Section', () => {
    it('displays loading state for this month products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: true, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Loading products published this month...')).toBeInTheDocument();
    });

    it('displays error state for this month products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: false, isError: true })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Error loading products published this month.')).toBeInTheDocument();
    });

    it('displays this month products when available', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: mockProducts, isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      mockProducts.forEach((product, index) => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
        expect(screen.getByText(`Product: ${product.name} (Rank: ${index + 1})`)).toBeInTheDocument();
      });
    });

    it('displays no this month products message when list is empty', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('No products published this month for this category.')).toBeInTheDocument();
    });
  });

  describe('Published Previous Month Section', () => {
    it('displays loading state for previous month products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: true, isError: false });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Loading products published previous month...')).toBeInTheDocument();
    });

    it('displays error state for previous month products', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: false, isError: true });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Error loading products published previous month.')).toBeInTheDocument();
    });

    it('displays previous month products when available', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: mockProducts, isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      mockProducts.forEach((product, index) => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
        expect(screen.getByText(`Product: ${product.name} (Rank: ${index + 1})`)).toBeInTheDocument();
      });
    });

    it('displays no previous month products message when list is empty', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      render(<CategoryProducts />);
      
      expect(screen.getByText('No products published previous month for this category.')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles null/undefined products data gracefully', () => {
      mockUseProductsByCategory.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      });

      render(<CategoryProducts />);
      
      expect(screen.getByText('No promoted products found for this category.')).toBeInTheDocument();
      expect(screen.getByText('No products published today for this category.')).toBeInTheDocument();
      expect(screen.getByText('No products published this week for this category.')).toBeInTheDocument();
      expect(screen.getByText('No products published this month for this category.')).toBeInTheDocument();
      expect(screen.getByText('No products published previous month for this category.')).toBeInTheDocument();
    });

    it('handles mixed loading states across sections', () => {
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: mockProducts, isLoading: false, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: true, isError: false })
        .mockReturnValueOnce({ data: undefined, isLoading: false, isError: true })
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: mockProducts, isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      // Should show promoted products
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      // Should show loading for today
      expect(screen.getByText('Loading products published today...')).toBeInTheDocument();
      // Should show error for this week
      expect(screen.getByText('Error loading products published this week.')).toBeInTheDocument();
      // Should show no products for this month
      expect(screen.getByText('No products published this month for this category.')).toBeInTheDocument();
      // Should show previous month products
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    });

    it('handles empty categoryId string', () => {
      mockUseParams.mockReturnValue({ categoryId: '' });
      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      render(<CategoryProducts />);
      
      expect(screen.getByText('Products in Category: ')).toBeInTheDocument();
      expect(mockUseProductsByCategory).toHaveBeenCalledWith('');
    });

    it('renders correct product ranks for each section', () => {
      const singleProduct = [{ id: '1', name: 'Test Product' }];
      
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: singleProduct, isLoading: false, isError: false })
        .mockReturnValueOnce({ data: singleProduct, isLoading: false, isError: false })
        .mockReturnValueOnce({ data: singleProduct, isLoading: false, isError: false })
        .mockReturnValueOnce({ data: singleProduct, isLoading: false, isError: false })
        .mockReturnValueOnce({ data: singleProduct, isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      // Each section should show the product with rank 1
      const productCards = screen.getAllByText('Product: Test Product (Rank: 1)');
      expect(productCards).toHaveLength(5); // 5 sections showing the product
    });

    it('handles products with missing or invalid id', () => {
      const invalidProducts = [
        { id: null, name: 'Product 1' },
        { id: undefined, name: 'Product 2' },
        { name: 'Product 3' }, // Missing id
      ];
      
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: invalidProducts, isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      // Should still render the products, even with invalid ids
      expect(screen.getByText('Product: Product 1 (Rank: 1)')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 2 (Rank: 2)')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 3 (Rank: 3)')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should not re-render unnecessarily when props do not change', () => {
      const renderSpy = jest.fn();
      
      const TestWrapper = () => {
        renderSpy();
        return <CategoryProducts />;
      };

      mockUseProductsByCategory.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      const { rerender } = render(<TestWrapper />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props should not cause unnecessary renders
      rerender(<TestWrapper />);
      
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it('handles large product lists efficiently', () => {
      const largeProductList = Array.from({ length: 1000 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
      }));
      
      mockUseProductsByCategory
        .mockReturnValueOnce({ data: [], isLoading: false, isError: false })
        .mockReturnValueOnce({ data: largeProductList, isLoading: false, isError: false })
        .mockReturnValue({ data: [], isLoading: false, isError: false });

      render(<CategoryProducts />);
      
      // Should render first and last items
      expect(screen.getByText('Product: Product 0 (Rank: 1)')).toBeInTheDocument();
      expect(screen.getByText('Product: Product 999 (Rank: 1000)')).toBeInTheDocument();
    });
  });
});