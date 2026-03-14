import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal.jsx';
import { addAttribute, updateAttribute } from '../store/reducers/attributeSlice.js';

const initialValues = {
  attributeName: '',
  attributeValue: '',
};

const AttributeForm = ({ isOpen, onClose, mode = 'add', initialData }) => {
  const dispatch = useDispatch();
  const { actionLoading } = useSelector((s) => s.school);

  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && initialData) {
      setValues({
        attributeName: initialData.attributeName ?? '',
        attributeValue: initialData.attributeValue ?? '',
      });
    } else {
      setValues(initialValues);
    }
    setTouched({});
  }, [isOpen, mode, initialData]);

  const errors = useMemo(() => {
    const e = {};
    if (!values.attributeName.trim()) e.attributeName = 'Required';
    if (!values.attributeValue.trim()) e.attributeValue = 'Required';
    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (key) => (ev) => {
    setValues((prev) => ({ ...prev, [key]: ev.target.value }));
  };

  const handleBlur = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ attributeName: true, attributeValue: true });
    if (!isValid) return;

    const payload = {
      attributeName: values.attributeName.trim(),
      attributeValue: values.attributeValue.trim(),
    };

    if (mode === 'edit') {
      await dispatch(updateAttribute({ id: initialData.id, ...payload }));
    } else {
      await dispatch(addAttribute(payload));
    }

    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="modal__header">
        <h2 className="modal__title">{mode === 'edit' ? 'Edit Attribute' : 'Add Attribute'}</h2>
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

      <form onSubmit={handleSubmit}>
        <div className="modal__body">
          <div className="form-group">
            <label className="form-label">Attribute Name</label>
            <input
              className="form-input"
              value={values.attributeName}
              onChange={handleChange('attributeName')}
              onBlur={handleBlur('attributeName')}
              placeholder="e.g. Address"
            />
            {touched.attributeName && errors.attributeName && (
              <div className="form-error">{errors.attributeName}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Attribute Value</label>
            <input
              className="form-input"
              value={values.attributeValue}
              onChange={handleChange('attributeValue')}
              onBlur={handleBlur('attributeValue')}
              placeholder="e.g. Yerevan"
            />
            {touched.attributeValue && errors.attributeValue && (
              <div className="form-error">{errors.attributeValue}</div>
            )}
          </div>
        </div>

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={actionLoading}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={actionLoading}>
            {actionLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AttributeForm;
