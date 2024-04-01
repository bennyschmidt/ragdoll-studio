import React, { useEffect, useState } from 'react';
const useModelInfo = () => {
  const {
    RAGDOLL_URI
  } = window;
  const [modelInfo, setModelInfo] = useState();
  const [pending, setPending] = useState(false);
  useEffect(() => {
    const fetchModelInfo = async () => {
      setPending(true);
      const response = await fetch(`${RAGDOLL_URI}/v1/info`);
      if (response?.ok) {
        const {
          success,
          framework,
          textModel,
          stableDiffusionURI,
          stableDiffusionImageModel,
          version
        } = await response.json();
        if (success) {
          setModelInfo({
            framework,
            textModel,
            stableDiffusionURI,
            stableDiffusionImageModel,
            version
          });
        }
      }
      setPending(false);
    };
    setTimeout(fetchModelInfo, 400);
  }, []);
  return [modelInfo, pending];
};
export default useModelInfo;