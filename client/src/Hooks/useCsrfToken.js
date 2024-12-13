import { useState, useEffect } from 'react';

function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const response = await fetch('/csrf-token');
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Greška pri dohvaćanju CSRF tokena:', error);
      }
    }

    fetchCsrfToken();
  }, []);

  return csrfToken;
}

export default useCsrfToken;