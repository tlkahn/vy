/**
 * Deprecated notice
 *
 * This hook `useToken` used to access Agora SDK is now deprecated and
 * not currently used by the project.  Please avoid using this hook in
 * any new code, as it may be removed in future updates.
 */

import { useState, useEffect } from 'react';

const useToken = (url, channel_name, uid) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ channel_name, uid }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const { token } = await response.json();
        setToken(token);
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };

    fetchToken();
  }, [url, channel_name, uid]);

  return token;
};

export default useToken;
