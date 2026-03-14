import React from 'react';
import Modal from '../Modal.jsx';

const ConfirmDelete = ({ isOpen, onClose, onConfirm, itemName, isLoading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="modal__header">
        <h2 className="modal__title">Confirm Delete</h2>
        <button
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
          disabled={isLoading}
        >
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
        <p>
          Are you sure you want to delete <strong>{itemName}</strong>?
          <br />
          <span style={{ fontSize: '0.875rem', color: '#666' }}>
            This action cannot be undone.
          </span>
        </p>
      </div>

      <div className="modal__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDelete;
