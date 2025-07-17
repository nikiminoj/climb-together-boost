import React from 'react';
import useCategories from '@/hooks/useCategories'; // Import the useCategories hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Categories: React.FC = () => {
  const navigate = useNavigate(); // Get the navigate function
  const { data: categories, isLoading, isError } = useCategories(); // Use the hook

  if (isLoading) {
    return (
      <div>
        <h1>Product Categories</h1>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1>Product Categories</h1>
        <p>Error loading categories.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Product Categories</h1>
      {categories?.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <li key={category.id} onClick={() => navigate(`/categories/${category.slug}`)} style={{ cursor: 'pointer' }}>{category.name}</li> // Make category clickable and navigate
          ))}
        </ul>
      ) : (<p>No categories found.</p>)}
    </div>
  );
};

export default Categories;