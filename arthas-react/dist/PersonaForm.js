import React, { useState } from 'react';
import './PersonaForm.css';
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
    const updatedCurrentPersona = {
      ...persona
    };
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
      const {
        error,
        success
      } = await response.json();
      if (success) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPersonaList));
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form"
  }, /*#__PURE__*/React.createElement("h2", null, "Persona"), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_PERSONA_NAME,
    onChange: onChangePersonaName,
    value: personaName
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_PERSONA_AVATAR_URL,
    onChange: onChangePersonaAvatarURL,
    value: personaAvatarURL
  }), !textOnly && /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_PERSONA_ART_STYLE,
    onChange: onChangePersonaArtStyle,
    value: personaArtStyle
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_PERSONA_KNOWLEDGE_URI,
    onChange: onChangePersonaKnowledgeURI,
    value: personaKnowledgeURI
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_PERSONA_WRITING_STYLE,
    onChange: onChangePersonaWritingStyle,
    value: personaWritingStyle
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_PERSONA_WRITING_TONE,
    onChange: onChangePersonaWritingTone,
    value: personaWritingTone
  }), /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClickSave
  }, SAVE)));
};
export default PersonaForm;