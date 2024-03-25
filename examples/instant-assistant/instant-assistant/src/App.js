import { useEffect, useState } from 'react';

import RandomProfile from 'random-profile-generator';

import './App.css';

const BASE_URL = 'http://localhost:8000';
const STORAGE_KEY = 'ARTHAS_INSTANT_ASSISTANT';
const OVERLAY = 'overlay';
const SEND = 'Send';
const SAVE = 'Save';
const CREATE = '🗨';
const PERSONA_LIST_HEADING = 'Domain-specific Personas (DSPs)';
const PERSONA_CREATED = 'New persona created.';
const PERSONA_ERROR = 'Error loading persona.';
const PERSONA_NAME = 'Name';
const PERSONA_AVATAR_URL = 'Avatar URL';
const PERSONA_KNOWLEDGE_URI = 'Store URL';
const PERSONA_WRITING_STYLE = 'Writing style';
const PERSONA_WRITING_TONE = 'Writing tone';
// const DEFAULT_PERSONA_GENDER = 'Male';
const DEFAULT_PERSONA_GENDER = 'Female';
const SAVE_ERROR = 'Error saving persona.';
const API_ERROR = 'API temporarily unavailable.';

const SAVED_PERSONAS = JSON.parse(
  localStorage.getItem(STORAGE_KEY)
);

const App = () => {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [persona, setPersona] = useState();
  const [personaList, setPersonaList] = useState(SAVED_PERSONAS);
  const [isCreating, setIsCreating] = useState(false);
  const [overlayClassName, setOverlayClassName] = useState('');
  const [timeoutId, setTimeoutId] = useState();

  const [personaName, setPersonaName] = useState('');
  const [personaKnowledgeURI, setPersonaKnowledgeURI] = useState('');
  const [personaWritingStyle, setPersonaWritingStyle] = useState('');
  const [personaWritingTone, setPersonaWritingTone] = useState('');
  const [personaAvatarURL, setPersonaAvatarURL] = useState('');
  const [personaGender] = useState(DEFAULT_PERSONA_GENDER);

  useEffect(() => {
    const personas = getPersonasArray();
    const currentPersona = personas.pop();

    if (!currentPersona) return;

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
      ? (overlayClassName && onKeyDownOverlay)
      : null;

    return () => document.body.onkeydown = null;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreating, overlayClassName]);

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, [timeoutId]);

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

  const openOverlay = () => {
    const {
      firstName,
      avatar
    } = RandomProfile.profile(personaGender);

    setIsCreating(true);
    setOverlayClassName('');

    requestAnimationFrame(() => {
      setPersonaName(firstName);
      setPersonaAvatarURL(avatar);
      setOverlayClassName('show');
    });
  };

  const closeOverlay = () => {
    setPersonaName('');
    setPersonaKnowledgeURI('');
    setPersonaWritingStyle('');
    setPersonaWritingTone('');
    setOverlayClassName('');

    setTimeoutId(
      setTimeout(() => {
        setIsCreating(false);
      }, 1000)
    );
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

  const onClickCreate = openOverlay;

  const onClickSave = async () => {
    setDisabled(true);

    const personaConfig = {
      name: personaName,
      knowledgeURI: personaKnowledgeURI,
      avatarURL: personaAvatarURL,

      // Passing null for artStyle will skip image generation

      artStyle: null,
      writingStyle: personaWritingStyle,
      writingTone: personaWritingTone
    };

    const updatedCurrentPersona = { ...persona };

    updatedCurrentPersona.online = false;

    const updatedPersonaList = {
      ...personaList,

      [updatedCurrentPersona.knowledgeURI]: updatedCurrentPersona,
      [personaKnowledgeURI]: personaConfig
    };

    const response = await fetch(`${BASE_URL}/v1/configure`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(personaConfig)
    });

    if (response?.ok) {
      const { error, success } = await response.json();

      if (success) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedPersonaList)
        );

        alert(PERSONA_CREATED);
        window.location.reload();

        return;
      } else {
        alert(error?.message || SAVE_ERROR);
      }
    } else {
      alert(SAVE_ERROR);
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

    setText('');
    setQuestion('');
    setDisabled(false);
  };

  const onChangePersonaName = ({ target: { value }}) => (
    setPersonaName(value)
  );

  const onChangePersonaKnowledgeURI = ({ target: { value }}) => (
    setPersonaKnowledgeURI(value)
  );

  const onChangePersonaWritingStyle = ({ target: { value }}) => (
    setPersonaWritingStyle(value)
  );

  const onChangePersonaWritingTone = ({ target: { value }}) => (
    setPersonaWritingTone(value)
  );

  const onChangePersonaAvatarURL = ({ target: { value }}) => (
    setPersonaAvatarURL(value)
  );

  return <>
    {isCreating && <aside id="overlay" className={overlayClassName} onClick={onClickOverlay}>
      <div className="form">
        <h2>Create Shopping Assistant</h2>
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
          placeholder={PERSONA_AVATAR_URL}
          onChange={onChangePersonaAvatarURL}
          value={personaAvatarURL}
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
        }) => online && (
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
    </nav>
    <button
      disabled={isCreating}
      id="create-persona-button"
      onClick={onClickCreate}
    >
      {CREATE}
    </button>
    {persona && <main id="app" className="panel">
      <div id="output">
        <div className="img">
          {persona.avatarURL && <img
            src={persona.avatarURL}
            alt={persona.name}
            width="100%"
            height="100%"
          />}
        </div>
        {text && <p>{text}</p>}
      </div>
      <div id="input">
        <input
          autoFocus
          disabled={disabled || isCreating}
          value={question}
          placeholder={getQuestionPlaceholder()}
          onChange={onChangeQuestion}
          onKeyDown={onKeyDownQuestion}
        />
        <button
          disabled={disabled || isCreating}
          onClick={ask}
        >
          {SEND}
        </button>
      </div>
    </main>}
  </>;
}

export default App;
