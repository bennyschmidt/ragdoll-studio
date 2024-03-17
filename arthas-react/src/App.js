import { useEffect, useState } from 'react';

import './App.css';

const BASE_URL = 'http://localhost:8000';
const STORAGE_KEY = 'ARTHAS_PERSONAS';
const DEFAULT_IMG_ALT = 'Corresponding visualization';
const OVERLAY = 'overlay';
const SEND = 'Send';
const SAVE = 'Save';
const CREATE = '+';
const PERSONA_LIST_HEADING = 'Domain-specific Personas (DSPs)';
const PERSONA_CREATED = 'New persona created.';
const PERSONA_ERROR = 'Error loading persona.';
const PERSONA_NAME = 'Name';
const PERSONA_KNOWLEDGE_URI = 'Knowledge URI';
const PERSONA_ART_STYLE = 'Art style';
const PERSONA_WRITING_STYLE = 'Writing style';
const PERSONA_WRITING_TONE = 'Writing tone';

const DEFAULT_AVATAR_URL = '/img/avatars/arthas.png';
const DEFAULT_NAME = 'Arthas';
const DEFAULT_KNOWLEDGE_URI = 'https://wowpedia.fandom.com/wiki/Arthas_Menethil';
const DEFAULT_ART_STYLE = `Blizzard's World of Warcraft concept art in high resolution like a fine-tuned video game model including each detail and anatomically correct features (if any)`;
const DEFAULT_WRITING_STYLE = 'inspiring but grim, from the year 1200 A.D.';
const DEFAULT_WRITING_TONE = 'slightly annoyed';

const SAVED_PERSONAS = JSON.parse(
  localStorage.getItem(STORAGE_KEY)
);

