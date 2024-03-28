import React, { useEffect, useState } from 'react';

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
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory([]);
  }, [persona]);

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
        setHistory([
          ...history,

          {
            avatarURL: persona.avatarURL,
            name: persona.name,
            text
          },
          {
            avatarURL: null,
            name: 'Me',
            text: question,
            isMe: true
          }
        ]);

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
      <header>
        <div className="img">
          {persona.avatarURL && <img
            src={persona.avatarURL}
            alt={persona.name}
            width="100%"
            height="100%"
          />}
        </div>
      </header>
      <div id="history">
        {history.map(output => output?.text && (
          <div className={`past ${output.isMe ? 'me' : ''}`}>
            <div className="img">
              {output.avatarURL && <img
                src={output.avatarURL}
                alt={output.name}
                width="100%"
                height="100%"
              />}
            </div>
            {output?.imageURL && <div className="img full">
              {output.imageURL && <img
                src={output.imageURL}
                alt={DEFAULT_IMG_ALT}
                width="100%"
                height="100%"
              />}
            </div>}
            <p>{output.text}</p>
          </div>
        ))}
        <div>
          {<div className="img">
            {persona.avatarURL && <img
              src={persona.avatarURL}
              alt={persona.name}
              width="100%"
              height="100%"
            />}
          </div>}
          {imageURL && <div className="img full">
            {imageURL && <img
              src={imageURL}
              alt={DEFAULT_IMG_ALT}
              width="100%"
              height="100%"
            />}
          </div>}
          {text && <p>
            <span className="author">{persona.name} says...</span>{text}
          </p>}
        </div>
      </div>
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
