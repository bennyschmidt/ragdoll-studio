import React, { useEffect, useState } from 'react';

import Icon from '../Icon';

import './index.css';

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
  const { RAGDOLL_URI } = window;

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
            avatarURL: ragdoll.avatarURL,
            name: ragdoll.name,
            text,
            imageURL
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
    !ragdoll ? '...' : `What would you like to ask ${ragdoll.name}?`
  );

  const onChangeQuestion = ({ target: { value }}) => {
    onQuestion(value);
  };

  const onKeyDownQuestion = ({ keyCode }) => (
    question && keyCode === 13 && ask()
  );

  const onClickClear = () => {
    if (!window.confirm('Are you sure you want to clear the output?')) return;

    setHistory([]);
    onQuestion('');
    onAnswer();
  };

  const onClickSave = () => {
    console.log(`data:text/html,<html><body>${history.join('')}</body></html>`)
    window.open(
      `data:text/html,<html><body>${history.join('')}</body></html>`,
      '_blank'
    );
  };

  return ragdoll && <>
    <div id="output">
      <header>
        <div className="img">
          {ragdoll.avatarURL && <img
            src={ragdoll.avatarURL}
            alt={ragdoll.name}
            width="100%"
            height="100%"
          />}
        </div>
      </header>
      <div id="history">
        {history.map(output => output?.text && (
          <div key={crypto.randomUUID()} className={`past ${output.isMe ? 'me' : ''}`}>
            <div className="img">
              {output.avatarURL && <img
                src={output.avatarURL}
                alt={output.name}
                width="100%"
                height="100%"
              />}
            </div>
            {renderImages && output?.imageURL && <div className="img full">
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
          {text && <div className="img">
            {ragdoll.avatarURL && <img
              src={ragdoll.avatarURL}
              alt={ragdoll.name}
              width="100%"
              height="100%"
            />}
          </div>}
          {renderImages && imageURL && <div className="img full">
            {imageURL && <img
              src={imageURL}
              alt={DEFAULT_IMG_ALT}
              width="100%"
              height="100%"
            />}
          </div>}
          {text && <p>
            <span className="author">{ragdoll.name} says...</span>{text}
          </p>}
        </div>
      </div>
    </div>
    <div id="input" className="panel">
      <div className="checkbox">
        <input
          type="checkbox"
          checked={renderImages}
          value={renderImages}
          onChange={onClickShowImages}
        />
        <span>Render images</span>
      </div>
      <input
        autoFocus
        disabled={disabled}
        value={question}
        placeholder={getQuestionPlaceholder()}
        onChange={onChangeQuestion}
        onKeyDown={onKeyDownQuestion}
      />
      <div className="button-group">
        <button
          disabled={disabled}
          onClick={ask}
          id="send"
        >
          {SEND}
        </button>
        <div id="conversation">
          <h6>Conversation</h6>
          <div>
            <button disabled={disabled} onClick={onClickClear}>
              <Icon src="/img/trash.svg" />
            </button>
            <button disabled={disabled} onClick={onClickSave}>
              <Icon src="/img/save.svg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </>;
}

export default RagdollChat;
