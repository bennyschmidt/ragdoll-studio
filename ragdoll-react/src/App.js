import { useEffect, useState } from 'react';

import {
  RagdollForm,
  RagdollChat,
  RagdollList,
  RagdollCast
} from './components';

import {
  useModelInfo,
  useRagdoll
} from './hooks';

import './App.css';
import Icon from './components/Icon';

// Globals

window.RAGDOLL_URI = 'http://localhost:8000';
window.STORAGE_KEY = 'RAGDOLLS';

const { STORAGE_KEY } = window;

const OVERLAY = 'overlay';
const PUBLISH = 'publish';
const CREATE = '+';
const DEFAULT_AVATAR_URL = '/img/avatars/arthas.png';
const DEFAULT_NAME = 'Arthas';
const DEFAULT_KNOWLEDGE_URI = 'https://wowpedia.fandom.com/wiki/Arthas_Menethil';
const DEFAULT_ART_STYLE = `Blizzard's World of Warcraft concept art in high resolution like a fine-tuned video game model including each detail and anatomically correct features (if any)`;
const DEFAULT_WRITING_STYLE = 'inspiring but grim, like from the dark ages, excluding asterisk-based interjections like "*sigh*"';
const DEFAULT_WRITING_TONE = 'slightly annoyed';

const DEFAULT_ADDITIONAL_KNOWLEDGE_URIS = [
  // The following is an entire novel, but it seems like they:
  // 1. slow the vector store way down
  // 2. don't add much informational value
  // 3. can smooth out the personality and fill in gaps
  // 'https://cableplugger.wordpress.com/wp-content/uploads/2010/11/world-of-warcraft-2009-arthas-rise-of-the-lich-king-christie-golden.pdf',
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
  const [isPublishing, setIsPublishing] = useState(false);
  const [overlayClassName, setOverlayClassName] = useState('');
  const [timeoutId, setTimeoutId] = useState();

  const [ragdollName, setRagdollName] = useState('');
  const [ragdollKnowledgeURI, setRagdollKnowledgeURI] = useState('');
  const [ragdollArtStyle, setRagdollArtStyle] = useState('');
  const [ragdollWritingStyle, setRagdollWritingStyle] = useState('');
  const [ragdollWritingTone, setRagdollWritingTone] = useState('');
  const [ragdollAvatarURL, setRagdollAvatarURL] = useState('');
  const [ragdollAdditionalKnowledgeURIs, setRagdollAdditionalKnowledgeURIs] = useState([]);
  const [ragdollList, setRagdollList] = useState(SAVED_RAGDOLLS);
  const [ragdoll, setRagdoll] = useState(!SAVED_RAGDOLLS ? DEFAULT_RAGDOLL : null);

  const [modelInfo] = useModelInfo(ragdoll);
  const [renderImages, setRenderImages] = useState(!!ragdoll?.artStyle);
  const [activeRagdoll] = useRagdoll(ragdoll, renderImages);

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

    setTimeout(() => {
      setRagdoll(currentRagdoll);
      setRagdollList(savedRagdolls);
      setRenderImages(!!currentRagdoll.artStyle);
    }, 200);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.onkeydown = isCreating || isPublishing
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
        setIsPublishing(false);
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
    if (id === OVERLAY || id === PUBLISH) {
      closeOverlay();
    }
  };

  const onClickShowImages = () => (
    setRenderImages(!renderImages)
  );

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

    setRenderImages(!!currentRagdoll.artStyle);
    setRagdollList(updatedRagdollList);
    setText('');
    setImageURL('')
    setQuestion('');
    setDisabled(false);
  };

  const onOpenPublishOverlay = () => {
    setIsPublishing(true);

    setOverlayClassName('');

    requestAnimationFrame(() => {
      setOverlayClassName('show');
    });
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
    renderImages,
    onQuestion,
    onAnswer,
    onClickShowImages
  };

  const ragdollListProps = {
    ragdoll: activeRagdoll || ragdoll,
    ragdollList,
    onClickListItem,
    didClickListItem
  };

  const ragdollCastProps = {
    disabled: disabled || isCreating,
    ragdollList,
    onShow: onOpenPublishOverlay
  };

  return <main id="app">
    {isCreating && <aside id="overlay" className={overlayClassName} onClick={onClickOverlay}>
      <RagdollForm { ...ragdollFormProps } />
    </aside>}
    {isPublishing && <aside id="publish" className={overlayClassName} onClick={onClickOverlay}>
      <div>
        <h3>Publishing a Cast</h3>
        <ol className="instructions">
          <li>
            Clone the <a rel="noreferrer" href="https://github.com/bennyschmidt/ragdoll-studio/tree/master/ragdoll-www-nextjs" target="_blank">Community Site repo</a> from GitHub.
          </li>
          <li>
            If publishing for the first time, create a directory for the name you want to publish under, like this:
            <br />
            <code>/ragdoll-www-nextjs/public/.casts/YOUR_NAME/</code>
            <br />
            This is where you'll put your published casts moving forward. Create a folder for the cast you want to publish, like this:
            <br />
            <code>/ragdoll-www-nextjs/public/.casts/YOUR_NAME/YOUR_CAST/</code>
          </li>
          <li>In Ragdoll Studio, <em>Export</em> your cast with the name and cast matching the newly created directories. A JSON file will open in a new tab.</li>
          <li><em>Save Link As...</em> <code>cast.json</code> to the newly created directory in the Community Site repo.</li>
          <li>Your <code>cast.json</code> file path should look like this:
            <br />
            <code>/ragdoll-www-nextjs/public/.casts/YOUR_NAME/YOUR_CAST/cast.json</code>
            <br />
            You can now open a <a rel="noreferrer" href="https://github.com/bennyschmidt/ragdoll-studio/pulls" target="_blank">Pull Request</a> to commit your changes.</li>
          <li>The approver of the pull request <em>signs</em> your <code>cast.json</code> by appending a <code>createdAt</code> timestamp to the file.</li>
          <li>Once approved and signed, the Pull Request can be merged into <code>master</code> and your cast will appear on the front page of the Community Site momentarily.</li>
        </ol>
        <button onClick={closeOverlay}>Close</button>
      </div>
    </aside>}
    <header>
      <h4>
        <span>
          <span className={`indicator ${modelInfo?.textModel ? 'success' : ''}`} />
          <span className="indicator-label">Text-to-Text:</span>&nbsp;<em>{modelInfo?.textModel || 'Loading...'}</em>
        </span>
        <span>
          <span className={`indicator ${modelInfo?.textModel ? 'success' : ''}`} />
          <span className="indicator-label">Text-to-Image:</span>&nbsp;<em>{modelInfo?.stableDiffusionImageModel || 'Loading...'}</em>
        </span>
      </h4>
      <nav id="switch">
        <button>
          <Icon src="/img/story.svg" />
          <span className="indicator" />
        </button>
        <button>
          <Icon src="/img/picture.svg" />
        </button>
        <button>
          <Icon src="/img/video.svg" />
        </button>
        <button>
          <Icon src="/img/audio.svg" />
        </button>
        <button>
          <Icon src="/img/code.svg" />
        </button>
      </nav>
    </header>
    <div id="app-frame">
      <RagdollList { ...ragdollListProps }>
        <button
          disabled={isCreating}
          id="create-ragdoll-button"
          onClick={openOverlay}
        >
          {CREATE}
        </button>
        <RagdollCast {...ragdollCastProps} />
      </RagdollList>
      <div id="workspace" className="panel">
        <RagdollChat {...ragdollChatProps } />
      </div>
    </div>
  </main>;
}

export default App;
