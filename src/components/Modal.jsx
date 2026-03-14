import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

const SIZE_CLASS = {
  sm: 'modal--sm',
  md: 'modal--md',
  lg: 'modal--lg',
};

const Modal = ({ isOpen, onClose, children, size = 'md' }) => {
  const modalRoot = useMemo(() => document.getElementById('modal-root'), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (!modalRoot) return null;

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const sizeClass = SIZE_CLASS[size] ?? SIZE_CLASS.md;

  return ReactDOM.createPortal(
    <div className="modal-backdrop" role="presentation" onMouseDown={handleBackdropMouseDown}>
      <div className={`modal ${sizeClass}`} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
