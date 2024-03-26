import React, { useState } from 'react';

import './index.css';

const SEND = 'Send';
const DEFAULT_IMG_ALT = 'Corresponding visualization';
const API_ERROR = 'API temporarily unavailable.';

const PersonaChat = ({
  disabled: parentDisabled,
  persona,
  question,
  imageURL,
  text,
  onQuestion,
  onAnswer
}) => {
  const { ARTHAS_URI } = window;

  const [disabled, setDisabled] = useState(parentDisabled);

  const ask = async () => {
    setDisabled(true);

    const response = await fetch(`${ARTHAS_URI}/v1/prompt`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: persona.knowledgeURI,
        input: question
      })
    });

    if (response?.ok) {
      const { error, answer = {} } = await response.json();

      if (answer.pending) {
        window.location.reload();

        return;
      }

      if (error) {
        alert(error.message || API_ERROR);
        setDisabled(false);

        return;
      } else {
        onAnswer(answer);
      }
    }

    onQuestion('');
    setDisabled(false);
  };

  const getQuestionPlaceholder = () => (
    !persona ? '...' : `What would you like to ask ${persona.name}?`
  );

  const onChangeQuestion = ({ target: { value }}) => {
    onQuestion(value);
  };

  const onKeyDownQuestion = ({ keyCode }) => (
    question && keyCode === 13 && ask()
  );

  return persona && <>
    <div id="output">
      <div className="img">
        {persona.avatarURL && <img
          src={persona.avatarURL}
          alt={persona.name}
          width="100%"
          height="100%"
        />}
      </div>
      {imageURL && <div className="img full">
        {imageURL && <img
          src={imageURL}
          alt={DEFAULT_IMG_ALT}
          width="100%"
          height="100%"
        />}
      </div>}
      {text && <p>{text}</p>}
    </div>
    <div id="input">
      <input
        autoFocus
        disabled={disabled}
        value={question}
        placeholder={getQuestionPlaceholder()}
        onChange={onChangeQuestion}
        onKeyDown={onKeyDownQuestion}
      />
      <button
        disabled={disabled}
        onClick={ask}
      >
        {SEND}
      </button>
    </div>
  </>;
}

export default PersonaChat;
