import React, { useState, useEffect } from 'react';
import Jdenticon from 'react-jdenticon';

function OnlinerList() {
  const [onliners, setOnliners] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:3000/api/onlinersof');
      setOnliners(await response.json());
    })();
  }, []);

  return (
    <ul className="list-none">
      {onliners.map((onliner) => (
        <li key={onliner.id} className="flex items-center space-x-2">
          <Jdenticon size="48" value={onliner.alias} />
          <span className="text-sm">{onliner.alias}</span>
        </li>
      ))}
    </ul>
  );
}

export default OnlinerList;
