import React, { useState } from 'react';

import './index.css';

const SAVE = 'Save';
const RAGDOLL_CREATED = 'New ragdoll created.';
const SAVE_ERROR = 'Error saving ragdoll.';
const PLACEHOLDER_RAGDOLL_NAME = 'Name';
const PLACEHOLDER_RAGDOLL_AVATAR_URL = 'Avatar URL';
const PLACEHOLDER_RAGDOLL_KNOWLEDGE_URI = 'Target URL';
const PLACEHOLDER_RAGDOLL_ART_STYLE = 'Art style';
const PLACEHOLDER_RAGDOLL_WRITING_STYLE = 'Writing style';
const PLACEHOLDER_RAGDOLL_WRITING_TONE = 'Writing tone';

const RagdollForm = ({
  disabled: parentDisabled,
  textOnly,
  ragdoll,
  ragdollList,
  ragdollName,
  ragdollKnowledgeURI,
  ragdollArtStyle,
  ragdollWritingStyle,
  ragdollWritingTone,
  ragdollAvatarURL,
  onChangePersonaName,
  onChangePersonaKnowledgeURI,
  onChangePersonaArtStyle,
  onChangePersonaWritingStyle,
  onChangePersonaWritingTone,
  onChangePersonaAvatarURL
}) => {
  const {
    RAGDOLL_URI,
    STORAGE_KEY
  } = window;

  const [disabled, setDisabled] = useState(parentDisabled);

  const onClickSave = async () => {
    setDisabled(true);

    const ragdollConfig = {
      name: ragdollName,
      knowledgeURI: ragdollKnowledgeURI,
      avatarURL: ragdollAvatarURL,

      // Passing null for artStyle will skip image generation

      artStyle: textOnly ? null : ragdollArtStyle,
      writingStyle: ragdollWritingStyle,
      writingTone: ragdollWritingTone
    };

    const updatedCurrentPersona = ragdoll?.knowledgeURI && { ...ragdoll };

    const updatedRagdollList = {
      ...ragdollList,

      [ragdollKnowledgeURI]: ragdollConfig
    };

    if (updatedCurrentPersona) {
      updatedCurrentPersona.online = false;
      updatedRagdollList[updatedCurrentPersona.knowledgeURI] = updatedCurrentPersona;
    }

    const response = await fetch(`${RAGDOLL_URI}/v1/configure`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ragdollConfig)
    });

    if (response?.ok) {
      const { error, success } = await response.json();

      if (success) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedRagdollList)
        );

        alert(RAGDOLL_CREATED);
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
        placeholder={PLACEHOLDER_RAGDOLL_NAME}
        onChange={onChangePersonaName}
        value={ragdollName}
      />
      <input
        required
        disabled={disabled}
        placeholder={PLACEHOLDER_RAGDOLL_AVATAR_URL}
        onChange={onChangePersonaAvatarURL}
        value={ragdollAvatarURL}
      />
      {
        !textOnly && <input
          required
          disabled={disabled}
          placeholder={PLACEHOLDER_RAGDOLL_ART_STYLE}
          onChange={onChangePersonaArtStyle}
          value={ragdollArtStyle}
      />
      }
      <input
        required
        disabled={disabled}
        placeholder={PLACEHOLDER_RAGDOLL_KNOWLEDGE_URI}
        onChange={onChangePersonaKnowledgeURI}
        value={ragdollKnowledgeURI}
      />
      <input
        required
        disabled={disabled}
        placeholder={PLACEHOLDER_RAGDOLL_WRITING_STYLE}
        onChange={onChangePersonaWritingStyle}
        value={ragdollWritingStyle}
      />
      <input
        required
        disabled={disabled}
        placeholder={PLACEHOLDER_RAGDOLL_WRITING_TONE}
        onChange={onChangePersonaWritingTone}
        value={ragdollWritingTone}
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

export default RagdollForm;
