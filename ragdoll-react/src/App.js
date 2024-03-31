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

const DEFAULT_ADDITIONAL_KNOWLEDGE_URIS = [
  'https://wowwiki-archive.fandom.com/wiki/Arthas:_Rise_of_the_Lich_King',
  'https://cableplugger.wordpress.com/wp-content/uploads/2010/11/world-of-warcraft-2009-arthas-rise-of-the-lich-king-christie-golden.pdf',
  'https://www.reddit.com/r/wow/comments/7guydb/lore_post_the_tragedy_of_arthas_menethil/'
]

const DEFAULT_RAGDOLL = {
  name: DEFAULT_NAME,
  knowledgeURI: DEFAULT_KNOWLEDGE_URI,
  avatarURL: DEFAULT_AVATAR_URL,
  artStyle: DEFAULT_ART_STYLE,
  writingStyle: DEFAULT_WRITING_STYLE,
  writingTone: DEFAULT_WRITING_TONE,
  additionalKnowledgeURIs: DEFAULT_ADDITIONAL_KNOWLEDGE_URIS
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

  const [ragdollName, setRagdollName] = useState('');
  const [ragdollKnowledgeURI, setRagdollKnowledgeURI] = useState('');
  const [ragdollArtStyle, setRagdollArtStyle] = useState('');
  const [ragdollWritingStyle, setRagdollWritingStyle] = useState('');
  const [ragdollWritingTone, setRagdollWritingTone] = useState('');
  const [ragdollAvatarURL, setRagdollAvatarURL] = useState('');
  const [ragdollAdditionalKnowledgeURIs, setRagdollAdditionalKnowledgeURIs] = useState([]);
  const [ragdoll, setRagdoll] = useState(DEFAULT_RAGDOLL);
  const [ragdollList, setRagdollList] = useState(SAVED_RAGDOLLS);
  const [activeRagdoll] = useRagdoll(ragdoll);

  useEffect(() => {
    const ragdolls = getRagdollsArray();
    const currentRagdoll = ragdolls[0] || ragdoll;

    const savedRagdolls = {
      ...ragdollList,

      [currentRagdoll.knowledgeURI]: {
        ...currentRagdoll,

        online: true
      }
    };

    setRagdoll(currentRagdoll);
    setRagdollList(savedRagdolls);

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
    setRagdollName('');
    setRagdollKnowledgeURI('');
    setRagdollArtStyle('');
    setRagdollWritingStyle('');
    setRagdollWritingTone('');
    setOverlayClassName('');

    setTimeoutId(
      setTimeout(() => {
        setIsCreating(false);
      }, 1000)
    );
  };

  const getRagdollsArray = () => (
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

  const onChangeRagdollName = ({ target: { value }}) => (
    setRagdollName(value)
  );

  const onChangeRagdollKnowledgeURI = ({ target: { value }}) => (
    setRagdollKnowledgeURI(value)
  );

  const onChangeRagdollArtStyle = ({ target: { value }}) => (
    setRagdollArtStyle(value)
  );

  const onChangeRagdollWritingStyle = ({ target: { value }}) => (
    setRagdollWritingStyle(value)
  );

  const onChangeRagdollWritingTone = ({ target: { value }}) => (
    setRagdollWritingTone(value)
  );

  const onChangeRagdollAvatarURL = ({ target: { value }}) => (
    setRagdollAvatarURL(value)
  );

  const onChangeRagdollAdditionalKnowledgeURIs = ({ target: { value }}) => (
    setRagdollAdditionalKnowledgeURIs([
      ...ragdollAdditionalKnowledgeURIs,

      value
    ])
  );

  const onQuestion = value => setQuestion(value);

  const onAnswer = answer => {
    setImageURL(answer?.imageURL);
    setText(answer?.text);
  };

  const onClickListItem = () => {
    setDisabled(true);
  };

  const didClickListItem = ({ currentRagdoll, previousRagdoll }) => {
    setRagdoll(currentRagdoll);

    const updatedRagdollList = {
      ...ragdollList,

      [currentRagdoll.knowledgeURI]: currentRagdoll
    };

    if (previousRagdoll?.knowledgeURI) {
      previousRagdoll.online = false;
      updatedRagdollList[previousRagdoll.knowledgeURI] = previousRagdoll;
    }

    setRagdollList(updatedRagdollList);
    setText('');
    setImageURL('')
    setQuestion('');
    setDisabled(false);
  };

  const ragdollFormProps = {
    disabled,
    ragdoll: activeRagdoll || ragdoll,
    ragdollList,
    ragdollName,
    ragdollKnowledgeURI,
    ragdollArtStyle,
    ragdollWritingStyle,
    ragdollWritingTone,
    ragdollAvatarURL,
    ragdollAdditionalKnowledgeURIs,
    onChangeRagdollName,
    onChangeRagdollKnowledgeURI,
    onChangeRagdollArtStyle,
    onChangeRagdollWritingStyle,
    onChangeRagdollWritingTone,
    onChangeRagdollAvatarURL,
    onChangeRagdollAdditionalKnowledgeURIs
  };

  const ragdollChatProps = {
    disabled: disabled || isCreating,
    ragdoll: activeRagdoll || ragdoll,
    question,
    imageURL,
    text,
    onQuestion,
    onAnswer
  };

  const ragdollListProps = {
    ragdoll: activeRagdoll || ragdoll,
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
