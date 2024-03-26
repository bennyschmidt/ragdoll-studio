import { useEffect, useState } from 'react';

import {
  PersonaChat,
  PersonaForm
} from 'arthas-react';

import './App.css';

// Globals

window.ARTHAS_URI = 'http://localhost:8000';
window.STORAGE_KEY = 'ARTHAS_INSTANT_ASSISTANT';

const { STORAGE_KEY } = window;

const OVERLAY = 'overlay';
const CREATE = '🗨';

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
    const bindKeyDown = () => (
      document.body.onkeydown = (overlayClassName && onKeyDownOverlay)
    );

    const clearKeyDown = () => (
      document.body.onkeydown = null
    );

    if (isCreating) {
      bindKeyDown();
      setDisabled(true);
    } else {
      clearKeyDown();
      setDisabled(false);
    }

    return () => clearKeyDown();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreating, overlayClassName]);

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, [timeoutId]);

  const openOverlay = () => {
    setIsCreating(true);
    setOverlayClassName('');

    requestAnimationFrame(() => {
      setOverlayClassName('show');
    });
  };

  const closeOverlay = () => {
    setOverlayClassName('');

    setTimeoutId(
      setTimeout(() => {
        setIsCreating(false);
      }, 1000)
    );
  };

  const getPersonasArray = () => (
    Object.values(personaList || {})
  );

  const onKeyDownOverlay = ({ keyCode }) => {
    if (keyCode === 27) {
      closeOverlay();
    }
  };

  const onClickOverlay = ({ target: { id }}) => {
    if (id === OVERLAY) {
      closeOverlay();
    }
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

  const onQuestion = value => setQuestion(value);

  const onAnswer = answer => setText(answer?.text);

  const personaFormProps = {
    textOnly: true,
    disabled,
    persona,
    personaList,
    personaName,
    personaKnowledgeURI,
    personaWritingStyle,
    personaWritingTone,
    personaAvatarURL,
    onChangePersonaName,
    onChangePersonaKnowledgeURI,
    onChangePersonaWritingStyle,
    onChangePersonaWritingTone,
    onChangePersonaAvatarURL
  };

  const personaChatProps = {
    disabled: disabled || isCreating,
    persona,
    question,
    text,
    onQuestion,
    onAnswer
  };

  return <>
    {isCreating && <aside id="overlay" className={overlayClassName} onClick={onClickOverlay}>
      <PersonaForm {...personaFormProps} />
    </aside>}
    <button
      disabled={isCreating}
      id="create-persona-button"
      onClick={openOverlay}
    >
      {CREATE}
    </button>
    {persona && <main id="app" className="panel">
      <PersonaChat {...personaChatProps } />
    </main>}
  </>;
}

export default App;
