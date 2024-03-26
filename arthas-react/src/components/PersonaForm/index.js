import React, { useState } from 'react';

import './index.css';

const SAVE = 'Save';
const PERSONA_CREATED = 'New persona created.';
const SAVE_ERROR = 'Error saving persona.';
const PLACEHOLDER_PERSONA_NAME = 'Name';
const PLACEHOLDER_PERSONA_AVATAR_URL = 'Avatar URL';
const PLACEHOLDER_PERSONA_KNOWLEDGE_URI = 'Target URL';
const PLACEHOLDER_PERSONA_ART_STYLE = 'Art style';
const PLACEHOLDER_PERSONA_WRITING_STYLE = 'Writing style';
const PLACEHOLDER_PERSONA_WRITING_TONE = 'Writing tone';

const PersonaForm = ({
  disabled: parentDisabled,
  textOnly,
  persona,
  personaList,
  personaName,
  personaKnowledgeURI,
  personaArtStyle,
  personaWritingStyle,
  personaWritingTone,
  personaAvatarURL,
  onChangePersonaName,
  onChangePersonaKnowledgeURI,
  onChangePersonaArtStyle,
  onChangePersonaWritingStyle,
  onChangePersonaWritingTone,
  onChangePersonaAvatarURL
}) => {
  const {
    ARTHAS_URI,
    STORAGE_KEY
  } = window;

  const [disabled, setDisabled] = useState(parentDisabled);

  const onClickSave = async () => {
    setDisabled(true);

    const personaConfig = {
      name: personaName,
      knowledgeURI: personaKnowledgeURI,
      avatarURL: personaAvatarURL,

      // Passing null for artStyle will skip image generation

      artStyle: textOnly ? null : personaArtStyle,
      writingStyle: personaWritingStyle,
      writingTone: personaWritingTone
    };

    const updatedCurrentPersona = { ...persona };

    updatedCurrentPersona.online = false;

    const updatedPersonaList = {
      ...personaList,

      [updatedCurrentPersona.knowledgeURI]: updatedCurrentPersona,
      [personaKnowledgeURI]: personaConfig
    };

    const response = await fetch(`${ARTHAS_URI}/v1/configure`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(personaConfig)
    });

    if (response?.ok) {
      const { error, success } = await response.json();

      if (success) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedPersonaList)
        );

        alert(PERSONA_CREATED);
        window.location.reload();

        return;
      } else {
        alert(error?.message || SAVE_ERROR);
      }
    } else {
      alert(SAVE_ERROR);
    }

    setDisabled(false);
  };

  return <>
    <div className="form">
      <h2>Persona</h2>
      <input
        required
        disabled={disabled}
        placeholder={PLACEHOLDER_PERSONA_NAME}
        onChange={onChangePersonaName}
        value={personaName}
      />
      <input
        required
        disabled={disabled}
        placeholder={PLACEHOLDER_PERSONA_AVATAR_URL}
        onChange={onChangePersonaAvatarURL}
        value={personaAvatarURL}
      />
      {
        !textOnly && <input
          required
          disabled={disabled}
          placeholder={PLACEHOLDER_PERSONA_ART_STYLE}
          onChange={onChangePersonaArtStyle}
          value={personaArtStyle}
      />
      }
      <input
        required
        disabled={disabled}
        placeholder={PLACEHOLDER_PERSONA_KNOWLEDGE_URI}
        onChange={onChangePersonaKnowledgeURI}
        value={personaKnowledgeURI}
      />
      <input
        required
        disabled={disabled}
        placeholder={PLACEHOLDER_PERSONA_WRITING_STYLE}
        onChange={onChangePersonaWritingStyle}
        value={personaWritingStyle}
      />
      <input
        required
        disabled={disabled}
        placeholder={PLACEHOLDER_PERSONA_WRITING_TONE}
        onChange={onChangePersonaWritingTone}
        value={personaWritingTone}
      />
      <button
        disabled={disabled}
        onClick={onClickSave}
      >
        {SAVE}
      </button>
    </div>
  </>;
}

export default PersonaForm;
