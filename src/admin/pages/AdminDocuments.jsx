import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchReports,
    createReport,
    deleteReport,
    setSearch,
    setOrderBy,
    resetCreateSuccess,
    selectReports,
    selectTotal,
    selectHasMore,
    selectPage,
    selectSearch,
    selectOrderBy,
    selectFetchLoading,
    selectCreateLoading,
    selectDeleteLoading,
    selectCreateSuccess,
    selectReportError,
} from '../../store/reducers/documentsSlice.js';
import Modal from '../../components/Modal.jsx';
import DeleteConfirm from '../../components/DeleteConfirm.jsx';
import {ToastContainer} from "react-toastify";


// ── Constants ──────────────────────────────────────────────
const ORDER_OPTIONS = [
    { value: '',               label: 'Sort: Default' },
    { value: 'createdAt:DESC', label: 'Newest first'  },
    { value: 'createdAt:ASC',  label: 'Oldest first'  },
    { value: 'title:ASC',      label: 'Title A → Z'  },
    { value: 'title:DESC',     label: 'Title Z → A'  },
];

// ── Icons ──────────────────────────────────────────────────
const IconPlus = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5"  y1="12" x2="19" y2="12"/>
    </svg>
);
const IconSearch = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);
const IconFile = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
    </svg>
);
const IconUpload = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16"/>
        <line x1="12" y1="12" x2="12" y2="21"/>
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
);
const IconTrash = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4h6v2"/>
    </svg>
);
const IconClose = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6"  x2="6"  y2="18"/>
        <line x1="6"  y1="6"  x2="18" y2="18"/>
    </svg>
);
const IconEmpty = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/>
        <line x1="9"  y1="15" x2="15" y2="15"/>
    </svg>
);

const Spinner = () => (
    <span style={{
        display: 'inline-block',
        width: 14, height: 14,
        border: '2px solid #e2e8f0',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin .7s linear infinite',
        flexShrink: 0,
    }} />
);

