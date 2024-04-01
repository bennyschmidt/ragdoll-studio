import './RagdollList.css';
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
  const getRagdollsArray = () => Object.values(ragdollList || {});
  const onClickRagdollListItem = key => async () => {
    if (ragdoll.knowledgeURI === key) return;
    const updatedCurrentRagdoll = {
      ...ragdoll
    };
    updatedCurrentRagdoll.online = false;
    const selectedRagdoll = {
      ...ragdollList[key],
      online: true
    };
    onClickListItem({
      currentRagdoll: selectedRagdoll,
      previousRagdoll: updatedCurrentRagdoll
    });
    const response = await fetch(`${RAGDOLL_URI}/v1/configure`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedRagdoll)
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
      currentRagdoll: selectedRagdoll,
      previousRagdoll: updatedCurrentRagdoll
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", {
    id: "nav",
    className: "panel"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "ragdoll-list"
  }, ragdollList && getRagdollsArray().map(({
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