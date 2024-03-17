import { useEffect, useState } from 'react';

import './App.css';

const BASE_URL = 'http://localhost:8000';

const App = () => {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [disabled, setDisabled] = useState(false);

  const [persona, setPersona] = useState();
  const [personaList, setPersonaList] = useState();

  useEffect(() => {
    const currentPersona = {
      name: 'Arthas',
      avatarURL: '/img/avatars/arthas.png'
    };

    const savedPersonas = [
      {
        ...currentPersona,

        online: true
      }
    ];

    setPersona(currentPersona);
    setPersonaList(savedPersonas);
  }, []);

  const ask = async () => {
    setDisabled(true);

    const response = await fetch(`${BASE_URL}/v1/prompt`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: question })
    });

    if (response?.ok) {
      const { answer = {} } = await response.json();

      if (answer.pending) {
        window.location.reload();

        return;
      }

      setText(answer.text);
      setImage(answer.imageURL);
    }

    setDisabled(false);
  };

  const onChangeQuestion = ({ target: { value }}) => {
    setQuestion(value);
  };

  const onKeyDownQuestion = ({ keyCode }) => (
    question && keyCode === 13 && ask()
  );

  return <>
    <nav id="nav" className="panel">
      <h1>Domain-specific Personas (DSPs)</h1>
      <ul className="persona-list">
        {personaList && personaList.map(({
          name,
          avatarURL,
          online = false
        }) => (
          <li key={name} className={`persona-list-item panel ${online ? 'selected' : ''}`}>
            <span className="online-indicator" />
            <span className="persona-avatar">
              <img
                src={avatarURL}
                alt={name}
                width="100%"
                height="100%"
              />
            </span>
            <h2>{name}</h2>
          </li>
        ))}
      </ul>
      <button id="create-persona-button">+</button>
    </nav>
    <main id="app" className="panel">
      <div id="output">
        <div className="img">
          {image && <img
            src={image}
            alt="Corresponding visualization"
            width="100%"
            height="100%"
          />}
        </div>
        {text && <p>{text}</p>}
      </div>
      <div id="input">
        <input
          autoFocus
          disabled={disabled}
          value={question}
          placeholder={!persona ? '...' : `What would you like to ask ${persona.name}?`}
          onChange={onChangeQuestion}
          onKeyDown={onKeyDownQuestion}
        />
        <button
          disabled={disabled}
          onClick={ask}
        >
          Send
        </button>
      </div>
    </main>
  </>;
}

export default App;
