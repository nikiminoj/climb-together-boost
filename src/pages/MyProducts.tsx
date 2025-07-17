import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const MyProducts = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Submitted Products</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Fetch the logged-in user's products from Supabase */}
          {/* TODO: Conditionally render the list of products or this message */}
          <p className="text-gray-600">
            You haven't submitted any products yet. Start by adding your first
            product!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProducts;
