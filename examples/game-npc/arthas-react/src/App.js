import { useEffect, useState } from 'react';

import './App.css';

const BASE_URL = 'http://localhost:8000';
const SEND = 'Send';
const API_ERROR = 'API temporarily unavailable.';

const App = () => {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [persona, setPersona] = useState();

  useEffect(() => {
    const personaConfig = {
      name: 'The Oracle',
      knowledgeURI: `${BASE_URL}/v1/oracle`,
      avatarURL: '',

      // Passing null for artStyle will skip image generation

      artStyle: null,
      writingStyle: 'emotionless but all-knowing, like an oracle or deity, but somewhat brief and without giving up too much information at once',
      writingTone: 'mysterious'
    };

    const fetchOracle = async () => {
      const response = await fetch(`${BASE_URL}/v1/configure`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(personaConfig)
      });

      if (response?.ok) {
        const { success } = await response.json();

        if (success) {
          setPersona(personaConfig);
        }
      }
    };

    fetchOracle();
  }, []);

  const ask = async () => {
    setDisabled(true);

    const response = await fetch(`${BASE_URL}/v1/prompt`, {
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

  const getQuestionPlaceholder = () => (
    !persona ? '...' : 'Type something...'
  );

  const onChangeQuestion = ({ target: { value }}) => {
    setQuestion(value);
  };

  const onKeyDownQuestion = ({ keyCode }) => (
    question && keyCode === 13 && ask()
  );

  return <>
    {persona && <main id="app" className="panel">
      <div id="output">
        {persona.avatarURL && <img
          src={persona.avatarURL}
          alt={persona.name}
          width="4rem"
          height="4rem"
        />}
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
    </main>}
  </>;
}

export default App;
