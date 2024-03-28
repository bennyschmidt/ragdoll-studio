import './RagdollList.css';
const RAGDOLL_LIST_HEADING = 'Domain-specific Personas (DSPs)';
const RAGDOLL_ERROR = 'Error loading ragdoll.';
const RagdollList = ({
  children,
  ragdoll,
  ragdollList,
  onClickListItem,
  didClickListItem
}) => {
  const {
    RAGDOLL_URI
  } = window;
  const getPersonasArray = () => Object.values(ragdollList || {});
  const onClickRagdollListItem = key => async () => {
    const updatedCurrentPersona = {
      ...ragdoll
    };
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
      const {
        success
      } = await response.json();
      if (!success) {
        alert(RAGDOLL_ERROR);
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
  }, /*#__PURE__*/React.createElement("h1", null, RAGDOLL_LIST_HEADING), /*#__PURE__*/React.createElement("ul", {
    className: "ragdoll-list"
  }, ragdollList && getPersonasArray().map(({
    name,
    knowledgeURI,
    avatarURL,
    online = false
  }) => /*#__PURE__*/React.createElement("li", {
    key: knowledgeURI,
    className: `ragdoll-list-item panel ${online ? 'selected' : ''}`,
    onClick: onClickRagdollListItem(knowledgeURI)
  }, /*#__PURE__*/React.createElement("span", {
    className: "online-indicator"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ragdoll-avatar"
  }, avatarURL && /*#__PURE__*/React.createElement("img", {
    src: avatarURL,
    alt: name,
    width: "100%",
    height: "100%"
  })), /*#__PURE__*/React.createElement("h2", null, name)))), children));
};
export default RagdollList;