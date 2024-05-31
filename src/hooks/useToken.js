import { useState, useEffect } from 'react';

const useToken = (url) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch(url);
      const data = await response.text();
      setToken(data);
    };

    fetchToken();
  }, [url]);

  return token;
};

export default useToken;
