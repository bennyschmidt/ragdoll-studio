import React, { useEffect, useState } from 'react';

const useRagdoll = ragdollConfig => {
  const { RAGDOLL_URI } = window;

  const [ragdoll, setPersona] = useState();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fetchPersona = async () => {
      setPending(true);

      const isUpdate = (
        ragdollConfig?.knowledgeURI &&
        ragdollConfig.knowledgeURI !== ragdoll?.knowledgeURI
      );

      if (isUpdate) {
        const response = await fetch(`${RAGDOLL_URI}/v1/configure`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(ragdollConfig)
        });

        if (response?.ok) {
          const { success } = await response.json();

          if (success) {
            setPersona(ragdollConfig);
          }
        }

        setPending(false);
      }
    };

    fetchPersona();
  }, [ragdollConfig]);

  return [ragdoll, pending];
};

export default useRagdoll;
