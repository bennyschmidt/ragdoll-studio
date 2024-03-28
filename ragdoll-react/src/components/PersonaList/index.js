import './index.css';

const PERSONA_LIST_HEADING = 'Domain-specific Personas (DSPs)';
const PERSONA_ERROR = 'Error loading persona.';

const PersonaList = ({
  children,
  persona,
  personaList,
  onClickListItem,
  didClickListItem
}) => {
  const { RAGDOLL_URI } = window;

  const getPersonasArray = () => (
    Object.values(personaList || {})
  );

  const onClickPersonaListItem = key => async () => {
    const updatedCurrentPersona = { ...persona };

    updatedCurrentPersona.online = false;

    const selectedPersona = {
      ...personaList[key],

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
        alert(PERSONA_ERROR);
      }
    }

    didClickListItem({
      currentPersona: selectedPersona,
      previousPersona: updatedCurrentPersona
    });
  };

  return <>
    <nav id="nav" className="panel">
      <h1>{PERSONA_LIST_HEADING}</h1>
      <ul className="persona-list">
        {personaList && getPersonasArray().map(({
          name,
          knowledgeURI,
          avatarURL,
          online = false
        }) => (
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
      {children}
    </nav>
  </>;
}

export default PersonaList;
