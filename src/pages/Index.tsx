
import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { SubmitProductForm } from "@/components/SubmitProductForm";
import { Leaderboard } from "@/components/Leaderboard";
import { UserStats } from "@/components/UserStats";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, Star, Clock } from "lucide-react";

// Mock data for development
const mockProducts = [
  {
    id: 1,
    name: "TaskFlow Pro",
    description: "A revolutionary task management app that helps teams collaborate seamlessly",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    author: "Sarah Chen",
    points: 245,
    upvotes: 89,
    badges: ["Trending", "Product of the Day"],
    category: "Productivity",
    link: "https://taskflow.example.com"
  },
  {
    id: 2,
    name: "DesignMaster AI",
    description: "AI-powered design tool that creates stunning graphics in seconds",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
    author: "Mike Rodriguez",
    points: 198,
    upvotes: 67,
    badges: ["Hot"],
    category: "Design",
    link: "https://designmaster.example.com"
  },
  {
    id: 3,
    name: "CodeSnap",
    description: "Beautiful code screenshot generator with syntax highlighting",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    author: "Alex Kim",
    points: 156,
    upvotes: 45,
    badges: ["Rising"],
    category: "Developer Tools",
    link: "https://codesnap.example.com"
  }
];

const Index = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [timeFilter, setTimeFilter] = useState("today");
  const [currentUser] = useState({
    name: "Demo User",
    points: 67,
    rank: 12,
    dailyLimits: {
      sharing: { used: 8, max: 20 },
      upvoting: { used: 15, max: 20 },
      commenting: { used: 3, max: 20 },
      following: { used: 12, max: 40 }
    }
  });

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
            Turn every builder into an evangelist. Climb the rankings by lifting others in our community-driven product directory.
          </p>
          <Button 
            onClick={() => setShowSubmitForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Submit Your Product
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UserStats user={currentUser} />
            <Leaderboard />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Top Performers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-6">
                {/* Time Filter */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                  <div className="flex gap-2">
                    {["today", "week", "month", "all"].map((filter) => (
                      <Button
                        key={filter}
                        variant={timeFilter === filter ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeFilter(filter)}
                        className="capitalize"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {filter === "all" ? "All Time" : filter}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {mockProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      rank={index + 1}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="leaderboard">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Top Performers This Week</h2>
                  <div className="space-y-4">
                    {mockProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-purple-600">#{index + 1}</div>
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-600">by {product.author}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{product.points} pts</div>
                          <div className="text-sm text-gray-600">{product.upvotes} upvotes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
