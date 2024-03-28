import React, { useEffect, useState } from 'react';
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
  onQuestion,
  onAnswer
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
          text
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
    className: `past ${output.isMe ? 'me' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "img"
  }, output.avatarURL && /*#__PURE__*/React.createElement("img", {
    src: output.avatarURL,
    alt: output.name,
    width: "100%",
    height: "100%"
  })), output?.imageURL && /*#__PURE__*/React.createElement("div", {
    className: "img full"
  }, output.imageURL && /*#__PURE__*/React.createElement("img", {
    src: output.imageURL,
    alt: DEFAULT_IMG_ALT,
    width: "100%",
    height: "100%"
  })), /*#__PURE__*/React.createElement("p", null, output.text))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "img"
  }, ragdoll.avatarURL && /*#__PURE__*/React.createElement("img", {
    src: ragdoll.avatarURL,
    alt: ragdoll.name,
    width: "100%",
    height: "100%"
  })), imageURL && /*#__PURE__*/React.createElement("div", {
    className: "img full"
  }, imageURL && /*#__PURE__*/React.createElement("img", {
    src: imageURL,
    alt: DEFAULT_IMG_ALT,
    width: "100%",
    height: "100%"
  })), text && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "author"
  }, ragdoll.name, " says..."), text)))), /*#__PURE__*/React.createElement("div", {
    id: "input"
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    disabled: disabled,
    value: question,
    placeholder: getQuestionPlaceholder(),
    onChange: onChangeQuestion,
    onKeyDown: onKeyDownQuestion
  }), /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: ask
  }, SEND)));
};
export default RagdollChat;