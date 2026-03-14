import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios.js";
import TypeSelector from "../components/TypeSelector.jsx";
import MediaUploader from "../components/MediaUploader";
import MediaPreviewList from "../components/MediaPreviewList";
import FormInput from "../components/FormInput.jsx";

const validate = (fields) => {
    const errors = {};
    if (!fields.title.trim())             errors.title = "Վերնագիրը պարտադիր է";
    if (fields.title.trim().length > 255) errors.title = "Վերնագիրը չի կարող գերազանցել 255 նիշը";
    if (!fields.type)                     errors.type  = "Տեսակը պարտադիր է";
    if (fields.coverImage && !/^https?:\/\/.+/.test(fields.coverImage.trim()))
        errors.coverImage = "Cover image-ը պետք է լինի վավեր URL";
    return errors;
};

const EditPostPage = () => {
    const { id }   = useParams();
    const navigate = useNavigate();

    const [fields,      setFields]      = useState({ title: "", content: "", type: "", coverImage: "" });
    const [touched,     setTouched]     = useState({});
    const [errors,      setErrors]      = useState({});
    const [mediaItems,  setMediaItems]  = useState([]);
    const [fetching,    setFetching]    = useState(true);
    const [fetchError,  setFetchError]  = useState(null);
    const [uploading,   setUploading]   = useState(false);
    const [submitting,  setSubmitting]  = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // ── Load post ──────────────────────────────────────────────
    useEffect(() => {
        setFetching(true);
        api.get(`/posts/${id}`)
            .then(({ data }) => {
                const post = data.data ?? data;
                setFields({
                    title:      post.title      || "",
                    content:    post.content    || "",
                    type:       post.type       || "",
                    coverImage: post.coverImage || "",
                });
                if (post.media?.length > 0) {
                    setMediaItems(post.media.map((m) => ({
                        id:         m.id,
                        previewUrl: m.url,
                        type:       m.type,
                        name:       m.url.split("/").pop(),
                        file:       null,
                        existing:   true,
                    })));
                }
            })
            .catch(() => {
                setFetchError("Հրապարակումը չի գտնվել");
                toast.error("❌ Հրապարակումը չի գտնվել");
            })
            .finally(() => setFetching(false));
    }, [id]);

    // ── Handlers ───────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((p) => ({ ...p, [name]: value }));
        if (touched[name]) setErrors(validate({ ...fields, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((p) => ({ ...p, [name]: true }));
        setErrors(validate(fields));
    };

    const handleTypeChange = (val) => {
        setFields((p) => ({ ...p, type: val }));
        setTouched((p) => ({ ...p, type: true }));
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

    // ── Submit ─────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ title: true, type: true, coverImage: true });
        const errs = validate(fields);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        try {
            setUploading(true);
            setSubmitError(null);

            const uploadedMedia = await Promise.all(
                mediaItems.map(async (m, i) => {
                    if (m.file) {
                        const url = await uploadFile(m.file);
                        return { url, type: m.type, order: i };
                    }
                    return { url: m.previewUrl, type: m.type, order: i };
                })
            );

            setUploading(false);
            setSubmitting(true);

            await api.put(`/posts/${id}`, {
                title:       fields.title.trim(),
                content:     fields.content.trim() || null,
                type:        fields.type,
                coverImage:  fields.coverImage.trim() || null,
                media:       uploadedMedia,
                mediaAction: "replace",
            });

            toast.success("✅ Հրապարակումը հաջողությամբ թարմացվեց");
            navigate("/admin/posts");

        } catch (err) {
            const msg = err?.response?.data?.message || "Սխալ է տեղի ունեցել";
            setSubmitError(msg);
            toast.error(`❌ ${msg}`);
        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };

    const isBusy     = uploading || submitting;
    const firstMedia = mediaItems.find((m) => m.type === "image");

    if (fetching) return (
        <div className="page">
            <div className="loader"><span className="spinner"/> Բեռնվում է…</div>
        </div>
    );

    if (fetchError) return (
        <div className="page">
            <div className="alert alert--error">{fetchError}</div>
            <Link to="/admin/posts" className="back-link">← Վերադառնալ</Link>
        </div>
    );

    return (
        <div className="page">
            <div className="page-header">
                <div className="page-header__left">
                    <Link to="/admin/posts" className="back-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="15,18 9,12 15,6"/>
                        </svg>
                        Վերադառնալ
                    </Link>
                    <h1 className="page-title">Խմբագրել հրապարակումը</h1>
                </div>
            </div>

            <form className="post-form" onSubmit={handleSubmit} noValidate>
                {submitError && (
                    <div className="form-banner form-banner--error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {submitError}
                    </div>
                )}

                <div className="post-form__grid">
                    <div className="post-form__main">
                        <FormInput
                            label="Վերնագիր"
                            name="title"
                            value={fields.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Հրապարակման վերնագիրը"
                            error={touched.title ? errors.title : ""}
                            required
                        />
                        <div className="form-group">
                            <label className="form-label">Բովանդակություն</label>
                            <textarea
                                name="content"
                                value={fields.content}
                                onChange={handleChange}
                                placeholder="Գրեք հրապարակման բովանդակությունը…"
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
                            <h3 className="sidebar-card__title">Cover Image</h3>
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
                                        <p className="cover-preview__label">Auto-selected from media</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="sidebar-card">
                            <h3 className="sidebar-card__title">Պահպանել</h3>
                            <button
                                type="submit"
                                className="btn btn--primary btn--full"
                                disabled={isBusy}
                            >
                                {uploading  ? <><span className="spinner spinner--sm"/> Uploading…</>   :
                                    submitting ? <><span className="spinner spinner--sm"/> Պահպանվում է…</> :
                                        "Պահպանել փոփոխությունները"}
                            </button>
                            <Link
                                to="/admin/posts"
                                className="btn btn--ghost btn--full"
                                style={{ textAlign: "center", marginTop: 8 }}
                            >
                                Չեղարկել
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="post-form__media">
                    <div className="section-divider"><span>Մեդիա ֆայլեր</span></div>
                    <MediaUploader items={mediaItems} onChange={setMediaItems} />
                    <MediaPreviewList items={mediaItems} onChange={setMediaItems} />
                </div>
            </form>
        </div>
    );
};

export default EditPostPage;