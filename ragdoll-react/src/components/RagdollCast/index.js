import './index.css';

const CONFIRM_EXPORT = 'Export the current cast?';
const EXPORT = 'Export';
const PUBLISH = 'Publish';

const RagdollCast = ({
  disabled,
  ragdollList,
  onShow
}) => {
  const getRagdollsArray = () => (
    Object.values(ragdollList || {})
  );

  const onClickExport = () => {
    if (!window.confirm(CONFIRM_EXPORT)) return;

    const fileExport = {
      author: window.prompt('Author name'),
      name: window.prompt('Cast name'),
      description: window.prompt('Cast description (optional)') || '',
      dolls: getRagdollsArray()
    };

    if (!fileExport.author || !fileExport.name || fileExport.dolls.length < 1) {
      alert('Invalid export configuration.');

      return;
    }

    window.open(
      `data:text/json,${encodeURIComponent(JSON.stringify(fileExport, null, 4))}`,
      '_blank'
    );
  };

  return <div id="export">
    <h6>Cast</h6>
    <div>
      <button disabled={disabled} onClick={onClickExport}>
        {EXPORT}
      </button>
      <button disabled={disabled} onClick={onShow}>
        {PUBLISH}
      </button>
    </div>
  </div>;
}

export default RagdollCast;
