import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductsByCategory } from "@/hooks/useProductsByCategory";

import { ProductCard } from "@/components/ProductCard";
const CategoryProducts: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: products, isLoading, isError } = useProductsByCategory(categoryId);

  const { data: promotedProducts, isLoading: isLoadingPromoted, isError: isErrorPromoted } = useProductsByCategory(categoryId, { isPromoted: true });
  const { data: todayProducts, isLoading: isLoadingToday, isError: isErrorToday } = useProductsByCategory(categoryId, { publishedDateRange: 'today' });
  const { data: thisWeekProducts, isLoading: isLoadingThisWeek, isError: isErrorThisWeek } = useProductsByCategory(categoryId, { publishedDateRange: 'this-week' });
  const { data: thisMonthProducts, isLoading: isLoadingThisMonth, isError: isErrorThisMonth } = useProductsByCategory(categoryId, { publishedDateRange: 'this-month' });
  const { data: previousMonthProducts, isLoading: isLoadingPreviousMonth, isError: isErrorPreviousMonth } = useProductsByCategory(categoryId, { publishedDateRange: 'previous-month' });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products in Category: {categoryId}</h1>

      {/* Promoted Products Section */}
      <h2 className="text-2xl font-bold mb-4">Promoted Products</h2>
      {isLoadingPromoted && <p>Loading promoted products...</p>}
      {isErrorPromoted && <p>Error loading promoted products.</p>}
      {promotedProducts && promotedProducts.length > 0 ? (
        <ul>
          {promotedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </ul>
      ) : (
        !isLoadingPromoted && !isErrorPromoted && <p>No promoted products found for this category.</p>
      )}

      {/* Published Today Section */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Published Today</h2>
      {isLoadingToday && <p>Loading products published today...</p>}
      {isErrorToday && <p>Error loading products published today.</p>}
      {todayProducts && todayProducts.length > 0 ? (
        <ul>
          {todayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </ul>
      ) : (
        !isLoadingToday && !isErrorToday && <p>No products published today for this category.</p>
      )}

      {/* Published This Week Section */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Published This Week</h2>
      {isLoadingThisWeek && <p>Loading products published this week...</p>}
      {isErrorThisWeek && <p>Error loading products published this week.</p>}
      {thisWeekProducts && thisWeekProducts.length > 0 ? (
        <ul>
          {thisWeekProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </ul>
      ) : (
        !isLoadingThisWeek && !isErrorThisWeek && <p>No products published this week for this category.</p>
      )}

      {/* Published This Month Section */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Published This Month</h2>
      {isLoadingThisMonth && <p>Loading products published this month...</p>}
      {isErrorThisMonth && <p>Error loading products published this month.</p>}
      {thisMonthProducts && thisMonthProducts.length > 0 ? (
        <ul>
          {thisMonthProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </ul>
      ) : (
        !isLoadingThisMonth && !isErrorThisMonth && <p>No products published this month for this category.</p>
      )}

      {/* Published Previous Month Section */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Published Previous Month</h2>
      {isLoadingPreviousMonth && <p>Loading products published previous month...</p>}
      {isErrorPreviousMonth && <p>Error loading products published previous month.</p>}
      {previousMonthProducts && previousMonthProducts.length > 0 ? (
        <ul>
          {previousMonthProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </ul>
      ) : (
        !isLoadingPreviousMonth && !isErrorPreviousMonth && <p>No products published previous month for this category.</p>
      )}
    </div>
  );
};

export default CategoryProducts;