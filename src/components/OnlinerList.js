import React, { useState, useEffect } from 'react';
import Jdenticon from 'react-jdenticon';

function OnlinerList() {
  const [onliners, setOnliners] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:3000/api/onliners');
      setOnliners(await response.json());
    })();
  }, []);

  return (
    <ul className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-4">
      {onliners.map((onliner) => (
        <li key={onliner.id} className="flex flex-col items-center">
          <Jdenticon size="48" value={onliner.alias} />
          <span className="text-sm">{onliner.alias}</span>
        </li>
      ))}
    </ul>
  );
}

export default OnlinerList;
