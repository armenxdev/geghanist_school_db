import React from 'react';

const Loader = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClass = {
    sm: 'loader--sm',
    md: 'loader--md',
    lg: 'loader--lg',
  }[size] || 'loader--md';

  return (
    <div className="loader-container">
      <div className={`loader ${sizeClass}`} />
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;
