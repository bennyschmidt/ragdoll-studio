import React, { useEffect, useState } from 'react';
import Icon from './Icon';
import './RagdollChat.css';
const SEND = 'Send';
const API_ERROR = 'API temporarily unavailable.';
const DEFAULT_IMG_ALT = 'output';
const STORY = 'STORY';
const VECTOR = 'VECTOR';
const RagdollChat = ({
  disabled: parentDisabled,
  ragdoll,
  question,
  imageInput,
  imageURL,
  imageURL2,
  text,
  renderImages,
  mode,
  onQuestion,
  onAnswer,
  onClickShowImages,
  openUploadOverlay
}) => {
  const {
    RAGDOLL_URI
  } = window;
  const [disabled, setDisabled] = useState(parentDisabled);
  const [history, setHistory] = useState([]);

  // useEffect(() => {
  //   setHistory([]);
  // }, [ragdoll]);

  const generateSvg = async () => {
    setDisabled(true);
    const response = await fetch(`${RAGDOLL_URI}/v1/svg`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: ragdoll.knowledgeURI,
        question,
        svgInput: atob(imageInput.replace(/^data:image\/svg\+xml;base64,/, ''))
      })
    });
    if (response?.ok) {
      const {
        error,
        answer = {}
      } = await response.json();
      if (answer.pending) {
        window.location.reload();
        return;
      }
      if (error) {
        alert(error.message || API_ERROR);
        setDisabled(false);
        return;
      } else {
        const {
          imageResponse1,
          imageResponse2
        } = answer;
        const imageURL = `data:image/svg+xml;base64,${btoa(imageResponse1)}`;
        const imageURL2 = `data:image/svg+xml;base64,${btoa(imageResponse2)}`;
        setHistory([...history, {
          avatarURL: ragdoll.avatarURL,
          name: ragdoll.name,
          text: 'These images are in SVG format.',
          imageURL,
          imageURL2
        }, {
          avatarURL: null,
          name: 'Me',
          text: question,
          isMe: true
        }]);
        onAnswer(answer);
      }
    }
    onQuestion('');
    setDisabled(false);
  };
  const ask = async () => {
    if (mode === VECTOR) {
      return generateSvg({
        key: ragdoll.knowledgeURI,
        svgInput: imageInput
      });
    }
    setDisabled(true);
    const response = await fetch(`${RAGDOLL_URI}/v1/prompt`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: ragdoll.knowledgeURI,
        input: question,
        imageInput
      })
    });
    if (response?.ok) {
      const {
        error,
        answer = {}
      } = await response.json();
      if (answer.pending) {
        window.location.reload();
        return;
      }
      if (error) {
        alert(error.message || API_ERROR);
        setDisabled(false);
        return;
      } else {
        setHistory([...history, {
          avatarURL: ragdoll.avatarURL,
          name: ragdoll.name,
          text,
          imageURL,
          imageURL2
        }, {
          avatarURL: null,
          name: 'Me',
          text: question,
          isMe: true
        }]);
        onAnswer(answer);
      }
    }
    onQuestion('');
    setDisabled(false);
  };
  const getQuestionPlaceholder = () => !ragdoll ? '...' : mode === STORY ? `What would you like to ask ${ragdoll.name}?` : 'Add tags...';
  const onChangeQuestion = ({
    target: {
      value
    }
  }) => {
    onQuestion(value);
  };
  const onKeyDownQuestion = ({
    keyCode
  }) => question && keyCode === 13 && ask();
  const onClickClear = () => {
    if (!window.confirm('Are you sure you want to clear the output?')) return;
    setHistory([]);
    onQuestion('');
    onAnswer();
  };
  const onClickSave = () => {
    window.open(`data:text/html,<html><body>${history.map(({
      text: historyText
    }) => historyText).join('\n')}</body></html>`, '_blank');
  };
  const isStoryMode = mode === STORY;
  return ragdoll && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "output"
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("div", {
    className: "img"
  }, ragdoll.avatarURL && /*#__PURE__*/React.createElement("img", {
    src: ragdoll.avatarURL,
    alt: ragdoll.name,
    width: "100%",
    height: "100%"
  }))), /*#__PURE__*/React.createElement("div", {
    id: "history"
  }, history.map(output => output?.text && /*#__PURE__*/React.createElement("div", {
    key: crypto.randomUUID(),
    className: `past ${output.isMe ? 'me' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "img"
  }, output.avatarURL && /*#__PURE__*/React.createElement("img", {
    src: output.avatarURL,
    alt: output.name,
    width: "100%",
    height: "100%"
  })), (renderImages || !isStoryMode) && output?.imageURL && /*#__PURE__*/React.createElement("div", {
    className: "img full"
  }, /*#__PURE__*/React.createElement("img", {
    src: output.imageURL,
    alt: DEFAULT_IMG_ALT,
    width: "100%",
    height: "100%"
  })), !isStoryMode && output?.imageURL2 && /*#__PURE__*/React.createElement("div", {
    className: "img full"
  }, /*#__PURE__*/React.createElement("img", {
    src: output.imageURL2,
    alt: DEFAULT_IMG_ALT,
    width: "100%",
    height: "100%"
  })), (isStoryMode || output.isMe) && /*#__PURE__*/React.createElement("p", null, output.text))), /*#__PURE__*/React.createElement("div", null, text && /*#__PURE__*/React.createElement("div", {
    className: "img"
  }, ragdoll?.avatarURL && /*#__PURE__*/React.createElement("img", {
    src: ragdoll.avatarURL,
    alt: ragdoll.name,
    width: "100%",
    height: "100%"
  })), (renderImages || !isStoryMode) && imageURL && /*#__PURE__*/React.createElement("div", {
    className: "img full"
  }, /*#__PURE__*/React.createElement("img", {
    src: imageURL,
    alt: question,
    width: "100%",
    height: "100%"
  })), !isStoryMode && imageURL2 && /*#__PURE__*/React.createElement("div", {
    className: "img full"
  }, /*#__PURE__*/React.createElement("img", {
    src: imageURL2,
    alt: question,
    width: "100%",
    height: "100%"
  })), isStoryMode && text && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "author"
  }, ragdoll.name, " says..."), text)))), /*#__PURE__*/React.createElement("div", {
    id: "input",
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", null, !isStoryMode && /*#__PURE__*/React.createElement("div", {
    id: "inspire"
  }, /*#__PURE__*/React.createElement("h6", null, "Inspire"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: openUploadOverlay,
    style: imageInput ? {
      background: `url(${imageInput}) center center / contain no-repeat`
    } : {}
  }, /*#__PURE__*/React.createElement(Icon, {
    src: `/img/${isStoryMode ? 'upload' : 'raster'}.svg`
  })))), /*#__PURE__*/React.createElement("div", {
    className: "controls"
  }, isStoryMode && onClickShowImages && /*#__PURE__*/React.createElement("div", {
    className: "checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: renderImages,
    value: renderImages,
    onChange: onClickShowImages
  }), /*#__PURE__*/React.createElement("span", null, "Render images")), isStoryMode && /*#__PURE__*/React.createElement("div", {
    className: "checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    disabled: true,
    type: "checkbox",
    checked: false,
    value: false,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("span", null, "Play voiceovers")), !isStoryMode && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    disabled: true,
    type: "checkbox",
    checked: false,
    value: false,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("span", null, "Batch of 4")), /*#__PURE__*/React.createElement("div", {
    className: "checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: true,
    value: true,
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("span", null, "True to original"))), /*#__PURE__*/React.createElement("input", {
    id: "text-input",
    autoFocus: true,
    autoComplete: "off",
    disabled: disabled,
    value: question,
    placeholder: getQuestionPlaceholder(),
    onChange: onChangeQuestion,
    onKeyDown: onKeyDownQuestion
  }))), /*#__PURE__*/React.createElement("div", {
    className: "button-group"
  }, isStoryMode && /*#__PURE__*/React.createElement("div", {
    id: "focus"
  }, /*#__PURE__*/React.createElement("h6", null, "Focus"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: openUploadOverlay
  }, /*#__PURE__*/React.createElement(Icon, {
    src: "/img/upload.svg"
  })))), /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: ask,
    id: "send"
  }, SEND), /*#__PURE__*/React.createElement("div", {
    id: "conversation"
  }, /*#__PURE__*/React.createElement("h6", null, "Output"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClickClear
  }, /*#__PURE__*/React.createElement(Icon, {
    src: "/img/trash.svg"
  })), /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClickSave
  }, /*#__PURE__*/React.createElement(Icon, {
    src: "/img/save.svg"
  })))))));
};
export default RagdollChat;