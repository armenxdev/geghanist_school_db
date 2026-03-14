import React from "react";

const TYPES = [
    { value: "news",          label: "Նորություն",          icon: "📰" },
    { value: "events",        label: "Միջոցառում",        icon: "📅" },
    { value: "announcements", label: "Հայտարարություն", icon: "📣" },
];

const TypeSelector = ({ value, onChange, error }) => {
    return (
        <div className="type-selector">
            <label className="form-label">
                Post Type <span className="required-star">*</span>
            </label>
            <div className="type-selector__grid">
                {TYPES.map((t) => (
                    <button
                        key={t.value}
                        type="button"
                        className={`type-btn ${value === t.value ? "type-btn--active" : ""}`}
                        onClick={() => onChange(t.value)}
                    >
                        <span className="type-btn__icon">{t.icon}</span>
                        <span className="type-btn__label">{t.label}</span>
                    </button>
                ))}
            </div>
            {error && <div className="form-error">{error}</div>}
        </div>
    );
};

export const TYPE_OPTIONS = TYPES;
export default TypeSelector;