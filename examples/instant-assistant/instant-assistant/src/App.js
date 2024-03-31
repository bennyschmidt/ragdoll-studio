import { useEffect, useState } from 'react';

import {
  RagdollChat,
  RagdollForm
} from 'ragdoll-react';

import './App.css';

// Globals

window.RAGDOLL_URI = 'http://localhost:8000';
window.STORAGE_KEY = 'RAGDOLL_INSTANT_ASSISTANTS';

const { STORAGE_KEY } = window;

const OVERLAY = 'overlay';
const CREATE = '🗨';

const SAVED_RAGDOLLS = JSON.parse(
  localStorage.getItem(STORAGE_KEY)
);

const App = () => {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [ragdoll, setRagdoll] = useState();
  const [ragdollList, setRagdollList] = useState(SAVED_RAGDOLLS);
  const [isCreating, setIsCreating] = useState(false);
  const [overlayClassName, setOverlayClassName] = useState('');
  const [timeoutId, setTimeoutId] = useState();

  const [ragdollName, setRagdollName] = useState('');
  const [ragdollKnowledgeURI, setRagdollKnowledgeURI] = useState('');
  const [ragdollWritingStyle, setRagdollWritingStyle] = useState('');
  const [ragdollWritingTone, setRagdollWritingTone] = useState('');
  const [ragdollAvatarURL, setRagdollAvatarURL] = useState('');
  const [ragdollAdditionalKnowledgeURIs, setRagdollAdditionalKnowledgeURIs] = useState([]);

  useEffect(() => {
    const ragdolls = getRagdollsArray();
    const currentRagdoll = ragdolls.pop();

    if (!currentRagdoll) return;

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

  const onAnswer = answer => setText(answer?.text);

  const ragdollFormProps = {
    textOnly: true,
    disabled,
    ragdoll,
    ragdollList,
    ragdollName,
    ragdollKnowledgeURI,
    ragdollWritingStyle,
    ragdollWritingTone,
    ragdollAvatarURL,
    ragdollAdditionalKnowledgeURIs,
    onChangeRagdollName,
    onChangeRagdollKnowledgeURI,
    onChangeRagdollWritingStyle,
    onChangeRagdollWritingTone,
    onChangeRagdollAvatarURL,
    onChangeRagdollAdditionalKnowledgeURIs
  };

  const ragdollChatProps = {
    disabled: disabled || isCreating,
    ragdoll,
    question,
    text,
    onQuestion,
    onAnswer
  };

  return <>
    {isCreating && <aside id="overlay" className={overlayClassName} onClick={onClickOverlay}>
      <RagdollForm {...ragdollFormProps} />
    </aside>}
    <button
      disabled={isCreating}
      id="create-ragdoll-button"
      onClick={openOverlay}
    >
      {CREATE}
    </button>
    {ragdoll && <main id="app" className="panel">
      <RagdollChat {...ragdollChatProps } />
    </main>}
  </>;
}

export default App;
