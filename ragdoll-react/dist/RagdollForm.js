import React, { useState } from 'react';
import './RagdollForm.css';
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
  const [castFile, setCastFile] = useState();
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
    const updatedCurrentPersona = ragdoll?.knowledgeURI && {
      ...ragdoll
    };
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
      const {
        error,
        success
      } = await response.json();
      if (success) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRagdollList));
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
  const onChangeCastUpload = ({
    target: {
      files
    }
  }) => {
    if (!window.confirm('Are you sure? This will clear the current cast.')) return;
    const [file] = files;
    setCastFile(file);
    const reader = new FileReader();
    reader.onload = ({
      target: {
        result
      }
    }) => {
      const {
        dolls
      } = JSON.parse(result);
      const cache = {};
      if (dolls) {
        for (const doll of dolls) {
          cache[doll.knowledgeURI] = doll;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
        window.location.reload();
      }
    };
    reader.onerror = () => {
      alert('Format error.');
    };
    reader.readAsText(file, 'UTF-8');
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form"
  }, /*#__PURE__*/React.createElement("h2", null, "Persona"), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_NAME,
    onChange: onChangePersonaName,
    value: ragdollName
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_AVATAR_URL,
    onChange: onChangePersonaAvatarURL,
    value: ragdollAvatarURL
  }), !textOnly && /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_ART_STYLE,
    onChange: onChangePersonaArtStyle,
    value: ragdollArtStyle
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_KNOWLEDGE_URI,
    onChange: onChangePersonaKnowledgeURI,
    value: ragdollKnowledgeURI
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_WRITING_STYLE,
    onChange: onChangePersonaWritingStyle,
    value: ragdollWritingStyle
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_WRITING_TONE,
    onChange: onChangePersonaWritingTone,
    value: ragdollWritingTone
  }), /*#__PURE__*/React.createElement("p", null, "Or, load a ", /*#__PURE__*/React.createElement("a", {
    href: "https://ragdoll-studio.vercel.app/dolls",
    target: "_blank"
  }, "cast"), ":"), !castFile && /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "application/json",
    disabled: disabled,
    onChange: onChangeCastUpload
  }), /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClickSave
  }, SAVE)));
};
export default RagdollForm;