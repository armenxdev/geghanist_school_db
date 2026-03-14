import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchReports,
    setSearch,
    selectReports,
    selectTotal,
    selectHasMore,
    selectPage,
    selectSearch,
    selectOrderBy,
    selectFetchLoading,
} from '../store/reducers/documentsSlice.js';


// ── Icons ──────────────────────────────────────────────────
const IconSearch = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);

const IconPDF = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="12" y2="17"/>
    </svg>
);

const IconArrow = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
    </svg>
);

const IconEmpty = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/>
        <line x1="9"  y1="15" x2="15" y2="15"/>
    </svg>
);

const IconReport = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="15" y2="17"/>
    </svg>
);

const IconFolder = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
);

const IconAll = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
    </svg>
);

// ── Helpers ────────────────────────────────────────────────
const formatDate = (r) => {
    const raw = r.createdAt || r.created_at;
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('hy-AM', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
};

const getFileExt = (filePath) => {
    if (!filePath) return 'FILE';
    const ext = filePath.split('.').pop();
    return ext ? ext.toUpperCase() : 'FILE';
};

// ── Filter tabs config ─────────────────────────────────────
const TABS = [
    { key: '',         label: 'Բոլորը',            icon: <IconAll /> },
    { key: 'report',   label: 'Հաշվետվություններ', icon: <IconReport /> },
    { key: 'document', label: 'Այլ փաստաթղթեր',   icon: <IconFolder /> },
];

// ── Skeleton card ──────────────────────────────────────────
const SkeletonCard = ({ delay = 0 }) => (
    <div className="report-card report-card--skeleton" style={{ animationDelay: `${delay}s` }}>
        <div className="skeleton-line skeleton-line--icon" />
        <div className="report-card__body">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--title-sm" />
            <div className="skeleton-line skeleton-line--date" />
        </div>
        <div className="report-card__footer">
            <div className="skeleton-line skeleton-line--foot" />
        </div>
    </div>
);

// ═══════════════════════════════════════════
//  PUBLIC REPORTS COMPONENT
// ═══════════════════════════════════════════
const AdminDocuments = () => {
    const dispatch = useDispatch();

    const reports      = useSelector(selectReports);
    const total        = useSelector(selectTotal);
    const hasMore      = useSelector(selectHasMore);
    const page         = useSelector(selectPage);
    const search       = useSelector(selectSearch);
    const orderBy      = useSelector(selectOrderBy);
    const fetchLoading = useSelector(selectFetchLoading);

    const [searchInput, setSearchInput] = useState(search);
    const [activeTab,   setActiveTab]   = useState('');

    // ── Initial + dependency fetch ──
    useEffect(() => {
        dispatch(fetchReports({ page: 1, search, orderBy, type: activeTab }));
    }, [search, orderBy, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Debounce search ──
    useEffect(() => {
        const t = setTimeout(() => dispatch(setSearch(searchInput)), 400);
        return () => clearTimeout(t);
    }, [searchInput, dispatch]);

    const handleTabChange = (key) => {
        if (key === activeTab) return;
        setActiveTab(key);
    };

    const handleLoadMore = () =>
        dispatch(fetchReports({ page: page + 1, search, orderBy, type: activeTab }));

    const handleOpen = (filePath) => {
        if (!filePath) return;
        window.open(`/uploads/documents/${filePath}`, '_blank', 'noopener,noreferrer');
    };

    // ─────────────────── RENDER ───────────────────
    return (
        <section className="reports-public">
            <div className="container">

                {/* ── HEADER ── */}
                <div className="reports-public__header">
                    <h1 className="reports-public__title">Փաստաթղթեր</h1>
                    <p className="reports-public__desc">
                        Բացելու համար սեղմեք ֆայլի վրա
                    </p>
                </div>

                {/* ── TYPE TABS ── */}
                <div className="reports-public__tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            className={`reports-public__tab${activeTab === tab.key ? ' reports-public__tab--active' : ''}`}
                            onClick={() => handleTabChange(tab.key)}
                            type="button"
                        >
                            <span className="reports-public__tab-icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── FILTERS ── */}
                <div className="reports-public__filters">
                    <div className="reports-public__search">
                        <span className="reports-public__search-icon">
                            <IconSearch />
                        </span>
                        <input
                            className="reports-public__search-input"
                            placeholder="Որոնել հաշվետվություն…"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    {!fetchLoading && total > 0 && (
                        <span className="reports-public__count">
                            <strong>{total}</strong> Վերնագիր
                        </span>
                    )}
                </div>

                {/* ── GRID ── */}
                <div className="reports-public__grid">

                    {/* Skeleton rows while first loading */}
                    {fetchLoading && reports.length === 0 &&
                        Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} delay={i * 0.05} />
                        ))
                    }

                    {/* Empty state */}
                    {!fetchLoading && reports.length === 0 && (
                        <div className="reports-public__empty">
                            <div className="reports-public__empty-icon">
                                <IconEmpty />
                            </div>
                            <p>Հաշվետվություն չի գտնվել</p>
                        </div>
                    )}

                    {/* Cards */}
                    {reports.map((r, idx) => (
                        <div
                            key={r.id}
                            className="report-card"
                            role="button"
                            tabIndex={0}
                            style={{ animationDelay: `${idx * 0.04}s` }}
                            onClick={() => handleOpen(r.filePath)}
                            onKeyDown={(e) => e.key === 'Enter' && handleOpen(r.filePath)}
                        >
                            {/* Icon */}
                            <div className="report-card__icon">
                                <IconPDF />
                            </div>

                            {/* Body */}
                            <div className="report-card__body">
                                <p className="report-card__title">{r.title}</p>
                                {formatDate(r) && (
                                    <span className="report-card__date">
                                        {formatDate(r)}
                                    </span>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="report-card__footer">
                                <span className="report-card__type">
                                    <IconPDF />
                                    {getFileExt(r.filePath)}
                                </span>
                                <span className="report-card__open">
                                    Բացել <IconArrow />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── LOAD MORE ── */}
                {hasMore && !fetchLoading && (
                    <div className="reports-public__load-more">
                        <button
                            className="btn-load-more"
                            onClick={handleLoadMore}
                            disabled={fetchLoading}
                        >
                            Ավելի Շատ {total - reports.length} մնաց
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default AdminDocuments;