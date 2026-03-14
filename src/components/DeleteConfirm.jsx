import React from 'react';
import Modal from './Modal.jsx';


const DeleteConfirm = ({ isOpen, onClose, onConfirm, name }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="modal__header">
        <h2 className="modal__title">Confirm Delete</h2>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="modal__body">
        <div className="delete-icon">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>

        <p className="delete-text">
          Վստա՞հ եք, որ ցանկանում եք ջնջել <strong>{name}</strong>-ը։
          <br />
          <span className="delete-text--sub">Այս գործողությունը հնարավոր չէ հետ բերել։</span>
        </p>
      </div>

      <div className="modal__actions">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Չեղարկել
        </button>
        <button type="button" className="btn btn--danger" onClick={onConfirm}>
          Ջնջել
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirm;
