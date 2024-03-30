import { useState, useEffect } from 'react';

const useCasts = () => {
  const [casts, setCasts] = useState([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fetchDolls = async () => {
      setPending(true);

      const response = await fetch('/api/casts');

      if (response?.ok) {
        const result = await response.json();

        if (result?.casts) {
          setCasts(result.casts);
        }
      }

      setPending(false);
    };

    fetchDolls();
  }, []);

  return [casts, pending];
};

export default useCasts;
