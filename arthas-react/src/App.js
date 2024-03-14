import { useState } from 'react';
import './App.css';

const App = () => {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');

  const ask = async () => {
    const response = await fetch('http://localhost:8000/v1/prompt', {
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
  };

  const onChangeQuestion = ({ target: { value }}) => {
    setQuestion(value);
  };

  return <main id="app">
    <div id="output">
      <div className="img">
        {image && <img src={image} alt="Corresponding visualization" width="100%" height="100%" />}
      </div>
      <p>{text || <em style={{ color: '#444' }}>Write a question...</em>}</p>
    </div>
    <div id="input">
      <input onChange={onChangeQuestion} value={question} placeholder="What would you like to ask Arthas?" />
      <button onClick={ask}>Ask</button>
    </div>
  </main>;
}

export default App;
