import { useState, useEffect } from 'react';

const useDolls = (authorSlug, castSlug) => {
  const [cast, setCast] = useState();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fetchDolls = async () => {
      setPending(true);

      if (!authorSlug || !castSlug) {
        return [null, true];
      }

      const response = await fetch('/api/dolls', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorSlug,
          castSlug
        })
      });

      if (response?.ok) {
        const result = await response.json();

        if (result?.cast) {
          setCast(result.cast);
        }
      }

      setPending(false);
    };

    fetchDolls();
  }, [authorSlug, castSlug]);

  return [cast, pending];
};

export default useDolls;
