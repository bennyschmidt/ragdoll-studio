import React from 'react';
import './RagdollCast.css';
const CONFIRM_EXPORT = 'Export the current cast?';
const EXPORT = 'Export';
const PUBLISH = 'Publish';
const RagdollCast = ({
  disabled,
  ragdollList,
  onShow
}) => {
  const getRagdollsArray = () => Object.values(ragdollList || {});
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
    window.open(`data:text/json,${encodeURIComponent(JSON.stringify(fileExport, null, 4))}`, '_blank');
  };
  return /*#__PURE__*/React.createElement("div", {
    id: "export"
  }, /*#__PURE__*/React.createElement("h6", null, "Cast"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClickExport
  }, EXPORT), /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onShow
  }, PUBLISH)));
};
export default RagdollCast;