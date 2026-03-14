import React from 'react';

const FormInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = 'text',
  required = false,
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span style={{ color: '#e74c3c' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`form-input ${error ? 'form-input--error' : ''}`}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormInput;
