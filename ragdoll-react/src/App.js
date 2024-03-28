import { useEffect, useState } from 'react';

import {
  PersonaForm,
  PersonaChat,
  PersonaList
} from './components';

import {
  usePersona
} from './hooks';

import './App.css';

// Globals

window.RAGDOLL_URI = 'http://localhost:8000';
window.STORAGE_KEY = 'RAGDOLL_PERSONAS';

const { STORAGE_KEY } = window;

const OVERLAY = 'overlay';
const CREATE = '+';
const DEFAULT_AVATAR_URL = '/img/avatars/ragdoll.png';
const DEFAULT_NAME = 'Arthas';
const DEFAULT_KNOWLEDGE_URI = 'https://wowpedia.fandom.com/wiki/Arthas_Menethil';
const DEFAULT_ART_STYLE = `Blizzard's World of Warcraft concept art in high resolution like a fine-tuned video game model including each detail and anatomically correct features (if any)`;
const DEFAULT_WRITING_STYLE = 'inspiring but grim, like from the dark ages, excluding asterisk-based interjections like "*sigh*"';
const DEFAULT_WRITING_TONE = 'slightly annoyed';

const DEFAULT_PERSONA = {
  name: DEFAULT_NAME,
  knowledgeURI: DEFAULT_KNOWLEDGE_URI,
  avatarURL: DEFAULT_AVATAR_URL,
  artStyle: DEFAULT_ART_STYLE,
  writingStyle: DEFAULT_WRITING_STYLE,
  writingTone: DEFAULT_WRITING_TONE
};

const SAVED_PERSONAS = JSON.parse(
  localStorage.getItem(STORAGE_KEY)
);

const App = () => {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [overlayClassName, setOverlayClassName] = useState('');
  const [timeoutId, setTimeoutId] = useState();

  const [personaName, setPersonaName] = useState('');
  const [personaKnowledgeURI, setPersonaKnowledgeURI] = useState('');
  const [personaArtStyle, setPersonaArtStyle] = useState('');
  const [personaWritingStyle, setPersonaWritingStyle] = useState('');
  const [personaWritingTone, setPersonaWritingTone] = useState('');
  const [personaAvatarURL, setPersonaAvatarURL] = useState('');
  const [persona, setPersona] = useState(DEFAULT_PERSONA);
  const [personaList, setPersonaList] = useState(SAVED_PERSONAS);
  const [activePersona] = usePersona(persona);

  useEffect(() => {
    const personas = getPersonasArray();
    const currentPersona = personas[0] || persona;

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

  const openOverlay = () => {
    setIsCreating(true);
    setOverlayClassName('');

    requestAnimationFrame(() => {
      setOverlayClassName('show');
    });
  };

  const closeOverlay = () => {
    setPersonaName('');
    setPersonaKnowledgeURI('');
    setPersonaArtStyle('');
    setPersonaWritingStyle('');
    setPersonaWritingTone('');
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

  const onChangePersonaArtStyle = ({ target: { value }}) => (
    setPersonaArtStyle(value)
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

  const onAnswer = answer => {
    setImageURL(answer?.imageURL);
    setText(answer?.text);
  };

  const onClickListItem = () => {
    setDisabled(true);
  };

  const didClickListItem = ({ currentPersona, previousPersona }) => {
    setPersona(currentPersona);

    const updatedPersonaList = {
      ...personaList,

      [currentPersona.knowledgeURI]: currentPersona
    };

    if (previousPersona?.knowledgeURI) {
      previousPersona.online = false;
      updatedPersonaList[previousPersona.knowledgeURI] = previousPersona;
    }

    setPersonaList(updatedPersonaList);
    setText('');
    setImageURL('')
    setQuestion('');
    setDisabled(false);
  };

  const personaFormProps = {
    disabled,
    persona: activePersona || persona,
    personaList,
    personaName,
    personaKnowledgeURI,
    personaArtStyle,
    personaWritingStyle,
    personaWritingTone,
    personaAvatarURL,
    onChangePersonaName,
    onChangePersonaKnowledgeURI,
    onChangePersonaArtStyle,
    onChangePersonaWritingStyle,
    onChangePersonaWritingTone,
    onChangePersonaAvatarURL
  };

  const personaChatProps = {
    disabled: disabled || isCreating,
    persona: activePersona || persona,
    question,
    imageURL,
    text,
    onQuestion,
    onAnswer
  };

  const personaListProps = {
    persona: activePersona || persona,
    personaList,
    onClickListItem,
    didClickListItem
  };

  return <>
    {isCreating && <aside id="overlay" className={overlayClassName} onClick={onClickOverlay}>
      <PersonaForm { ...personaFormProps } />
    </aside>}
    <PersonaList { ...personaListProps }>
      <button
        disabled={isCreating}
        id="create-persona-button"
        onClick={openOverlay}
      >
        {CREATE}
      </button>
    </PersonaList>
    <main id="app" className="panel">
      <PersonaChat {...personaChatProps } />
    </main>
  </>;
}

export default App;
