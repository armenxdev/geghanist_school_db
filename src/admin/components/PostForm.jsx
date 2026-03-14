import React, { useState } from "react";
import api from "../../api/axios.js";   // ← ավելացրու
import TypeSelector from "./TypeSelector.jsx";
import MediaUploader from "./MediaUploader";
import MediaPreviewList from "./MediaPreviewList";
import FormInput from "./FormInput.jsx";

const INITIAL = {
    title: "",
    content: "",
    type: "",
    coverImage: "",
};

const validate = (fields) => {
    const errors = {};

    if (!fields.title.trim())
        errors.title = "Վերնագիրը պարտադիր է։";

    if (fields.title.trim().length > 255)
        errors.title = "Վերնագիրը չի կարող գերազանցել 255 նիշը։";

    if (!fields.type)
        errors.type = "Խնդրում ենք ընտրել գրառման տեսակը։";

    if (fields.coverImage && !/^https?:\/\/.+/.test(fields.coverImage.trim()))
        errors.coverImage = "Կեղծապատկերի հղումը պետք է լինի վավեր URL։";

    return errors;
};

const PostForm = ({ onSubmit, isSubmitting, submitError }) => {
    const [fields,     setFields]     = useState(INITIAL);
    const [touched,    setTouched]    = useState({});
    const [mediaItems, setMediaItems] = useState([]);
    const [errors,     setErrors]     = useState({});
    const [uploading,  setUploading]  = useState(false); // ← upload progress

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setErrors(validate({ ...fields, [name]: value }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors(validate(fields));
    };

    const handleTypeChange = (val) => {
        setFields((prev) => ({ ...prev, type: val }));
        setTouched((prev) => ({ ...prev, type: true }));
        setErrors(validate({ ...fields, type: val }));
    };

    // ── Upload helper ──────────────────────────────────────────
    const uploadFile = async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await api.post("/upload/posts", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setTouched({ title: true, type: true, coverImage: true });
        const errs = validate(fields);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        try {
            setUploading(true);

            // Upload բոլոր ֆայլերը հերթով
            const uploadedMedia = await Promise.all(
                mediaItems.map(async (m, i) => {
                    const url = await uploadFile(m.file);
                    return { url, type: m.type, order: i };
                })
            );

            onSubmit({
                title:      fields.title.trim(),
                content:    fields.content.trim() || null,
                type:       fields.type,
                coverImage: fields.coverImage.trim() || null,
                media:      uploadedMedia,
            });
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const isBusy      = isSubmitting || uploading;
    const firstMedia  = mediaItems.find((m) => m.type === "image");

    return (
        <form className="post-form" onSubmit={handleSubmit} noValidate>
            {submitError && (
                <div className="form-banner form-banner--error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8"  x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {submitError}
                </div>
            )}

            <div className="post-form__grid">
                {/* ── Left column ── */}
                <div className="post-form__main">
                    <FormInput
                        label="Վերնագիր"
                        name="title"
                        value={fields.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="օր. Տարվա ավարտի մրցանակաբաշխություն 2025"
                        error={touched.title ? errors.title : ""}
                        required
                    />

                    <div className="form-group">
                        <label className="form-label">Բովանդակություն</label>
                        <textarea
                            name="content"
                            value={fields.content}
                            onChange={handleChange}
                            placeholder="Գրեք գրառման բովանդակությունը այստեղ…"
                            className="form-textarea"
                            rows={7}
                        />
                    </div>

                    <TypeSelector
                        value={fields.type}
                        onChange={handleTypeChange}
                        error={touched.type ? errors.type : ""}
                    />
                </div>

                <div className="post-form__sidebar">
                    <div className="sidebar-card">
                        <h3 className="sidebar-card__title">Կեղծապատկեր</h3>

                        <FormInput
                            label="URL"
                            name="coverImage"
                            value={fields.coverImage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="https://cdn.example.com/cover.jpg"
                            error={touched.coverImage ? errors.coverImage : ""}
                        />
                        {(fields.coverImage || firstMedia) && (
                            <div className="cover-preview">
                                <img
                                    src={fields.coverImage || firstMedia?.previewUrl}
                                    alt="Cover preview"
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                                {!fields.coverImage && (
                                    <p className="cover-preview__label">Ավտոմատ ընտրված մեդիայից</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="sidebar-card">
                        <h3 className="sidebar-card__title">Հրապարակում</h3>
                        <button
                            type="submit"
                            className="btn btn--primary btn--full"
                            disabled={isBusy}
                        >
                            {uploading ? (
                                <><span className="spinner spinner--sm"/> Բեռնվում է…</>
                            ) : isSubmitting ? (
                                <><span className="spinner spinner--sm"/> Հրապարակվում է…</>
                            ) : (
                                "Հրապարակել գրառումը"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="post-form__media">
                <div className="section-divider">
                    <span>Մեդիա կցումներ</span>
                </div>
                <MediaUploader items={mediaItems} onChange={setMediaItems} />
                <MediaPreviewList items={mediaItems} onChange={setMediaItems} />
            </div>
        </form>
    );
};

export default PostForm;