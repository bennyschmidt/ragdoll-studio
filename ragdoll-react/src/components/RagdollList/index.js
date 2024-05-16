import React from 'react';

import './index.css';

const RAGDOLL_ERROR = 'Error loading ragdoll.';

const RagdollList = ({
  children,
  ragdoll,
  ragdollList,
  mode,
  onClickListItem,
  didClickListItem
}) => {
  const { RAGDOLL_URI } = window;

  const getRagdollsArray = () => (
    Object.values(ragdollList || {})
  );

  const onClickRagdollListItem = key => async () => {
    if (ragdoll.knowledgeURI === key) return;

    const updatedCurrentRagdoll = { ...ragdoll };

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
      const { success } = await response.json();

      if (!success) {
        alert(RAGDOLL_ERROR);
      }
    }

    didClickListItem({
      currentRagdoll: selectedRagdoll,
      previousRagdoll: updatedCurrentRagdoll
    });
  };

  return <>
    <nav id="nav" className="panel">
      <ul className="ragdoll-list">
        {ragdollList && getRagdollsArray().map(({
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
