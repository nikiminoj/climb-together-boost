import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { SubmitProductForm } from '@/components/SubmitProductForm';
import { Leaderboard } from '@/components/Leaderboard';
import { UserStats } from '@/components/UserStats';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, Star, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import useUserData from '@/hooks/useUserData'; // Assuming useUserData is a default export

const Index = () => {
  // TODO: Fetch product data from Supabase based on timeFilter
  // const [products, setProducts] = useState([]);
  // TODO: Fetch current user data (including points and dailyLimits) from Supabase
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: isLoadingUserData,
    isError: isErrorUserData,
  } = useUserData(user?.id || null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [timeFilter, setTimeFilter] = useState('today');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Climbr
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Turn every builder into an evangelist. Climb the rankings by lifting
            others in our community-driven product directory.
          </p>
          <Button
            onClick={() => {
              if (user) {
                setShowSubmitForm(true);
              } else {
                toast({
                  title: 'Login required',
                  description: 'You need to be logged in to submit a product.',
                  variant: 'destructive',
                });
                navigate('/auth');
              }
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Submit Your Product
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* TODO: Pass fetched user data to UserStats */}
            {!isLoadingUserData && !isErrorUserData && userData && (
              <UserStats user={userData} />
            )}
            <Leaderboard />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="products"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="leaderboard"
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Top Performers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-6">
                {/* Time Filter */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    Filter by:
                  </span>
                  <div className="flex gap-2">
                    {['today', 'week', 'month', 'all'].map((filter) => (
                      <Button
                        key={filter}
                        variant={timeFilter === filter ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeFilter(filter)}
                        className="capitalize"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {filter === 'all' ? 'All Time' : filter}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {/* TODO: Map over fetched product data to render ProductCard components */}
                </div>
              </TabsContent>

              <TabsContent value="leaderboard">
                {/* TODO: Fetch and display leaderboard data here */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Submit Product Modal */}
      {showSubmitForm && (
        <SubmitProductForm onClose={() => setShowSubmitForm(false)} />
      )}
    </div>
  );
};

export default Index;
