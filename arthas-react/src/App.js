import { useEffect, useState } from 'react';

import {
  PersonaForm,
  PersonaChat,
  PersonaList
} from './components';

import './App.css';

const STORAGE_KEY = 'ARTHAS_PERSONAS';
const OVERLAY = 'overlay';
const CREATE = '+';
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
  const [overlayClassName, setOverlayClassName] = useState('');
  const [timeoutId, setTimeoutId] = useState();

  const [personaName, setPersonaName] = useState('');
  const [personaKnowledgeURI, setPersonaKnowledgeURI] = useState('');
  const [personaArtStyle, setPersonaArtStyle] = useState('');
  const [personaWritingStyle, setPersonaWritingStyle] = useState('');
  const [personaWritingTone, setPersonaWritingTone] = useState('');
  const [personaAvatarURL, setPersonaAvatarURL] = useState('');

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
    setImage(answer?.image);
    setText(answer?.text);
  };

  const onClickListItem = () => {
    setDisabled(true);
  };

  const didClickListItem = ({ currentPersona, previousPersona }) => {
    setPersona(currentPersona);

    setPersonaList({
      ...personaList,

      [previousPersona.knowledgeURI]: previousPersona,
      [currentPersona.knowledgeURI]: currentPersona
    });

    setText('');
    setImage('')
    setQuestion('');
    setDisabled(false);
  };

  const personaFormProps = {
    disabled,
    persona,
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
    persona,
    question,
    image,
    text,
    onQuestion,
    onAnswer
  };

  const personaListProps = {
    persona,
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