const App = () => {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [persona, setPersona] = useState();
  const [personaList, setPersonaList] = useState(SAVED_PERSONAS);
  const [isCreating, setIsCreating] = useState(false);

  const [personaName, setPersonaName] = useState('');
  const [personaKnowledgeURI, setPersonaKnowledgeURI] = useState('');
  const [personaArtStyle, setPersonaArtStyle] = useState('');
  const [personaWritingStyle, setPersonaWritingStyle] = useState('');
  const [personaWritingTone, setPersonaWritingTone] = useState('');

  useEffect(() => {
    const personas = getPersonasArray();
    const defaultPersona = personas[0];

    const currentPersona = defaultPersona || {
      name: DEFAULT_NAME,
      knowledgeURI: DEFAULT_KNOWLEDGE_URI,
      avatarURL: DEFAULT_AVATAR_URL,
      artStyle: DEFAULT_ART_STYLE,
      writingStyle: DEFAULT_WRITING_STYLE,
      writingTone: DEFAULT_WRITING_TONE
    };

    const savedPersonas = {
      ...personaList,

      [currentPersona.knowledgeURI]: {
        ...currentPersona,

        online: true
      }
    };

    setPersona(currentPersona);
    setPersonaList(savedPersonas);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.onkeydown = isCreating
      ? onKeyDownOverlay
      : null;

    return () => document.body.onkeydown = null;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreating]);

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

  const closeOverlay = () => {
    setPersonaName('');
    setPersonaKnowledgeURI('');
    setPersonaArtStyle('');
    setPersonaWritingStyle('');
    setPersonaWritingTone('');
    setIsCreating(false);
  };

  const getQuestionPlaceholder = () => (
    !persona ? '...' : `What would you like to ask ${persona.name}?`
  );

  const getPersonasArray = () => (
    Object.values(personaList || {})
  );

  const onChangeQuestion = ({ target: { value }}) => {
    setQuestion(value);
  };

  const onKeyDownQuestion = ({ keyCode }) => (
    question && keyCode === 13 && ask()
  );

  const onKeyDownOverlay = ({ keyCode }) => {
    if (keyCode === 27) {
      closeOverlay();
    }
  };

  const onClickCreate = () => setIsCreating(true);

  const onClickSave = async () => {
    setDisabled(true);

    const personaConfig = {
      name: personaName,
      knowledgeURI: personaKnowledgeURI,
      avatarURL: '',
      artStyle: personaArtStyle,
      writingStyle: personaWritingStyle,
      writingTone: personaWritingTone
    };

    const updatedCurrentPersona = { ...persona };

    updatedCurrentPersona.online = false;

    const updatedPersonaList = {
      ...personaList,

      [personaKnowledgeURI]: personaConfig
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedPersonaList)
    );

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
        alert(PERSONA_CREATED);
        window.location.reload();
      }
    }

    setDisabled(false);
  };

  const onClickOverlay = ({ target: { id }}) => {
    if (id === OVERLAY) {
      closeOverlay();
    }
  };

  const onClickPersonaListItem = key => async () => {
    setDisabled(true);

    const updatedCurrentPersona = { ...persona };

    updatedCurrentPersona.online = false;

    const selectedPersona = {
      ...personaList[key],

      online: true
    };

    setPersona(selectedPersona);

    setPersonaList({
      ...personaList,

      [updatedCurrentPersona.knowledgeURI]: updatedCurrentPersona,
      [selectedPersona.knowledgeURI]: selectedPersona
    });

    const response = await fetch(`${BASE_URL}/v1/configure`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedPersona)
    });

    if (response?.ok) {
      const { success } = await response.json();

      if (!success) {
        alert(PERSONA_ERROR);
      }
    }

    setDisabled(false);
  };

  const onChangePersonaName = ({ target: { value }}) => (
    setPersonaName(value)
  );

  const onChangePersonaKnowledgeURI = ({ target: { value }}) => (
    setPersonaKnowledgeURI(value)
  );

  const onChangePersonaArtStyle = ({ target: { value }}) => (
    setPersonaArtStyle(value)
  );

  const onChangePersonaWritingStyle = ({ target: { value }}) => (
    setPersonaWritingStyle(value)
  );

  const onChangePersonaWritingTone = ({ target: { value }}) => (
    setPersonaWritingTone(value)
  );

  return <>
    {isCreating && <aside id="overlay" onClick={onClickOverlay}>
      <div className="form">
        <h2>Create Persona</h2>
        <input
          required
          disabled={disabled}
          placeholder={PERSONA_NAME}
          onChange={onChangePersonaName}
          value={personaName}
        />
        <input
          required
          disabled={disabled}
          placeholder={PERSONA_KNOWLEDGE_URI}
          onChange={onChangePersonaKnowledgeURI}
          value={personaKnowledgeURI}
        />
        <input
          required
          disabled={disabled}
          placeholder={PERSONA_ART_STYLE}
          onChange={onChangePersonaArtStyle}
          value={personaArtStyle}
        />
        <input
          required
          disabled={disabled}
          placeholder={PERSONA_WRITING_STYLE}
          onChange={onChangePersonaWritingStyle}
          value={personaWritingStyle}
        />
        <input
          required
          disabled={disabled}
          placeholder={PERSONA_WRITING_TONE}
          onChange={onChangePersonaWritingTone}
          value={personaWritingTone}
        />
        <button
          disabled={disabled}
          onClick={onClickSave}
        >
          {SAVE}
        </button>
      </div>
    </aside>}
    <nav id="nav" className="panel">
      <h1>{PERSONA_LIST_HEADING}</h1>
      <ul className="persona-list">
        {personaList && getPersonasArray().map(({
          name,
          knowledgeURI,
          avatarURL,
          online = false
        }) => (
          <li
            key={knowledgeURI}
            className={`persona-list-item panel ${online ? 'selected' : ''}`}
            onClick={onClickPersonaListItem(knowledgeURI)}
          >
            <span className="online-indicator" />
            <span className="persona-avatar">
              {avatarURL && <img
                src={avatarURL}
                alt={name}
                width="100%"
                height="100%"
              />}
            </span>
            <h2>{name}</h2>
          </li>
        ))}
      </ul>
      <button
        id="create-persona-button"
        onClick={onClickCreate}
      >
        {CREATE}
      </button>
    </nav>
    <main id="app" className="panel">
      <div id="output">
        <div className="img">
          {image && <img
            src={image}
            alt={DEFAULT_IMG_ALT}
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
    </main>
  </>;
}

export default App;
