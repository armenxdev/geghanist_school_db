import React, { useState, useEffect } from 'react';

const ROLE_MAX = 150;

const initialErrors = { fullName: '', role: '' };

const validateFullname = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Անունը պարտադիր է';
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) return 'Պետք է նշել անուն և ազգանուն';
    if (parts.some(p => p.length < 2)) return 'Անունի և ազգանվան յուրաքանչյուր հատված պետք է լինի մի քանի տառ';
    return '';
};

const validateRole = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Պաշտոնը պարտադիր է';
    if (trimmed.length > ROLE_MAX) return `Պաշտոնը չի կարող գերազանցել ${ROLE_MAX} նիշը`;
    return '';
};

const StaffForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const isEdit = Boolean(initialData);

    const [form, setForm] = useState({ fullName: '', role: '' });
    const [errors, setErrors] = useState(initialErrors);
    const [touched, setTouched] = useState({ fullName: false, role: false });

    useEffect(() => {
        if (isOpen) {
            setForm(initialData ? { fullName: initialData.fullName, role: initialData.role } : { fullName: '', role: '' });
            setErrors(initialErrors);
            setTouched({ fullName: false, role: false });
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: name === 'fullName' ? validateFullname(value) : validateRole(value),
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({
            ...prev,
            [name]: name === 'fullName' ? validateFullname(value) : validateRole(value),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullNameErr = validateFullname(form.fullName);
        const roleErr     = validateRole(form.role);

        setErrors({ fullName: fullNameErr, role: roleErr }); // ✅
        setTouched({ fullName: true, role: true });           // ✅

        if (fullNameErr || roleErr) return;

        onSubmit({ fullName: form.fullName.trim(), role: form.role.trim() }); // ✅
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal__header">
                    <h2 className="modal__title">
                        {isEdit ? 'Խմբագրել աշխատակցին' : 'Ավելացնել աշխատակից'}
                    </h2>
                    <button className="modal__close" onClick={onClose} aria-label="Close">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <form className="modal__form" onSubmit={handleSubmit} noValidate>
                    <div className={`form-field ${errors.fullName && touched.fullName ? 'form-field--error' : ''}`}>
                        <label className="form-field__label" htmlFor="fullname">
                            Անուն Ազգանուն
                            <span className="form-field__required">*</span>
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            className="form-field__input"
                            placeholder="օր.՝ Անի Հակոբյան"
                            value={form.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                        />
                        {errors.fullName && touched.fullName && (
                            <span className="form-field__error">{errors.fullName}</span>
                        )}
                    </div>

                    <div className={`form-field ${errors.role && touched.role ? 'form-field--error' : ''}`}>
                        <label className="form-field__label" htmlFor="role">
                            Պաշտոն / Առարկա
                            <span className="form-field__required">*</span>
                        </label>
                        <input
                            id="role"
                            name="role"
                            type="text"
                            className="form-field__input"
                            placeholder="օր.՝ Մաթեմատիկայի ուսուցիչ, Դասղեկ"
                            value={form.role}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            maxLength={ROLE_MAX + 10}
                        />
                        <div className="form-field__meta">
                            {errors.role && touched.role ? (
                                <span className="form-field__error">{errors.role}</span>
                            ) : <span />}
                            <span className={`form-field__counter ${form.role.length > ROLE_MAX ? 'form-field__counter--over' : ''}`}>
                                {form.role.length}/{ROLE_MAX}
                            </span>
                        </div>
                    </div>

                    <div className="modal__actions">
                        <button type="button" className="btn btn--ghost" onClick={onClose}>
                            Չեղարկել
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {isEdit ? 'Պահպանել' : 'Ավելացնել'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffForm;