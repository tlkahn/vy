import React from 'react';
import { useParams } from 'react-router-dom';
import LiveRoom from './LiveRoom';

const CategoryComponent = () => {
  const { id } = useParams();

  if (id == 4) {
    return (
      <>
        <LiveRoom />
      </>
    )
  } else {
    return (
      <div>
        <h2>Category {id}</h2>
      </div>
    );
  }
};

export default CategoryComponent;
