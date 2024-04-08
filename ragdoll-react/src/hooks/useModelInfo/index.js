// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

const useModelInfo = () => {
  const { RAGDOLL_URI } = window;

  const [modelInfo, setModelInfo] = useState();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fetchModelInfo = async () => {
      setPending(true);

      const response = await fetch(`${RAGDOLL_URI}/v1/info`);

      if (response?.ok) {
        const {
          success,
          textModelProvider,
          textTextModel,
          imageModelProviderURI,
          textImageModel,
          imageImageModel,
          version
        } = await response.json();

        if (success) {
          setModelInfo({
            textModelProvider,
            textTextModel,
            imageModelProviderURI,
            textImageModel,
            imageImageModel,
            version
          });
        }
      }

      setPending(false);
    };

    setTimeout(fetchModelInfo, 400);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [modelInfo, pending];
};

export default useModelInfo;
