import './index.css';

const RAGDOLL_LIST_HEADING = 'Domain-specific Personas (DSPs)';
const RAGDOLL_ERROR = 'Error loading ragdoll.';

const RagdollList = ({
  children,
  ragdoll,
  ragdollList,
  onClickListItem,
  didClickListItem
}) => {
  const { RAGDOLL_URI } = window;

  const getPersonasArray = () => (
    Object.values(ragdollList || {})
  );

  const onClickRagdollListItem = key => async () => {
    const updatedCurrentPersona = { ...ragdoll };

    updatedCurrentPersona.online = false;

    const selectedPersona = {
      ...ragdollList[key],

      online: true
    };

    onClickListItem({
      currentPersona: selectedPersona,
      previousPersona: updatedCurrentPersona
    });

    const response = await fetch(`${RAGDOLL_URI}/v1/configure`, {
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
        alert(RAGDOLL_ERROR);
      }
    }

    didClickListItem({
      currentPersona: selectedPersona,
      previousPersona: updatedCurrentPersona
    });
  };

  return <>
    <nav id="nav" className="panel">
      <h1>{RAGDOLL_LIST_HEADING}</h1>
      <ul className="ragdoll-list">
        {ragdollList && getPersonasArray().map(({
          name,
          knowledgeURI,
          avatarURL,
          online = false
        }) => (
          <li
            key={knowledgeURI}
            className={`ragdoll-list-item panel ${online ? 'selected' : ''}`}
            onClick={onClickRagdollListItem(knowledgeURI)}
          >
            <span className="online-indicator" />
            <span className="ragdoll-avatar">
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
      {children}
    </nav>
  </>;
}

export default RagdollList;
