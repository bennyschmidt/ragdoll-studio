import React from 'react';

const Icon = ({ src, size = 20 }) => (
  <img
    src={src}
    alt={
      `icon-${src.slice(src.lastIndexOf('/') + 1, src.lastIndexOf('.'))}`
    }
    width={`${size}px`}
    height={`${size}px`}
  />
);

export default Icon;
