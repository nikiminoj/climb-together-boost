import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MyProducts from './pages/MyProducts';
import NotFound from './pages/NotFound';
import CategoryProducts from './pages/CategoryProducts';
import NotificationsPage from './pages/Notifications';
import ProtectedRoute from '@/components/ProtectedRoute';
import Categories from './pages/Categories';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/u/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/user/my-products" element={<MyProducts />} />
            <Route path="/categories/:categoryId" element={<CategoryProducts />} />
            <Route path="/categories" element={<Categories />} />{' '}
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
