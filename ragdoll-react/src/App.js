import { useEffect, useState } from 'react';

import {
  RagdollForm,
  RagdollChat,
  RagdollList
} from './components';

import {
  useRagdoll
} from './hooks';

import './App.css';

// Globals

window.RAGDOLL_URI = 'http://localhost:8000';
window.STORAGE_KEY = 'RAGDOLLS';

const { STORAGE_KEY } = window;

const OVERLAY = 'overlay';
const CREATE = '+';
const DEFAULT_AVATAR_URL = '/img/avatars/arthas.png';
const DEFAULT_NAME = 'Arthas';
const DEFAULT_KNOWLEDGE_URI = 'https://wowpedia.fandom.com/wiki/Arthas_Menethil';
const DEFAULT_ART_STYLE = `Blizzard's World of Warcraft concept art in high resolution like a fine-tuned video game model including each detail and anatomically correct features (if any)`;
const DEFAULT_WRITING_STYLE = 'inspiring but grim, like from the dark ages, excluding asterisk-based interjections like "*sigh*"';
const DEFAULT_WRITING_TONE = 'slightly annoyed';

const DEFAULT_RAGDOLL = {
  name: DEFAULT_NAME,
  knowledgeURI: DEFAULT_KNOWLEDGE_URI,
  avatarURL: DEFAULT_AVATAR_URL,
  artStyle: DEFAULT_ART_STYLE,
  writingStyle: DEFAULT_WRITING_STYLE,
  writingTone: DEFAULT_WRITING_TONE
};

const SAVED_RAGDOLLS = JSON.parse(
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

  const [ragdollName, setPersonaName] = useState('');
  const [ragdollKnowledgeURI, setPersonaKnowledgeURI] = useState('');
  const [ragdollArtStyle, setPersonaArtStyle] = useState('');
  const [ragdollWritingStyle, setPersonaWritingStyle] = useState('');
  const [ragdollWritingTone, setPersonaWritingTone] = useState('');
  const [ragdollAvatarURL, setPersonaAvatarURL] = useState('');
  const [ragdoll, setPersona] = useState(DEFAULT_RAGDOLL);
  const [ragdollList, setRagdollList] = useState(SAVED_RAGDOLLS);
  const [activePersona] = useRagdoll(ragdoll);

  useEffect(() => {
    const ragdolls = getPersonasArray();
    const currentPersona = ragdolls[0] || ragdoll;

    const savedPersonas = {
      ...ragdollList,

      [currentPersona.knowledgeURI]: {
        ...currentPersona,

        online: true
      }
    };

    setPersona(currentPersona);
    setRagdollList(savedPersonas);

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
    Object.values(ragdollList || {})
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

    const updatedRagdollList = {
      ...ragdollList,

      [currentPersona.knowledgeURI]: currentPersona
    };

    if (previousPersona?.knowledgeURI) {
      previousPersona.online = false;
      updatedRagdollList[previousPersona.knowledgeURI] = previousPersona;
    }

    setRagdollList(updatedRagdollList);
    setText('');
    setImageURL('')
    setQuestion('');
    setDisabled(false);
  };

  const ragdollFormProps = {
    disabled,
    ragdoll: activePersona || ragdoll,
    ragdollList,
    ragdollName,
    ragdollKnowledgeURI,
    ragdollArtStyle,
    ragdollWritingStyle,
    ragdollWritingTone,
    ragdollAvatarURL,
    onChangePersonaName,
    onChangePersonaKnowledgeURI,
    onChangePersonaArtStyle,
    onChangePersonaWritingStyle,
    onChangePersonaWritingTone,
    onChangePersonaAvatarURL
  };

  const ragdollChatProps = {
    disabled: disabled || isCreating,
    ragdoll: activePersona || ragdoll,
    question,
    imageURL,
    text,
    onQuestion,
    onAnswer
  };

  const ragdollListProps = {
    ragdoll: activePersona || ragdoll,
    ragdollList,
    onClickListItem,
    didClickListItem
  };

  return <>
    {isCreating && <aside id="overlay" className={overlayClassName} onClick={onClickOverlay}>
      <RagdollForm { ...ragdollFormProps } />
    </aside>}
    <RagdollList { ...ragdollListProps }>
      <button
        disabled={isCreating}
        id="create-ragdoll-button"
        onClick={openOverlay}
      >
        {CREATE}
      </button>
    </RagdollList>
    <main id="app" className="panel">
      <RagdollChat {...ragdollChatProps } />
    </main>
  </>;
}

export default App;
