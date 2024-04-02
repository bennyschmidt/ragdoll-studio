import React from 'react';

import './index.css';

const Icon = ({ src, size = 20 }) => (
  <img
    className="icon"
    src={src}
    alt={
      `icon-${src.slice(src.lastIndexOf('/') + 1, src.lastIndexOf('.'))}`
    }
    width={`${size}px`}
    height={`${size}px`}
  />
);

export default Icon;
