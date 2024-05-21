import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryComponent = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Category {id}</h2>
    </div>
  );
};

export default CategoryComponent;
