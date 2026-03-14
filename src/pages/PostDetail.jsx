import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import MediaSlider from "../components/MediaSlider.jsx";

const TYPE_LABELS = {
    news:          "Նորություն",
    events:        "Միջոցառում",
    announcements: "Հայտարարություն",
};

const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("hy-AM", {
        day: "numeric", month: "long", year: "numeric",
    });
};

const DetailSkeleton = () => (
    <div className="post-detail post-detail--skeleton">
        <div className="post-detail__media">
            <div className="skel-block" style={{ aspectRatio: "16/9", borderRadius: 12 }} />
        </div>
        <div className="post-detail__content">
            <div className="skel-line skel-line--sm" style={{ width: "15%" }} />
            <div className="skel-line skel-line--lg" style={{ height: 32, marginTop: 8 }} />
            <div className="skel-line skel-line--md" style={{ marginTop: 4 }} />
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="skel-line skel-line--lg" />
                <div className="skel-line skel-line--lg" />
                <div className="skel-line skel-line--md" />
                <div className="skel-line skel-line--lg" />
                <div className="skel-line skel-line--sm" />
            </div>
        </div>
    </div>
);

const PostDetail = () => {
    const { id } = useParams();
    const navigate= useNavigate();
    const [post,    setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        api.get(`/posts/${id}`)
            .then(({ data }) => setPost(data.data ?? data))
            .catch((err) => {
                const status = err?.response?.status;
                setError(status === 404
                    ? "Հրապարակումը չի գտնվել"
                    : "Սխալ է տեղի ունեցել"
                );
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="pub-posts">
            <div className="container">
                <div className="post-detail__back-row">
                    <div className="skel-line" style={{ width: 80, height: 14 }} />
                </div>
                <DetailSkeleton />
            </div>
        </div>
    );

    if (error) return (
        <div className="pub-posts">
            <div className="container">
                <div className="post-detail__not-found">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1" opacity="0.25">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="9" y1="13" x2="15" y2="13"/>
                    </svg>
                    <p className="post-detail__not-found-text">{error}</p>
                    <Link to="/posts" className="pd-back-btn">
                        ← Վերադառնալ
                    </Link>
                </div>
            </div>
        </div>
    );

    const hasMedia = post.media && post.media.length > 0;

    return (
        <div className="pub-posts">
            <div className="container">

                <div className="post-detail__back-row">
                    <button className="pd-back-btn" onClick={() => navigate(-1)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <polyline points="15,18 9,12 15,6"/>
                        </svg>
                        Վերադառնալ
                    </button>
                </div>

                <article className="post-detail">

                    {(hasMedia || post.coverImage) && (
                        <div className="post-detail__media">
                            <MediaSlider items={post.media || []} cover={post.coverImage} />
                        </div>
                    )}

                    <div className="post-detail__content">

                        <div className="post-detail__meta">
                            <span className={`pd-type-badge pd-type-badge--${post.type}`}>
                                {TYPE_LABELS[post.type] || post.type}
                            </span>
                            <time className="pd-date">{formatDate(post.createdAt)}</time>
                            {hasMedia && (
                                <span className="pd-media-count">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21,15 16,10 5,21"/>
                                    </svg>
                                    {post.media.length} նկար
                                </span>
                            )}
                        </div>

                        <h1 className="post-detail__title">{post.title}</h1>

                        <div className="post-detail__divider" />

                        {post.content ? (
                            <div className="post-detail__body">
                                {post.content.split("\n").filter(Boolean).map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        ) : (
                            <p className="post-detail__empty-content">
                                Բովանդակություն չի ավելացվել
                            </p>
                        )}
                    </div>

                </article>

                <div className="post-detail__footer-nav">
                    <Link to="/posts" className="pd-back-btn">
                        ← Բոլոր հրապարակումները
                    </Link>
                    <Link
                        to={`/posts?type=${post.type}`}
                        className="pd-type-link"
                    >
                        Ավելի {TYPE_LABELS[post.type]?.toLowerCase()} →
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default PostDetail;