import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import MediaSlider from "../components/MediaSlider.jsx";

const TYPE_LABELS = {
    news:          "Նորություն",
    events:        "Միջոցառում",
    announcements: "Հայտարարություն",
};

const TYPE_FILTERS = [
    { value: "",              label: "Բոլորը" },
    { value: "news",          label: "Նորություններ" },
    { value: "events",        label: "Միջոցառումներ" },
    { value: "announcements", label: "Հայտարարություններ" },
];

const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("hy-AM", {
        day: "numeric", month: "long", year: "numeric",
    });
};


const PublicPostCard = ({ post }) => (
    <article className="pub-card">
        <div className="pub-card__media">
            <MediaSlider items={post.media || []} cover={post.coverImage} />
            <span className={`pub-card__type pub-card__type--${post.type}`}>
                {TYPE_LABELS[post.type] || post.type}
            </span>
        </div>

        <Link to={`/posts/${post.id}`} className="pub-card__body pub-card__body--link">
            <time className="pub-card__date">{formatDate(post.createdAt)}</time>
            <h3 className="pub-card__title">{post.title}</h3>
            {post.content && (
                <p className="pub-card__excerpt">
                    {post.content.length > 160
                        ? post.content.slice(0, 160) + "…"
                        : post.content}
                </p>
            )}
            <span className="pub-card__read-more">
                Կարդալ ավելին →
            </span>
        </Link>
    </article>
);


const PostSkeleton = () => (
    <div className="pub-card pub-card--skeleton">
        <div className="pub-card__media skel-block" style={{ aspectRatio: "16/9" }} />
        <div className="pub-card__body">
            <div className="skel-line skel-line--sm" />
            <div className="skel-line skel-line--lg" />
            <div className="skel-line skel-line--md" />
        </div>
    </div>
);


const Posts = () => {
    const [posts,   setPosts]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [type,    setType]    = useState("");
    const [page,    setPage]    = useState(1);
    const [meta,    setMeta]    = useState({ total: 0, totalPages: 1 });

    const LIMIT = 9;

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        const params = { page, limit: LIMIT };
        if (type) params.type = type;

        api.get("/posts", { params })
            .then(({ data }) => {
                if (cancelled) return;
                setPosts(data.data || []);
                setMeta(data.meta || { total: 0, totalPages: 1 });
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err?.response?.data?.message || "Սխալ է տեղի ունեցել");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [type, page]);


    const handleTypeChange = (val) => {
        setType(val);
        setPage(1);
    };

    return (
        <div className="pub-posts">
            {/* ── Header ── */}
            <div className="pub-posts__hero">
                <div className="container">
                    <h1 className="pub-posts__hero-title">Հրապարակումներ</h1>
                    <p className="pub-posts__hero-sub">
                        Դպրոցի կյանքի նորություններ, հայտարարություններ և միջոցառումներ
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="pub-filters">
                    {TYPE_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            className={`pub-filter ${type === f.value ? "pub-filter--active" : ""}`}
                            onClick={() => handleTypeChange(f.value)}
                        >
                            {f.label}
                            {!loading && type === f.value && meta.total > 0 && (
                                <span className="pub-filter__count">{meta.total}</span>
                            )}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="pub-error">
                        <p>{error}</p>
                        <button
                            className="btn btn--ghost btn--sm"
                            onClick={() => { setPage(1); setType(""); }}
                        >
                            Նորից փորձել
                        </button>
                    </div>
                )}


                <div className="pub-grid">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)
                        : posts.map((post) => <PublicPostCard key={post.id} post={post} />)
                    }
                </div>

                {!loading && !error && posts.length === 0 && (
                    <div className="pub-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="1" opacity="0.3">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                        </svg>
                        <p>Հրապարակումներ չկան</p>
                    </div>
                )}


                {!loading && meta.totalPages > 1 && (
                    <div className="pub-pagination">
                        <button
                            className="pub-page-btn"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            ← Նախորդ
                        </button>

                        <div className="pub-page-nums">
                            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === meta.totalPages ||
                                    Math.abs(p - page) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === "…"
                                        ? <span key={`ellipsis-${i}`} className="pub-page-ellipsis">…</span>
                                        : <button
                                            key={p}
                                            className={`pub-page-num ${p === page ? "pub-page-num--active" : ""}`}
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </button>
                                )}
                        </div>

                        <button
                            className="pub-page-btn"
                            disabled={page >= meta.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Հաջորդ →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Posts;