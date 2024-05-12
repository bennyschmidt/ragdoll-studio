import React, { useState } from 'react';

import './index.css';

const Upload = ({ disabled, type, onFile }) => {
  const [fileUpload, setFileUpload] = useState();

  const onChangeFileUpload = ({ target: { files } }) => {
    if (!window.confirm('Are you sure? This will clear the current focus.')) return;

    const [file] = files;

    setFileUpload(file);

    const reader = new FileReader();

    reader.onload = ({ target: { result }}) => {
      onFile(result);
    };

    reader.onerror = () => {
      alert('File upload error.');
    };

    if (type.match('image')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file, 'UTF-8');
    }
  };

  return !fileUpload && <input
    type="file"
    accept={type}
    disabled={disabled}
    onChange={onChangeFileUpload}
  />;
};

export default Upload;
