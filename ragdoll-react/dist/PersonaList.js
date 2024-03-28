import './PersonaList.css';
const PERSONA_LIST_HEADING = 'Domain-specific Personas (DSPs)';
const PERSONA_ERROR = 'Error loading persona.';
const PersonaList = ({
  children,
  persona,
  personaList,
  onClickListItem,
  didClickListItem
}) => {
  const {
    RAGDOLL_URI
  } = window;
  const getPersonasArray = () => Object.values(personaList || {});
  const onClickPersonaListItem = key => async () => {
    const updatedCurrentPersona = {
      ...persona
    };
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
      const {
        success
      } = await response.json();
      if (!success) {
        alert(PERSONA_ERROR);
      }
    }
    didClickListItem({
      currentPersona: selectedPersona,
      previousPersona: updatedCurrentPersona
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", {
    id: "nav",
    className: "panel"
  }, /*#__PURE__*/React.createElement("h1", null, PERSONA_LIST_HEADING), /*#__PURE__*/React.createElement("ul", {
    className: "persona-list"
  }, personaList && getPersonasArray().map(({
    name,
    knowledgeURI,
    avatarURL,
    online = false
  }) => /*#__PURE__*/React.createElement("li", {
    key: knowledgeURI,
    className: `persona-list-item panel ${online ? 'selected' : ''}`,
    onClick: onClickPersonaListItem(knowledgeURI)
  }, /*#__PURE__*/React.createElement("span", {
    className: "online-indicator"
  }), /*#__PURE__*/React.createElement("span", {
    className: "persona-avatar"
  }, avatarURL && /*#__PURE__*/React.createElement("img", {
    src: avatarURL,
    alt: name,
    width: "100%",
    height: "100%"
  })), /*#__PURE__*/React.createElement("h2", null, name)))), children));
};
export default PersonaList;