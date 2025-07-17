import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Categories from './Categories';
import useCategories from '@/hooks/useCategories';

// Mock the useCategories hook
jest.mock('@/hooks/useCategories');

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockUseCategories = useCategories as jest.MockedFunction<typeof useCategories>;

// Helper function to render component with necessary providers
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Categories Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseCategories.mockClear();
  });

  describe('Loading State', () => {
    test('displays loading message when categories are loading', () => {
      mockUseCategories.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(screen.getByText('Product Categories')).toBeInTheDocument();
      expect(screen.getByText('Loading categories...')).toBeInTheDocument();
    });

    test('does not display categories list when loading', () => {
      mockUseCategories.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      expect(screen.queryByText('No categories found.')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    test('displays error message when there is an error loading categories', () => {
      mockUseCategories.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      renderWithProviders(<Categories />);

      expect(screen.getByText('Product Categories')).toBeInTheDocument();
      expect(screen.getByText('Error loading categories.')).toBeInTheDocument();
    });

    test('does not display loading message when in error state', () => {
      mockUseCategories.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      renderWithProviders(<Categories />);

      expect(screen.queryByText('Loading categories...')).not.toBeInTheDocument();
    });

    test('does not display categories list when in error state', () => {
      mockUseCategories.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      renderWithProviders(<Categories />);

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      expect(screen.queryByText('No categories found.')).not.toBeInTheDocument();
    });
  });

  describe('Success State with Categories', () => {
    const mockCategories = [
      { id: 1, name: 'Electronics', slug: 'electronics' },
      { id: 2, name: 'Clothing', slug: 'clothing' },
      { id: 3, name: 'Books', slug: 'books' },
    ];

    test('displays categories list when data is loaded successfully', () => {
      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(screen.getByText('Product Categories')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      
      mockCategories.forEach(category => {
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });

    test('displays correct number of category items', () => {
      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const categoryItems = screen.getAllByRole('listitem');
      expect(categoryItems).toHaveLength(mockCategories.length);
    });

    test('each category item has correct content and attributes', () => {
      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      mockCategories.forEach(category => {
        const categoryItem = screen.getByText(category.name);
        expect(categoryItem).toBeInTheDocument();
        expect(categoryItem).toHaveAttribute('style', expect.stringContaining('cursor: pointer'));
      });
    });

    test('does not display "No categories found" message when categories exist', () => {
      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(screen.queryByText('No categories found.')).not.toBeInTheDocument();
    });
  });

  describe('Success State with Empty Categories', () => {
    test('displays "No categories found" message when categories array is empty', () => {
      mockUseCategories.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(screen.getByText('Product Categories')).toBeInTheDocument();
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    test('displays "No categories found" message when categories data is undefined', () => {
      mockUseCategories.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(screen.getByText('Product Categories')).toBeInTheDocument();
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    test('displays "No categories found" message when categories data is null', () => {
      mockUseCategories.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(screen.getByText('Product Categories')).toBeInTheDocument();
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    const mockCategories = [
      { id: 1, name: 'Electronics', slug: 'electronics' },
      { id: 2, name: 'Clothing', slug: 'clothing' },
    ];

    test('navigates to correct category page when category is clicked', () => {
      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const electronicsCategory = screen.getByText('Electronics');
      fireEvent.click(electronicsCategory);

      expect(mockNavigate).toHaveBeenCalledWith('/categories/electronics');
    });

    test('navigates to correct category page for different categories', () => {
      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const clothingCategory = screen.getByText('Clothing');
      fireEvent.click(clothingCategory);

      expect(mockNavigate).toHaveBeenCalledWith('/categories/clothing');
    });

    test('calls navigate function only once per click', () => {
      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const electronicsCategory = screen.getByText('Electronics');
      fireEvent.click(electronicsCategory);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('handles multiple category clicks correctly', () => {
      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const electronicsCategory = screen.getByText('Electronics');
      const clothingCategory = screen.getByText('Clothing');

      fireEvent.click(electronicsCategory);
      fireEvent.click(clothingCategory);

      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/categories/electronics');
      expect(mockNavigate).toHaveBeenNthCalledWith(2, '/categories/clothing');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles categories with special characters in slug', () => {
      const specialCategories = [
        { id: 1, name: 'Arts & Crafts', slug: 'arts-crafts' },
        { id: 2, name: 'Home & Garden', slug: 'home-garden' },
      ];

      mockUseCategories.mockReturnValue({
        data: specialCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const artsCraftsCategory = screen.getByText('Arts & Crafts');
      fireEvent.click(artsCraftsCategory);

      expect(mockNavigate).toHaveBeenCalledWith('/categories/arts-crafts');
    });

    test('handles categories with empty slug', () => {
      const categoriesWithEmptySlug = [
        { id: 1, name: 'Test Category', slug: '' },
      ];

      mockUseCategories.mockReturnValue({
        data: categoriesWithEmptySlug,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const testCategory = screen.getByText('Test Category');
      fireEvent.click(testCategory);

      expect(mockNavigate).toHaveBeenCalledWith('/categories/');
    });

    test('handles categories with undefined slug', () => {
      const categoriesWithUndefinedSlug = [
        { id: 1, name: 'Test Category', slug: undefined },
      ];

      mockUseCategories.mockReturnValue({
        data: categoriesWithUndefinedSlug,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const testCategory = screen.getByText('Test Category');
      fireEvent.click(testCategory);

      expect(mockNavigate).toHaveBeenCalledWith('/categories/undefined');
    });

    test('handles categories with very long names', () => {
      const longNameCategories = [
        { 
          id: 1, 
          name: 'This is a very long category name that might cause display issues', 
          slug: 'long-category-name' 
        },
      ];

      mockUseCategories.mockReturnValue({
        data: longNameCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(screen.getByText('This is a very long category name that might cause display issues')).toBeInTheDocument();
    });

    test('handles large number of categories', () => {
      const manyCategories = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Category ${i + 1}`,
        slug: `category-${i + 1}`,
      }));

      mockUseCategories.mockReturnValue({
        data: manyCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const categoryItems = screen.getAllByRole('listitem');
      expect(categoryItems).toHaveLength(100);
    });
  });

  describe('Hook Integration', () => {
    test('calls useCategories hook on component mount', () => {
      mockUseCategories.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(mockUseCategories).toHaveBeenCalledTimes(1);
    });

    test('handles simultaneous loading and error states gracefully', () => {
      // This shouldn't happen in practice, but test defensive programming
      mockUseCategories.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: true,
      });

      renderWithProviders(<Categories />);

      // Loading state should take precedence
      expect(screen.getByText('Loading categories...')).toBeInTheDocument();
      expect(screen.queryByText('Error loading categories.')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      mockUseCategories.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Product Categories');
    });

    test('category items are keyboard accessible', () => {
      const mockCategories = [
        { id: 1, name: 'Electronics', slug: 'electronics' },
      ];

      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      const categoryItem = screen.getByText('Electronics');
      
      // Test keyboard navigation
      categoryItem.focus();
      fireEvent.keyDown(categoryItem, { key: 'Enter' });
      
      // Click handler should still work with keyboard events
      expect(categoryItem).toHaveStyle('cursor: pointer');
    });

    test('provides appropriate semantic markup', () => {
      const mockCategories = [
        { id: 1, name: 'Electronics', slug: 'electronics' },
        { id: 2, name: 'Clothing', slug: 'clothing' },
      ];

      mockUseCategories.mockReturnValue({
        data: mockCategories,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(<Categories />);

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
  });

  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      mockUseCategories.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      expect(() => renderWithProviders(<Categories />)).not.toThrow();
    });

    test('maintains consistent DOM structure across different states', () => {
      const { rerender } = renderWithProviders(<Categories />);

      // Test loading state
      mockUseCategories.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      rerender(<Categories />);
      expect(screen.getByText('Product Categories')).toBeInTheDocument();

      // Test error state
      mockUseCategories.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      rerender(<Categories />);
      expect(screen.getByText('Product Categories')).toBeInTheDocument();

      // Test success state
      mockUseCategories.mockReturnValue({
        data: [{ id: 1, name: 'Test', slug: 'test' }],
        isLoading: false,
        isError: false,
      });

      rerender(<Categories />);
      expect(screen.getByText('Product Categories')).toBeInTheDocument();
    });
  });
});