// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

const useRagdoll = (ragdollConfig, renderImages) => {
  const { RAGDOLL_URI, STORAGE_KEY } = window;

  const savedRagdolls = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  );

  const [ragdoll, setRagdoll] = useState();
  const [pending, setPending] = useState(false);
  const [isRenderingImages, setIsRenderingImages] = useState(renderImages);

  useEffect(() => {
    const fetchRagdoll = async () => {
      setPending(true);

      const isUpdate = (
        ragdollConfig?.knowledgeURI &&
        (
          ragdollConfig.knowledgeURI !== ragdoll?.knowledgeURI ||
          ragdollConfig.additionalKnowledgeURIs.join() !== ragdoll.additionalKnowledgeURIs.join() ||
          renderImages !== isRenderingImages
        )
      );

      if (isUpdate) {
        setIsRenderingImages(renderImages);

        const config = { ...ragdollConfig };

        config.artStyle = renderImages
          ? savedRagdolls?.[ragdollConfig.knowledgeURI]?.artStyle
          : null;

        const response = await fetch(`${RAGDOLL_URI}/v1/configure`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(config)
        });

        if (response?.ok) {
          const { success } = await response.json();

          if (success) {
            setRagdoll(config);
          }
        }

        setPending(false);
      }
    };

    fetchRagdoll();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ragdollConfig, ragdoll, renderImages]);

  return [ragdoll, pending];
};

export default useRagdoll;
