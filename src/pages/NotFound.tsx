import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-bold mb-4 animate-bounce">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! The page you're looking for doesn't exist.</p>

        <Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg'>
          <Home />
          <a href="/" className="">
            Return to Home
          </a>
        </Button>
        <Card>
          <CardContent>
            <CardHeader>
              <CardTitle>Looking for something specific?</CardTitle>
            </CardHeader>
            <CardDescription>
              <div>Try searching for products or browse our categories</div>
            </CardDescription>
            <CardFooter>
              <div className="flex items-center justify-center w-full">
              <a href="/" className='underline'>
                <div>Browse products</div>
              </a>
              </div>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
