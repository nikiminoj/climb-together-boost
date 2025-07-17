import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  User,
  Bell,
  LogIn,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';

import useUserData from '@/hooks/useUserData';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: isLoadingUserData,
    isError: isErrorUserData,
  } = useUserData(user?.id);

  const {
    notifications,
    loading: isLoadingNotifications,
    error: isErrorNotifications,
  } = useNotifications();
  const recentNotifications = notifications?.slice(0, 5) || [];

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Climbr
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-gray-50 border-0 focus:bg-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
 <div className="p-2 text-sm font-semibold text-gray-700">Recent Notifications</div>
 {isLoadingNotifications && <DropdownMenuItem className="text-gray-500 italic">Loading notifications...</DropdownMenuItem>}
 {isErrorNotifications && <DropdownMenuItem className="text-red-500 italic">Error loading notifications.</DropdownMenuItem>}
 {/* Display "No new notifications" if there are no recent notifications after loading and no error */}
 {!isLoadingNotifications && !isErrorNotifications && recentNotifications.length === 0 && notifications && (
 <DropdownMenuItem className="text-gray-500 italic">No new notifications</DropdownMenuItem>
 )}
 {!isLoadingNotifications && !isErrorNotifications && recentNotifications.length > 0 && notifications && recentNotifications.map((notification) => (
 <DropdownMenuItem key={notification.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-100">
 {/* Render notification content here */}
 <div className="flex-1">{notification.message}</div>
                {/* Add a visual indicator if notification is not read */}
                {notification.isRead === false && (
 <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
 </DropdownMenuItem>
 ))}
 {!isLoadingNotifications && !isErrorNotifications && notifications && notifications.length > 0 && (
                  <>
 <DropdownMenuSeparator />
 <DropdownMenuItem asChild>
 <Link to="/notifications" className="w-full text-center text-blue-600 hover:underline">View All Notifications</Link>
 </DropdownMenuItem>
                  </>
 )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {user && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                {isLoadingUserData
                  ? 'Loading...'
                  : isErrorUserData
                    ? 'Error'
                    : `${userData?.points ?? 0} Points`}
              </Badge>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-products')}>
                    <Package className="h-4 w-4 mr-2" />
                    My Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
