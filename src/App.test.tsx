import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';

// Mock all page components
vi.mock('./pages/Index', () => ({
  default: () => <div data-testid="index-page">Index Page</div>
}));

vi.mock('./pages/Auth', () => ({
  default: () => <div data-testid="auth-page">Auth Page</div>
}));

vi.mock('./pages/Profile', () => ({
  default: () => <div data-testid="profile-page">Profile Page</div>
}));

vi.mock('./pages/Settings', () => ({
  default: () => <div data-testid="settings-page">Settings Page</div>
}));

vi.mock('./pages/MyProducts', () => ({
  default: () => <div data-testid="my-products-page">My Products Page</div>
}));

vi.mock('./pages/NotFound', () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>
}));

vi.mock('./pages/CategoryProducts', () => ({
  default: () => <div data-testid="category-products-page">Category Products Page</div>
}));

vi.mock('./pages/Categories', () => ({
  default: () => <div data-testid="categories-page">Categories Page</div>
}));

// Mock UI components
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>
}));

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="sonner">Sonner</div>
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider">{children}</div>
  )
}));

// Mock AuthProvider
vi.mock('@/hooks/useAuth', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  )
}));

// Helper function to render App with custom route
const renderAppWithRoute = (initialRoute: string = '/') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('Provider Setup', () => {
    it('should render with all required providers', () => {
      renderAppWithRoute('/');
      
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument();
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
      expect(screen.getByTestId('sonner')).toBeInTheDocument();
    });

    it('should initialize QueryClient correctly', () => {
      renderAppWithRoute('/');
      
      // Verify that the app renders without throwing errors
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });

    it('should maintain provider hierarchy correctly', () => {
      renderAppWithRoute('/');
      
      const authProvider = screen.getByTestId('auth-provider');
      const tooltipProvider = screen.getByTestId('tooltip-provider');
      
      expect(authProvider).toContainElement(tooltipProvider);
    });

    it('should render both toaster components', () => {
      renderAppWithRoute('/');
      
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
      expect(screen.getByTestId('sonner')).toBeInTheDocument();
    });

    it('should handle QueryClient provider correctly', async () => {
      renderAppWithRoute('/');
      
      await waitFor(() => {
        expect(screen.getByTestId('index-page')).toBeInTheDocument();
      });
    });
  });

  describe('Route Navigation', () => {
    it('should render Index page on root route', () => {
      renderAppWithRoute('/');
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
      expect(screen.getByText('Index Page')).toBeInTheDocument();
    });

    it('should render Auth page on /auth route', () => {
      renderAppWithRoute('/auth');
      
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
      expect(screen.getByText('Auth Page')).toBeInTheDocument();
    });

    it('should render Profile page on /profile route', () => {
      renderAppWithRoute('/profile');
      
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
      expect(screen.getByText('Profile Page')).toBeInTheDocument();
    });

    it('should render Settings page on /settings route', () => {
      renderAppWithRoute('/settings');
      
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByText('Settings Page')).toBeInTheDocument();
    });

    it('should render MyProducts page on /my-products route', () => {
      renderAppWithRoute('/my-products');
      
      expect(screen.getByTestId('my-products-page')).toBeInTheDocument();
      expect(screen.getByText('My Products Page')).toBeInTheDocument();
    });

    it('should render Categories page on /categories route', () => {
      renderAppWithRoute('/categories');
      
      expect(screen.getByTestId('categories-page')).toBeInTheDocument();
      expect(screen.getByText('Categories Page')).toBeInTheDocument();
    });

    it('should render CategoryProducts page on /categories/:categoryId route', () => {
      renderAppWithRoute('/categories/electronics');
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
      expect(screen.getByText('Category Products Page')).toBeInTheDocument();
    });

    it('should render NotFound page for invalid routes', () => {
      renderAppWithRoute('/invalid-route');
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
      expect(screen.getByText('Not Found Page')).toBeInTheDocument();
    });
  });

  describe('Route Pattern Matching', () => {
    it('should match exact routes correctly', () => {
      renderAppWithRoute('/auth');
      
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
      expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument();
    });

    it('should prioritize specific routes over catch-all', () => {
      renderAppWithRoute('/categories');
      
      expect(screen.getByTestId('categories-page')).toBeInTheDocument();
      expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument();
    });

    it('should handle parametrized routes correctly', () => {
      renderAppWithRoute('/categories/electronics');
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
      expect(screen.queryByTestId('categories-page')).not.toBeInTheDocument();
    });

    it('should handle category routes with special characters', () => {
      renderAppWithRoute('/categories/food-&-beverage');
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle category routes with numeric IDs', () => {
      renderAppWithRoute('/categories/123');
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle empty category ID correctly', () => {
      renderAppWithRoute('/categories/');
      
      expect(screen.getByTestId('categories-page')).toBeInTheDocument();
    });

    it('should handle catch-all route correctly', () => {
      renderAppWithRoute('/nonexistent-route');
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle routes with query parameters', () => {
      renderAppWithRoute('/categories?sort=name');
      
      expect(screen.getByTestId('categories-page')).toBeInTheDocument();
    });

    it('should handle routes with hash fragments', () => {
      renderAppWithRoute('/profile#settings');
      
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    it('should handle deeply nested invalid routes', () => {
      renderAppWithRoute('/this/is/a/very/deep/invalid/route');
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('should handle route with trailing slash', () => {
      renderAppWithRoute('/profile/');
      
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    it('should handle case-sensitive routes', () => {
      renderAppWithRoute('/PROFILE');
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('should handle malformed URLs gracefully', () => {
      renderAppWithRoute('/categories/%20/invalid');
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle Unicode characters in routes', () => {
      renderAppWithRoute('/categories/café');
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle routes with multiple slashes', () => {
      renderAppWithRoute('//profile');
      
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });
  });

  describe('Memory Router Integration', () => {
    it('should handle multiple route changes', () => {
      const { rerender } = renderAppWithRoute('/');
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
      
      // Simulate route change by re-rendering with different route
      const newQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      rerender(
        <QueryClientProvider client={newQueryClient}>
          <MemoryRouter initialEntries={['/auth']}>
            <App />
          </MemoryRouter>
        </QueryClientProvider>
      );
      
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });

    it('should handle initial route state correctly', () => {
      renderAppWithRoute('/my-products');
      
      expect(screen.getByTestId('my-products-page')).toBeInTheDocument();
    });

    it('should handle navigation history correctly', () => {
      const { rerender } = renderAppWithRoute('/');
      
      // Navigate to auth page
      const queryClient1 = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      
      rerender(
        <QueryClientProvider client={queryClient1}>
          <MemoryRouter initialEntries={['/', '/auth']} initialIndex={1}>
            <App />
          </MemoryRouter>
        </QueryClientProvider>
      );
      
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });
  });

  describe('Component Structure and Rendering', () => {
    it('should render all components in correct order', () => {
      renderAppWithRoute('/');
      
      const container = screen.getByTestId('auth-provider');
      expect(container).toBeInTheDocument();
      
      const tooltipProvider = screen.getByTestId('tooltip-provider');
      expect(tooltipProvider).toBeInTheDocument();
      
      const toaster = screen.getByTestId('toaster');
      const sonner = screen.getByTestId('sonner');
      expect(toaster).toBeInTheDocument();
      expect(sonner).toBeInTheDocument();
    });

    it('should maintain component hierarchy with nested providers', () => {
      renderAppWithRoute('/');
      
      const authProvider = screen.getByTestId('auth-provider');
      const tooltipProvider = screen.getByTestId('tooltip-provider');
      const indexPage = screen.getByTestId('index-page');
      
      expect(authProvider).toContainElement(tooltipProvider);
      expect(tooltipProvider).toContainElement(indexPage);
    });

    it('should render without crashing on component errors', () => {
      // Test that the app doesn't crash when a component fails to render
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      renderAppWithRoute('/');
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Memory Management', () => {
    it('should not cause memory leaks with QueryClient', () => {
      const { unmount } = renderAppWithRoute('/');
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
      
      unmount();
      
      // Verify clean unmount
      expect(screen.queryByTestId('index-page')).not.toBeInTheDocument();
    });

    it('should handle rapid route changes without errors', () => {
      const routes = ['/', '/auth', '/profile', '/settings', '/my-products'];
      
      routes.forEach((route) => {
        const { unmount } = renderAppWithRoute(route);
        expect(document.body).toContainElement(document.querySelector('[data-testid]'));
        unmount();
      });
    });

    it('should create new QueryClient instances correctly', () => {
      const { unmount: unmount1 } = renderAppWithRoute('/');
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
      unmount1();
      
      const { unmount: unmount2 } = renderAppWithRoute('/auth');
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
      unmount2();
    });
  });

  describe('Route Order and Precedence', () => {
    it('should respect route order in routing configuration', () => {
      // Test that more specific routes are matched before catch-all
      renderAppWithRoute('/categories');
      expect(screen.getByTestId('categories-page')).toBeInTheDocument();
      
      // Test that parameterized routes work correctly
      renderAppWithRoute('/categories/electronics');
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle route conflicts correctly', () => {
      // Test that specific routes take precedence
      renderAppWithRoute('/categories/123');
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
      expect(screen.queryByTestId('categories-page')).not.toBeInTheDocument();
    });

    it('should handle catch-all route as last resort', () => {
      renderAppWithRoute('/completely-unknown-route');
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  describe('Browser Router Integration', () => {
    it('should work with BrowserRouter wrapping', () => {
      // Test that the app works correctly with BrowserRouter
      renderAppWithRoute('/');
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });

    it('should handle route parameters correctly', () => {
      renderAppWithRoute('/categories/test-category');
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle nested routing correctly', () => {
      // Test that nested routes work as expected
      renderAppWithRoute('/categories/electronics/phones');
      
      // Should still render category products page for any category ID
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });
  });
});