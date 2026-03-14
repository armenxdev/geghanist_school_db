import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchPosts,
    deletePost,
    selectAllPosts,
    selectPostsLoading,
    selectPostsError,
    selectDeleting,
} from "../../store/reducers/postSlice.js";
import ConfirmDelete from "../../components/ui/ConfirmDelete.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Loader from "../../components/ui/Loader.jsx";
import PostTable from "../components/PostsTable.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TYPE_FILTERS = [
    { value: "",              label: "Բոլորը" },
    { value: "news",          label: "Նորություններ" },
    { value: "events",        label: "Միջոցառումներ" },
    { value: "announcements", label: "Հայտարարություններ" },
];

const AdminPostsPage = () => {
    const dispatch   = useDispatch();
    const posts      = useSelector(selectAllPosts);
    const loading    = useSelector(selectPostsLoading);
    const error      = useSelector(selectPostsError);
    const deletingId = useSelector(selectDeleting);

    const [typeFilter,    setTypeFilter]    = useState("");
    const [pendingDelete, setPendingDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchPosts(typeFilter ? { type: typeFilter } : {}));
    }, [dispatch, typeFilter]);

    const filteredPosts = useMemo(() => {
        if (!typeFilter) return posts;
        return posts.filter((p) => p.type === typeFilter);
    }, [posts, typeFilter]);

    const handleDeleteConfirm = async () => {
        if (!pendingDelete) return;
        await dispatch(deletePost(pendingDelete.id));
        setPendingDelete(null);
    };

    return (
        <div className="page">
            {/* ── Header ── */}
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop/>

            <div className="page-header">
                <div className="page-header__left">
                    <h1 className="page-title">Հրապարակումներ</h1>
                    {!loading && (
                        <span className="page-count">{filteredPosts.length}</span>
                    )}
                </div>
                <Link to="/admin/posts/new" className="btn btn--primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5"  y1="12" x2="19" y2="12"/>
                    </svg>
                    Նոր հրապարակում
                </Link>
            </div>

            {/* ── Filter tabs ── */}
            <div className="filter-tabs" role="tablist">
                {TYPE_FILTERS.map((f) => (
                    <button
                        key={f.value}
                        role="tab"
                        aria-selected={typeFilter === f.value}
                        className={`filter-tab ${typeFilter === f.value ? "filter-tab--active" : ""}`}
                        onClick={() => setTypeFilter(f.value)}
                    >
                        {f.label}
                        {!loading && typeFilter === f.value && filteredPosts.length > 0 && (
                            <span className="filter-tab__count">{filteredPosts.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── States ── */}
            {loading && <Loader message="Բեռնվում է…" />}

            {!loading && error && (
                <div className="alert alert--error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                    <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => dispatch(fetchPosts(typeFilter ? { type: typeFilter } : {}))}
                    >
                        Նորից փորձել
                    </button>
                </div>
            )}

            {!loading && !error && filteredPosts.length === 0 && (
                <EmptyState
                    message={typeFilter ? `${typeFilter} հրապարակումներ չկան` : "Հրապարակումներ չկան"}
                    icon={
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="1.2" opacity="0.3">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                        </svg>
                    }
                />
            )}

            {!loading && !error && filteredPosts.length > 0 && (
                <PostTable
                    posts={filteredPosts}
                    deletingId={deletingId}
                    onDelete={(post) => setPendingDelete(post)}
                />
            )}

            <ConfirmDelete
                isOpen={!!pendingDelete}
                onClose={() => setPendingDelete(null)}
                onConfirm={handleDeleteConfirm}
                itemName={pendingDelete?.title}
                isLoading={deletingId === pendingDelete?.id}
            />
        </div>
    );
};

export default AdminPostsPage;