// ── Date formatter ─────────────────────────────────────────
const formatDate = (r) => {
    const raw = r.createdAt || r.created_at;
    if (!raw) return '—';
    return new Date(raw).toLocaleDateString('hy-AM', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
};

const AdminDocuments = () => {
    const dispatch = useDispatch();

    // ── Redux state ──
    const reports       = useSelector(selectReports);
    const total         = useSelector(selectTotal);
    const hasMore       = useSelector(selectHasMore);
    const page          = useSelector(selectPage);
    const search        = useSelector(selectSearch);
    const orderBy       = useSelector(selectOrderBy);
    const fetchLoading  = useSelector(selectFetchLoading);
    const createLoading = useSelector(selectCreateLoading);
    const deleteLoading = useSelector(selectDeleteLoading);
    const createSuccess = useSelector(selectCreateSuccess);
    const reportError   = useSelector(selectReportError);

    // ── Local UI state ──
    const [searchInput, setSearchInput]   = useState(search);
    const [addOpen, setAddOpen]           = useState(false);
    const [documentType, setDocumentType] = useState(null);
    const [titleInput, setTitleInput]     = useState('');
    const [file, setFile]                 = useState(null);
    const [dragOver, setDragOver]         = useState(false);
    const [localErr, setLocalErr]         = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const fileRef = useRef(null);

    // ── Fetch on search / order change ──
    useEffect(() => {
        dispatch(fetchReports({ page: 1, search, orderBy }));
    }, [search, orderBy]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Debounce search input ──
    useEffect(() => {
        const t = setTimeout(() => dispatch(setSearch(searchInput)), 420);
        return () => clearTimeout(t);
    }, [searchInput, dispatch]);

    // ── After create success ──
    useEffect(() => {
        if (createSuccess) {
            closeAdd();
            dispatch(resetCreateSuccess());
            dispatch(fetchReports({ page: 1, search, orderBy }));
        }
    }, [createSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Handlers ──
    const handleOrderChange = useCallback(
        (e) => dispatch(setOrderBy(e.target.value)),
        [dispatch]
    );

    const handleLoadMore = () =>
        dispatch(fetchReports({ page: page + 1, search, orderBy }));

    const handleFileChange = (f) => {
        if (!f) return;
        setFile(f);
        setLocalErr('');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileChange(e.dataTransfer.files[0]);
    };

    const handleAdd = () => {
        if (!titleInput.trim()) return setLocalErr('Title-ը պարտադիր է');
        if (!file)              return setLocalErr('Ֆայլը պարտադիր է');

        dispatch(createReport({
            title: titleInput,
            file,
            type: documentType,
        }));
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        dispatch(deleteReport(deleteTarget.id));
        setDeleteTarget(null);
    };

    const closeAdd = () => {
        setAddOpen(false);
        setTitleInput('');
        setFile(null);
        setLocalErr('');
    };

    const fileZoneClass = [
        'file-zone',
        dragOver ? 'file-zone--drag'   : '',
        file     ? 'file-zone--filled' : '',
    ].filter(Boolean).join(' ');

    // ─────────────────── RENDER ───────────────────
    return (
        <div className="reports-page">
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop/>
            {/* ── TOOLBAR ── */}
            <div className="reports-page__toolbar">
                <h1 className="reports-page__title">
                    Ընդհանուր Փաստաթղթեր
                </h1>

                <button
                    className="btn btn--primary"
                    onClick={() => { setDocumentType('document'); setAddOpen(true); }}
                >
                    <IconPlus />
                    Ավելացնել Փաստաթուղթ
                </button>

                <button
                    className="btn btn--primary"
                    onClick={() => { setDocumentType('report'); setAddOpen(true); }}
                >
                    <IconPlus />
                    Ավելացնել Հաշվետվություն
                </button>
            </div>

            {/* ── FILTERS ── */}
            <div className="reports-page__filters">
                <div className="search-box">
                    <span className="search-box__icon"><IconSearch /></span>
                    <input
                        className="search-box__input"
                        placeholder="Որոնել"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                <select
                    className="reports-page__select"
                    value={orderBy}
                    onChange={handleOrderChange}
                >
                    {ORDER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* ── COUNT LINE ── */}
            <p className="reports-page__count">
                Ընդհանուր <strong>{total}</strong> Հաշվետվություն
            </p>

            {/* ── DESKTOP TABLE ── */}
            <div className={`reports-table-wrap${fetchLoading ? ' reports-table-wrap--loading' : ''}`}>
                <table className="reports-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Վերնագիր</th>
                        <th>Ֆայլ</th>
                        <th>Ամսաթիվ</th>
                        <th>Գործողություն</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fetchLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <tr key={i}>
                                {[48, 200, 150, 100, 80].map((w, j) => (
                                    <td key={j} className="reports-table__skeleton">
                                        <div style={{
                                            width: w,
                                            animationDelay: `${i * 0.07 + j * 0.04}s`,
                                        }} />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : reports.length === 0 ? (
                        <tr>
                            <td colSpan={5}>
                                <div className="reports-empty">
                                    <IconEmpty />
                                    <p>Հաշվետվություն չի գտնվել։</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        reports.map((r, idx) => (
                            <tr key={r.id} style={{ animationDelay: `${idx * 0.03}s` }}>
                                <td className="reports-table__num">{r.id}</td>
                                <td>{r.title}</td>
                                <td>
                                    {r.filePath ? (
                                        <a
                                            href={`/uploads/documents/${r.filePath}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="reports-table__file-link"
                                            title={r.filePath}
                                        >
                                            <IconFile />
                                            {r.filePath}
                                        </a>
                                    ) : (
                                        <span className="reports-table__file-empty">—</span>
                                    )}
                                </td>
                                <td className="reports-table__date">
                                    {formatDate(r)}
                                </td>
                                <td>
                                    <button
                                        className="action-btn action-btn--delete"
                                        onClick={() => setDeleteTarget({ id: r.id, title: r.title })}
                                        disabled={deleteLoading}
                                    >
                                        <IconTrash />
                                        Ջնջել
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* ── MOBILE CARDS ── */}
            <div className="reports-cards">
                {reports.map((r) => (
                    <div key={r.id} className="reports-card">
                        <p className="reports-card__title">{r.title}</p>
                        <p className="reports-card__meta">{formatDate(r)}</p>
                        {r.filePath && (
                            <a
                                href={`/uploads/documents/${r.filePath}`}
                                target="_blank"
                                rel="noreferrer"
                                className="reports-card__file"
                            >
                                <IconFile />
                                {r.filePath}
                            </a>
                        )}
                        <div className="reports-card__actions">
                            <button
                                className="action-btn action-btn--delete btn--sm"
                                onClick={() => setDeleteTarget({ id: r.id, title: r.title })}
                                disabled={deleteLoading}
                            >
                                <IconTrash />
                                Ջնջել
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── LOAD MORE ── */}
            {hasMore && !fetchLoading && (
                <div className="reports-load-more">
                    <button
                        className="btn btn--ghost"
                        onClick={handleLoadMore}
                        disabled={fetchLoading}
                    >
                        {fetchLoading
                            ? <><Spinner /> Բեռնվում է…</>
                            : `Ավելի շատ (${total - reports.length} մնաց)`
                        }
                    </button>
                </div>
            )}

            {/* ── ADD MODAL ── */}
            <Modal isOpen={addOpen} onClose={closeAdd} size="md">
                <div className="modal__header">
                    <h2 className="modal__title">
                        {documentType === 'report'
                            ? 'Ավելացնել Հաշվետվություն'
                            : 'Ավելացնել Փաստաթուղթ'}
                    </h2>
                    <button className="modal__close" onClick={closeAdd} aria-label="Close">
                        <IconClose />
                    </button>
                </div>

                <div className="modal__form">
                    <div className="form-field">
                        <label className="form-field__label">
                            Վերնագիր
                            <span className="form-field__required">*</span>
                        </label>
                        <input
                            className={`form-field__input${localErr && !titleInput.trim() ? ' form-field--error' : ''}`}
                            placeholder="Հաշվետվության վերնագիր"
                            value={titleInput}
                            onChange={(e) => {
                                setTitleInput(e.target.value);
                                setLocalErr('');
                            }}
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-field__label">
                            Ֆայլ
                            <span className="form-field__required">*</span>
                        </label>
                        <div
                            className={fileZoneClass}
                            onClick={() => fileRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileChange(e.target.files[0])}
                            />
                            <span className="file-zone__icon"><IconUpload /></span>
                            {file ? (
                                <p className="file-zone__name">
                                    <strong>{file.name}</strong>
                                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                                </p>
                            ) : (
                                <p className="file-zone__hint">
                                    Ձեռքով քաշեք ֆայլը կամ <em>ընտրեք</em>
                                    <small>Առ. 50 MB</small>
                                </p>
                            )}
                        </div>
                    </div>

                    {(localErr || reportError) && (
                        <span className="form-error">{localErr || reportError}</span>
                    )}
                </div>

                <div className="modal__actions">
                    <button className="btn btn--ghost" onClick={closeAdd}>
                        Չեղարկել
                    </button>
                    <button
                        className="btn btn--primary"
                        onClick={handleAdd}
                        disabled={createLoading}
                    >
                        {createLoading ? <><Spinner /> Պահպանում…</> : 'Պահպանել'}
                    </button>
                </div>
            </Modal>

            {/* ── DELETE CONFIRM ── */}
            <DeleteConfirm
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                name={deleteTarget?.title}
            />
        </div>
    );
};

export default AdminDocuments;