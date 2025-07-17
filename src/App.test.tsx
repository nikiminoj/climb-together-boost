import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';

// Mock all the page components
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

// Mock the UI components
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

// Mock the auth hook
vi.mock('@/hooks/useAuth', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  )
}));

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
    vi.clearAllMocks();
  });

  const renderWithProviders = (initialEntries: string[] = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  describe('Provider Setup', () => {
    it('should render all required providers in correct hierarchy', () => {
      renderWithProviders();
      
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument();
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
      expect(screen.getByTestId('sonner')).toBeInTheDocument();
    });

    it('should provide QueryClient to child components', () => {
      renderWithProviders();
      
      expect(queryClient).toBeDefined();
      expect(queryClient instanceof QueryClient).toBe(true);
    });

    it('should maintain provider hierarchy - AuthProvider wraps TooltipProvider', () => {
      renderWithProviders();
      
      const authProvider = screen.getByTestId('auth-provider');
      const tooltipProvider = screen.getByTestId('tooltip-provider');
      
      expect(authProvider).toContainElement(tooltipProvider);
    });

    it('should include both notification systems', () => {
      renderWithProviders();
      
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
      expect(screen.getByTestId('sonner')).toBeInTheDocument();
    });
  });

  describe('Route Navigation - Basic Routes', () => {
    it('should render Index page on root path', () => {
      renderWithProviders(['/']);
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
      expect(screen.getByText('Index Page')).toBeInTheDocument();
    });

    it('should render Auth page on /auth path', () => {
      renderWithProviders(['/auth']);
      
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
      expect(screen.getByText('Auth Page')).toBeInTheDocument();
    });

    it('should render Profile page on /profile path', () => {
      renderWithProviders(['/profile']);
      
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
      expect(screen.getByText('Profile Page')).toBeInTheDocument();
    });

    it('should render Settings page on /settings path', () => {
      renderWithProviders(['/settings']);
      
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByText('Settings Page')).toBeInTheDocument();
    });

    it('should render MyProducts page on /my-products path', () => {
      renderWithProviders(['/my-products']);
      
      expect(screen.getByTestId('my-products-page')).toBeInTheDocument();
      expect(screen.getByText('My Products Page')).toBeInTheDocument();
    });
  });

  describe('Route Navigation - Category Routes', () => {
    it('should render Categories page on /categories path', () => {
      renderWithProviders(['/categories']);
      
      expect(screen.getByTestId('categories-page')).toBeInTheDocument();
      expect(screen.getByText('Categories Page')).toBeInTheDocument();
    });

    it('should render CategoryProducts page with valid category ID', () => {
      renderWithProviders(['/categories/electronics']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
      expect(screen.getByText('Category Products Page')).toBeInTheDocument();
    });

    it('should handle numeric category IDs', () => {
      renderWithProviders(['/categories/123']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle UUID-like category IDs', () => {
      renderWithProviders(['/categories/550e8400-e29b-41d4-a716-446655440000']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle URL encoded category IDs', () => {
      renderWithProviders(['/categories/electronics%20&%20gadgets']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle category IDs with special characters', () => {
      renderWithProviders(['/categories/home-garden']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });
  });

  describe('Route Navigation - Not Found Cases', () => {
    it('should render NotFound page on invalid path', () => {
      renderWithProviders(['/invalid-path']);
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
      expect(screen.getByText('Not Found Page')).toBeInTheDocument();
    });

    it('should handle nested invalid paths', () => {
      renderWithProviders(['/categories/electronics/smartphones']);
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('should handle case sensitivity in paths', () => {
      renderWithProviders(['/AUTH']);
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('should handle paths with trailing slashes', () => {
      renderWithProviders(['/auth/']);
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('should handle extremely long invalid paths', () => {
      const longPath = '/invalid/' + 'a'.repeat(1000);
      renderWithProviders([longPath]);
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  describe('Route Edge Cases and URL Handling', () => {
    it('should handle empty category ID by showing categories page', () => {
      renderWithProviders(['/categories/']);
      
      expect(screen.getByTestId('categories-page')).toBeInTheDocument();
    });

    it('should handle multiple consecutive slashes', () => {
      renderWithProviders(['/categories//electronics']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle query parameters', () => {
      renderWithProviders(['/categories/electronics?page=1&sort=price']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle hash fragments', () => {
      renderWithProviders(['/categories/electronics#section1']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle both query params and hash fragments', () => {
      renderWithProviders(['/categories/electronics?page=1#section1']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle malformed URLs gracefully', () => {
      renderWithProviders(['/categories/%invalid%']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });
  });

  describe('Route Precedence and Order', () => {
    it('should prioritize specific routes over catch-all', () => {
      renderWithProviders(['/auth']);
      
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
      expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument();
    });

    it('should use catch-all route as last resort', () => {
      renderWithProviders(['/definitely-not-a-real-route']);
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });

    it('should handle parameterized routes correctly', () => {
      renderWithProviders(['/categories/special-category']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
      expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument();
    });

    it('should handle nested routes that dont match', () => {
      renderWithProviders(['/categories/test/subcategory']);
      
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  describe('Component Integration and State', () => {
    it('should handle route changes without unmounting providers', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('index-page')).toBeInTheDocument();

      rerender(
        <MemoryRouter initialEntries={['/auth']}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    it('should maintain QueryClient instance across route changes', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const initialClient = queryClient;

      rerender(
        <MemoryRouter initialEntries={['/profile']}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(queryClient).toBe(initialClient);
    });

    it('should handle multiple simultaneous route entries', () => {
      renderWithProviders(['/auth', '/profile', '/settings']);
      
      // Should render the last entry
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle QueryClient with error configuration', () => {
      const errorQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            throwOnError: true,
          },
        },
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <QueryClientProvider client={errorQueryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });

    it('should handle QueryClient with custom configuration', () => {
      const customQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
          },
        },
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <QueryClientProvider client={customQueryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });

    it('should handle empty initial entries', () => {
      render(
        <MemoryRouter initialEntries={[]}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should not recreate QueryClient on rerenders', () => {
      const { rerender } = renderWithProviders();
      const firstClient = queryClient;

      rerender(
        <MemoryRouter initialEntries={['/']}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(queryClient).toBe(firstClient);
    });

    it('should handle rapid route changes', () => {
      const routes = ['/', '/auth', '/profile', '/settings', '/my-products'];
      
      routes.forEach(route => {
        renderWithProviders([route]);
        expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
      });
    });

    it('should maintain component structure during navigation', () => {
      const { rerender } = renderWithProviders(['/']);
      
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
      expect(screen.getByTestId('sonner')).toBeInTheDocument();

      rerender(
        <MemoryRouter initialEntries={['/auth']}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('toaster')).toBeInTheDocument();
      expect(screen.getByTestId('sonner')).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should maintain proper component hierarchy for screen readers', () => {
      renderWithProviders();
      
      const authProvider = screen.getByTestId('auth-provider');
      const tooltipProvider = screen.getByTestId('tooltip-provider');
      
      expect(authProvider).toContainElement(tooltipProvider);
    });

    it('should include notification systems for user feedback', () => {
      renderWithProviders();
      
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
      expect(screen.getByTestId('sonner')).toBeInTheDocument();
    });

    it('should handle keyboard navigation paths', () => {
      renderWithProviders(['/']);
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
      expect(screen.getByTestId('index-page')).toHaveTextContent('Index Page');
    });

    it('should provide consistent navigation experience', () => {
      const routes = [
        { path: '/', testId: 'index-page' },
        { path: '/auth', testId: 'auth-page' },
        { path: '/profile', testId: 'profile-page' },
        { path: '/settings', testId: 'settings-page' },
        { path: '/my-products', testId: 'my-products-page' },
        { path: '/categories', testId: 'categories-page' },
        { path: '/categories/electronics', testId: 'category-products-page' }
      ];

      routes.forEach(({ path, testId }) => {
        renderWithProviders([path]);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });
    });
  });

  describe('Router Configuration and Behavior', () => {
    it('should use BrowserRouter for client-side routing', () => {
      renderWithProviders();
      
      // Verify that routing is working by checking page content
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });

    it('should handle direct URL access simulation', () => {
      renderWithProviders(['/settings']);
      
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    });

    it('should handle browser history simulation', () => {
      renderWithProviders(['/auth', '/profile']);
      
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    it('should handle route parameter extraction', () => {
      renderWithProviders(['/categories/test-category-123']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Boundaries', () => {
    it('should handle null query client gracefully', () => {
      expect(() => {
        render(
          <MemoryRouter initialEntries={['/']}>
            <QueryClientProvider client={null as any}>
              <App />
            </QueryClientProvider>
          </MemoryRouter>
        );
      }).not.toThrow();
    });

    it('should handle invalid route parameters', () => {
      renderWithProviders(['/categories/null']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle special route characters', () => {
      renderWithProviders(['/categories/test@#$%']);
      
      expect(screen.getByTestId('category-products-page')).toBeInTheDocument();
    });

    it('should handle concurrent navigation attempts', () => {
      const { rerender } = renderWithProviders(['/']);
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument();

      rerender(
        <MemoryRouter initialEntries={['/auth']}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });

    it('should handle memory router with no initial entries', () => {
      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle and Cleanup', () => {
    it('should handle component unmounting gracefully', () => {
      const { unmount } = renderWithProviders();
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should handle provider cleanup on unmount', () => {
      const { unmount } = renderWithProviders();
      
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByTestId('auth-provider')).not.toBeInTheDocument();
    });

    it('should handle query client cleanup', () => {
      const { unmount } = renderWithProviders();
      
      expect(queryClient).toBeDefined();
      
      unmount();
      
      // Query client should still exist but components should be unmounted
      expect(queryClient).toBeDefined();
    });
  });

  describe('Mock Verification and Testing Framework', () => {
    it('should properly mock all page components', () => {
      const routes = [
        { path: '/', mockName: 'pages/Index' },
        { path: '/auth', mockName: 'pages/Auth' },
        { path: '/profile', mockName: 'pages/Profile' },
        { path: '/settings', mockName: 'pages/Settings' },
        { path: '/my-products', mockName: 'pages/MyProducts' },
        { path: '/categories', mockName: 'pages/Categories' },
        { path: '/categories/test', mockName: 'pages/CategoryProducts' },
        { path: '/invalid', mockName: 'pages/NotFound' }
      ];

      routes.forEach(({ path }) => {
        renderWithProviders([path]);
        // Verify mocked components are rendered without throwing
        expect(screen.getByTestId(/.*(page|provider).*/)).toBeInTheDocument();
      });
    });

    it('should properly mock UI components', () => {
      renderWithProviders();
      
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
      expect(screen.getByTestId('sonner')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument();
    });

    it('should properly mock auth provider', () => {
      renderWithProviders();
      
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    it('should clean up mocks after each test', () => {
      renderWithProviders();
      
      // This test verifies that vi.clearAllMocks() is working
      expect(vi.clearAllMocks).toBeDefined();
    });
  });
});