import { useEffect, useState } from 'react';

import { usePersona } from 'ragdoll-react';

import './App.css';

// Globals

window.RAGDOLL_URI = 'http://localhost:8000';
window.STORAGE_KEY = 'RAGDOLL_PERSONAS';

const { RAGDOLL_URI } = window;

const SEND = 'Send';
const API_ERROR = 'API temporarily unavailable.';
const SECRET_PASSWORD = 'CORPSE FLOWER';

const App = () => {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [keys, setKeys] = useState({});
  const [positionX, setPositionX] = useState(0);
  const [gameClassName, setGameClassName] = useState('');
  const [playerClassName, setPlayerClassName] = useState('');

  const [persona] = usePersona({
    name: 'The Oracle',
    knowledgeURI: `${RAGDOLL_URI}/oracle`,
    avatarURL: '',

    // Passing null for artStyle will skip image generation

    artStyle: null,
    writingStyle: 'emotionless but all-knowing, like an oracle or deity, but somewhat brief and without giving up too much information at once',
    writingTone: 'mysterious'
  });

  useEffect(() => {
    document.body.onkeydown = ({ key }) => {
      const keybind = key.toUpperCase();

      setKeys({
        ...keys,

        [keybind]: true
      });
    };

    document.body.onkeyup = ({ key }) => {
      const keybind = key.toUpperCase();

      setKeys({
        ...keys,

        [keybind]: false
      });
    };

    return () => {
      document.body.onkeydown = null;
      document.body.onkeyup = null;
    };
  }, []);

  useEffect(() => {
    if (document.activeElement.tagName === 'INPUT') return;

    if (keys.A) {
      setPlayerClassName('run left');

      if (positionX > 0) {
        requestAnimationFrame(() => {
          setPositionX(positionX - 5);
        });
      }
    } else if (keys.D) {
      setPlayerClassName('run right');

      if (positionX < 800) {
        requestAnimationFrame(() => {
          setPositionX(positionX + 5);
        });
      }
    } else {
      setPlayerClassName('');
    }
  }, [keys]);

  const ask = async () => {
    setDisabled(true);

    const response = await fetch(`${RAGDOLL_URI}/v1/prompt`, {
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
        setText(answer.text);
      }
    }

    setQuestion('');
    setDisabled(false);
  };

  const guess = () => {
    setDisabled(true);

    if (question.trim().toUpperCase() === SECRET_PASSWORD) {
      setGameClassName('complete');
      setText('The door has opened! (You win)');
    } else {
      setText('Incorrect! Try again, mortal.');
    }

    setQuestion('');
    setDisabled(false);
  };

  const getQuestionPlaceholder = () => (
    !persona ? '...' : 'Type something...'
  );

  const onChangeQuestion = ({ target: { value }}) => {
    setQuestion(value);
  };

  const onKeyDownQuestion = ({ keyCode }) => (
    question && keyCode === 13 && (isPlayerNearOracle ? ask() : guess())
  );

  const isPlayerNearDoor = (
    positionX > 430 &&
    positionX < 600
  );

  const isPlayerNearOracle = (
    positionX > 750
  );

  return <>
    {persona && <main id="app" className="panel">
      <div id="output">
        <div id="game" className={gameClassName}>
          <div id="player" className={playerClassName} style={{ left: positionX }} />
          {text && <p>{text}</p>}
        </div>
      </div>
      <div id="input" className={(isPlayerNearDoor || isPlayerNearOracle) ? 'visible' : ''}>
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
          onClick={isPlayerNearOracle ? ask : guess}
        >
          {SEND}
        </button>
      </div>
    </main>}
  </>;
}

export default App;
