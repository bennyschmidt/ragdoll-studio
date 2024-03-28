import React, { useEffect, useState } from 'react';

const usePersona = personaConfig => {
  const { RAGDOLL_URI } = window;

  const [persona, setPersona] = useState();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fetchPersona = async () => {
      setPending(true);

      const isUpdate = (
        personaConfig?.knowledgeURI &&
        personaConfig.knowledgeURI !== persona?.knowledgeURI
      );

      if (isUpdate) {
        const response = await fetch(`${RAGDOLL_URI}/v1/configure`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(personaConfig)
        });

        if (response?.ok) {
          const { success } = await response.json();

          if (success) {
            setPersona(personaConfig);
          }
        }

        setPending(false);
      }
    };

    fetchPersona();
  }, [personaConfig]);

  return [persona, pending];
};

export default usePersona;
