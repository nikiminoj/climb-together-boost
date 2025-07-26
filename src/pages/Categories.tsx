
import React from 'react';
import useCategories from '@/hooks/useCategories';
import { useNavigate } from 'react-router-dom';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading, isError } = useCategories();

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
      {categories && categories.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <li key={category.id} onClick={() => navigate(`/categories/${category.slug || category.id}`)} style={{ cursor: 'pointer' }}>
              {category.name}
            </li>
          ))}
        </ul>
      ) : (<p>No categories found.</p>)}
    </div>
  );
};

export default Categories;
