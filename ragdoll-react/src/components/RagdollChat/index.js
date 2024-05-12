import React, { useEffect, useState } from 'react';

import Icon from '../Icon';

import './index.css';

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
  history,
  setHistory,
  onQuestion,
  onAnswer,
  onClickShowImages,
  openUploadOverlay
}) => {
  const { RAGDOLL_URI } = window;

  const [disabled, setDisabled] = useState(parentDisabled);

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
        const {
          imageResponse1,
          imageResponse2
        } = answer;

        const imageURL = `data:image/svg+xml;base64,${btoa(imageResponse1)}`;
        const imageURL2 = `data:image/svg+xml;base64,${btoa(imageResponse2)}`;

        setHistory([
          ...history,

          {
            avatarURL: ragdoll.avatarURL,
            name: ragdoll.name,
            text: 'These images are in SVG format.',
            imageURL,
            imageURL2
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
    setDisabled(false)
  };

  const ask = async () => {
    if (mode === VECTOR) {
      return generateSvg({
        key: ragdoll.knowledgeURI,
        svgInput: imageInput
      })
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
            imageURL,
            imageURL2
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
    !ragdoll
      ? '...'
      : mode === STORY
        ? `What would you like to ask ${ragdoll.name}?`
        : 'Add tags...'
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
    window.open(
      `data:text/html,<html><body>${
        history
          .map(({ text: historyText }) => historyText)
          .join('\n')
      }</body></html>`,
      '_blank'
    );
  };

  const isStoryMode = mode === STORY;
  const isVectorMode = mode === VECTOR;

  return ragdoll && <>
    <div id="output">
      <header>
        <div className="img">
          {!isVectorMode && ragdoll.avatarURL && <img
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
              {!isVectorMode && output.avatarURL && <img
                src={output.avatarURL}
                alt={output.name}
                width="100%"
                height="100%"
              />}
            </div>
            {(renderImages || !isStoryMode) && output?.imageURL && <div className="img full">
              <img
                src={output.imageURL}
                alt={DEFAULT_IMG_ALT}
                width="100%"
                height="100%"
              />
            </div>}
            {!isStoryMode && output?.imageURL2 && <div className="img full">
              <img
                src={output.imageURL2}
                alt={DEFAULT_IMG_ALT}
                width="100%"
                height="100%"
              />
            </div>}
            {(isStoryMode || output.isMe) && <p>{output.text}</p>}
          </div>
        ))}
        <div>
          {!isVectorMode && text && <div className="img">
            {ragdoll?.avatarURL && <img
              src={ragdoll.avatarURL}
              alt={ragdoll.name}
              width="100%"
              height="100%"
            />}
          </div>}
          {(renderImages || !isStoryMode) && imageURL && <div className="img full">
            <img
              src={imageURL}
              alt={question}
              width="100%"
              height="100%"
            />
          </div>}
          {!isStoryMode && imageURL2 && <div className="img full">
            <img
              src={imageURL2}
              alt={question}
              width="100%"
              height="100%"
            />
          </div>}
          {isStoryMode && text && <p>
            <span className="author">{ragdoll.name} says...</span>{text}
          </p>}
        </div>
      </div>
    </div>
    <div id="input" className="panel">
      <div>
        {!isStoryMode && <div id="inspire">
          <h6>Inspire</h6>
          <div>
            <button
              disabled={disabled}
              onClick={openUploadOverlay}
              style={(imageInput
                ? { background: `url(${imageInput}) center center / contain no-repeat` }
                : {}
              )}
            >
              <Icon src={`/img/${isStoryMode ? 'upload' : 'raster'}.svg`} />
            </button>
          </div>
        </div>}
        <div className="controls">
          {isStoryMode && onClickShowImages && <div className="checkbox">
            <input
              type="checkbox"
              checked={renderImages}
              value={renderImages}
              onChange={onClickShowImages}
            />
            <span>Render images</span>
          </div>}
          {isStoryMode && <div className="checkbox">
            <input
              disabled
              type="checkbox"
              checked={false}
              value={false}
              onChange={() => {}}
            />
            <span>Play voiceovers</span>
          </div>}
          {!isStoryMode && <>
            <div className="checkbox">
              <input
                disabled
                type="checkbox"
                checked={false}
                value={false}
                onChange={() => {}}
              />
              <span>Batch of 4</span>
            </div>
            <div className="checkbox">
              <input
                type="checkbox"
                checked={true}
                value={true}
                onChange={() => {}}
              />
              <span>True to original</span>
            </div>
          </>}
          <input
            id="text-input"
            autoFocus
            autoComplete="off"
            disabled={disabled}
            value={question}
            placeholder={getQuestionPlaceholder()}
            onChange={onChangeQuestion}
            onKeyDown={onKeyDownQuestion}
          />
        </div>
      </div>
      <div className="button-group">
        {isStoryMode && <div id="focus">
          <h6>Focus</h6>
          <div>
            <button
              disabled={disabled}
              onClick={openUploadOverlay}
            >
              <Icon src="/img/upload.svg" />
            </button>
          </div>
        </div>}
        <button
          disabled={disabled}
          onClick={ask}
          id="send"
        >
          {SEND}
        </button>
        <div id="conversation">
          <h6>Output</h6>
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
