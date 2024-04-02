import React, { useState } from 'react';
import './RagdollForm.css';
const SAVE = 'Save';
const RAGDOLL_CREATED = 'New ragdoll created.';
const SAVE_ERROR = 'Error saving ragdoll.';
const PLACEHOLDER_RAGDOLL_NAME = 'Name';
const PLACEHOLDER_RAGDOLL_AVATAR_URL = 'Avatar URL';
const PLACEHOLDER_RAGDOLL_KNOWLEDGE_URI = 'Target URL';
const PLACEHOLDER_RAGDOLL_ADDITIONAL_KNOWLEDGE_URI = 'Additional URL';
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
  ragdollAdditionalKnowledgeURIs,
  onChangeRagdollName,
  onChangeRagdollKnowledgeURI,
  onChangeRagdollAdditionalKnowledgeURIs,
  onChangeRagdollArtStyle,
  onChangeRagdollWritingStyle,
  onChangeRagdollWritingTone,
  onChangeRagdollAvatarURL
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
      writingTone: ragdollWritingTone,
      additionalKnowledgeURIs: ragdollAdditionalKnowledgeURIs
    };
    const updatedCurrentRagdoll = ragdoll?.knowledgeURI && {
      ...ragdoll
    };
    const updatedRagdollList = {
      ...ragdollList,
      [ragdollKnowledgeURI]: ragdollConfig
    };
    if (updatedCurrentRagdoll) {
      updatedCurrentRagdoll.online = false;
      updatedRagdollList[updatedCurrentRagdoll.knowledgeURI] = updatedCurrentRagdoll;
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
  }, /*#__PURE__*/React.createElement("h2", null, "Ragdoll"), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_NAME,
    onChange: onChangeRagdollName,
    value: ragdollName
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_AVATAR_URL,
    onChange: onChangeRagdollAvatarURL,
    value: ragdollAvatarURL
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_KNOWLEDGE_URI,
    onChange: onChangeRagdollKnowledgeURI,
    value: ragdollKnowledgeURI
  }), /*#__PURE__*/React.createElement("input", {
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_ADDITIONAL_KNOWLEDGE_URI,
    onChange: onChangeRagdollAdditionalKnowledgeURIs,
    value: ragdollAdditionalKnowledgeURIs[0] || ''
  }), ragdollAdditionalKnowledgeURIs[0] && /*#__PURE__*/React.createElement("input", {
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_ADDITIONAL_KNOWLEDGE_URI,
    onChange: onChangeRagdollAdditionalKnowledgeURIs,
    value: ragdollAdditionalKnowledgeURIs[1] || ''
  }), !textOnly && /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_ART_STYLE,
    onChange: onChangeRagdollArtStyle,
    value: ragdollArtStyle
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_WRITING_STYLE,
    onChange: onChangeRagdollWritingStyle,
    value: ragdollWritingStyle
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    disabled: disabled,
    placeholder: PLACEHOLDER_RAGDOLL_WRITING_TONE,
    onChange: onChangeRagdollWritingTone,
    value: ragdollWritingTone
  }), /*#__PURE__*/React.createElement("p", null, "Or, load a ", /*#__PURE__*/React.createElement("a", {
    rel: "noreferrer",
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