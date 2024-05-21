import React from 'react';
import { useParams } from 'react-router-dom';

const SequenceComponent = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Sequence {id}</h2>
    </div>
  );
};

export default SequenceComponent;
