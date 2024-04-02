import React, { useEffect, useState } from 'react';
import Icon from './Icon';
import './RagdollChat.css';
const SEND = 'Send';
const DEFAULT_IMG_ALT = 'Corresponding visualization';
const API_ERROR = 'API temporarily unavailable.';
const RagdollChat = ({
  disabled: parentDisabled,
  ragdoll,
  question,
  imageURL,
  text,
  renderImages,
  onQuestion,
  onAnswer,
  onClickShowImages
}) => {
  const {
    RAGDOLL_URI
  } = window;
  const [disabled, setDisabled] = useState(parentDisabled);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    setHistory([]);
  }, [ragdoll]);
  const ask = async () => {
    setDisabled(true);
    const response = await fetch(`${RAGDOLL_URI}/v1/prompt`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: ragdoll.knowledgeURI,
        input: question
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
          imageURL
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
  const getQuestionPlaceholder = () => !ragdoll ? '...' : `What would you like to ask ${ragdoll.name}?`;
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
    console.log(`data:text/html,<html><body>${history.join('')}</body></html>`);
    window.open(`data:text/html,<html><body>${history.join('')}</body></html>`, '_blank');
  };
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
  })), renderImages && output?.imageURL && /*#__PURE__*/React.createElement("div", {
    className: "img full"
  }, output.imageURL && /*#__PURE__*/React.createElement("img", {
    src: output.imageURL,
    alt: DEFAULT_IMG_ALT,
    width: "100%",
    height: "100%"
  })), /*#__PURE__*/React.createElement("p", null, output.text))), /*#__PURE__*/React.createElement("div", null, text && /*#__PURE__*/React.createElement("div", {
    className: "img"
  }, ragdoll.avatarURL && /*#__PURE__*/React.createElement("img", {
    src: ragdoll.avatarURL,
    alt: ragdoll.name,
    width: "100%",
    height: "100%"
  })), renderImages && imageURL && /*#__PURE__*/React.createElement("div", {
    className: "img full"
  }, imageURL && /*#__PURE__*/React.createElement("img", {
    src: imageURL,
    alt: DEFAULT_IMG_ALT,
    width: "100%",
    height: "100%"
  })), text && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "author"
  }, ragdoll.name, " says..."), text)))), /*#__PURE__*/React.createElement("div", {
    id: "input",
    className: "panel"
  }, onClickShowImages && /*#__PURE__*/React.createElement("div", {
    className: "checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: renderImages,
    value: renderImages,
    onChange: onClickShowImages
  }), /*#__PURE__*/React.createElement("span", null, "Render images")), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    disabled: disabled,
    value: question,
    placeholder: getQuestionPlaceholder(),
    onChange: onChangeQuestion,
    onKeyDown: onKeyDownQuestion
  }), /*#__PURE__*/React.createElement("div", {
    className: "button-group"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: ask,
    id: "send"
  }, SEND), /*#__PURE__*/React.createElement("div", {
    id: "conversation"
  }, /*#__PURE__*/React.createElement("h6", null, "Conversation"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
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