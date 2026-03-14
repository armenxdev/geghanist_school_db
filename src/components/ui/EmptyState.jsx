import React from 'react';

const EmptyState = ({ message, icon }) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <p className="empty-state__message">{message}</p>
    </div>
  );
};

export default EmptyState;
