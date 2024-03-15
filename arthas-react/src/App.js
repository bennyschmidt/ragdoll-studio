import { useState } from 'react';

import './App.css';

const BASE_URL = 'http://localhost:8000';
const ARTHAS_NAME = 'Arthas';

const App = () => {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [disabled, setDisabled] = useState(false);

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
      const { answer } = await response.json();

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

  return <main id="app">
    <h1>ArthasGPT</h1>
    <div id="output">
      <div className="img">
        {image && <img
          src={image}
          alt="Corresponding visualization"
          width="100%"
          height="100%"
        />}
      </div>
      <p style={{ background: text ? 'black' : '#12121260'}}>{text || <em style={{ color: '#444' }}>
        Write a question...
      </em>}</p>
    </div>
    <div id="input">
      <input
        disabled={disabled}
        value={question}
        placeholder={`What would you like to ask ${ARTHAS_NAME}?`}
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
  </main>;
}

export default App;
