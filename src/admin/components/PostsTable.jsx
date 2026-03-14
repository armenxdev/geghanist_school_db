import React from "react";
import { Link } from "react-router-dom";

const TYPE_COLORS = {
    news:          "badge--blue",
    events:        "badge--green",
    announcements: "badge--amber",
};

const TYPE_LABELS = {
    news:          "Նորություն",
    events:        "Միջոցառում",
    announcements: "Հայտարարություն",
};

const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("hy-AM", {
        day: "2-digit", month: "short", year: "numeric",
    });
};

const MobilePostCard = ({ post, deletingId, onDelete }) => (
    <div className={`post-mobile-card ${deletingId === post.id ? "post-mobile-card--deleting" : ""}`}>
        <div className="post-mobile-card__top">
            {post.coverImage ? (
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="post-mobile-card__thumb"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
            ) : (
                <div className="post-mobile-card__no-thumb">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                    </svg>
                </div>
            )}

            <div className="post-mobile-card__info">
                <span className={`badge ${TYPE_COLORS[post.type] || "badge--default"}`}>
                    {TYPE_LABELS[post.type] || post.type}
                </span>
                <h3 className="post-mobile-card__title">{post.title}</h3>
                <span className="post-mobile-card__date">{formatDate(post.createdAt)}</span>
            </div>
        </div>

        {post.content && (
            <p className="post-mobile-card__excerpt">
                {post.content.slice(0, 100)}{post.content.length > 100 ? "…" : ""}
            </p>
        )}

        <div className="post-mobile-card__actions">
            {post.media?.length > 0 && (
                <span className="media-count">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                    </svg>
                    {post.media.length}
                </span>
            )}
            <div className="post-mobile-card__btns">
                <Link
                    to={`/admin/posts/${post.id}/edit`}
                    className="btn btn--ghost btn--sm"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Խմբ.
                </Link>
                <button
                    className="btn btn--danger btn--sm"
                    onClick={() => onDelete(post)}
                    disabled={deletingId === post.id}
                >
                    {deletingId === post.id
                        ? <span className="spinner spinner--sm"/>
                        : <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
                                <path d="M10,11v6M14,11v6"/>
                                <path d="M9,6V4h6v2"/>
                            </svg>
                            Ջնջ.
                        </>
                    }
                </button>
            </div>
        </div>
    </div>
);

const PostTable = ({ posts, deletingId, onDelete }) => {
    if (!posts || posts.length === 0) return null;

    return (
        <>
            <div className="table-wrapper table-wrapper--desktop">
                <table className="post-table">
                    <thead>
                    <tr>
                        <th className="post-table__cover-col">Նկար</th>
                        <th>Վերնագիր</th>
                        <th>Տեսակ</th>
                        <th>Մեդիա</th>
                        <th>Ամսաթիվ</th>
                        <th className="post-table__actions-col">Գործ.</th>
                    </tr>
                    </thead>
                    <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}
                            className={`post-row ${deletingId === post.id ? "post-row--deleting" : ""}`}>

                            {/* Cover */}
                            <td className="post-row__cover">
                                {post.coverImage ? (
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="post-row__thumb"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="post-row__no-cover">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21,15 16,10 5,21"/>
                                        </svg>
                                    </div>
                                )}
                            </td>

                            <td className="post-row__title">
                                <span className="post-row__title-text">{post.title}</span>
                                {post.content && (
                                    <span className="post-row__excerpt">
                                        {post.content.slice(0, 72)}{post.content.length > 72 ? "…" : ""}
                                    </span>
                                )}
                            </td>

                            <td>
                                <span className={`badge ${TYPE_COLORS[post.type] || "badge--default"}`}>
                                    {TYPE_LABELS[post.type] || post.type}
                                </span>
                            </td>

                            <td className="post-row__media-count">
                                {post.media?.length > 0 ? (
                                    <span className="media-count">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21,15 16,10 5,21"/>
                                        </svg>
                                        {post.media.length}
                                    </span>
                                ) : (
                                    <span className="media-count media-count--none">—</span>
                                )}
                            </td>

                            <td className="post-row__date">{formatDate(post.createdAt)}</td>

                            <td className="post-row__actions">
                                <div className="post-row__action-group">
                                    <Link
                                        to={`/admin/posts/${post.id}/edit`}
                                        className="action-btn action-btn--edit"
                                        title="Խմբագրել"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                        Խմբ.
                                    </Link>
                                    <button
                                        className="action-btn action-btn--delete"
                                        onClick={() => onDelete(post)}
                                        disabled={deletingId === post.id}
                                        title="Ջնջել"
                                    >
                                        {deletingId === post.id ? (
                                            <span className="spinner spinner--sm"/>
                                        ) : (
                                            <>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <polyline points="3,6 5,6 21,6"/>
                                                    <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
                                                    <path d="M10,11v6M14,11v6"/>
                                                    <path d="M9,6V4h6v2"/>
                                                </svg>
                                                Ջնջ.
                                            </>
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="post-mobile-list">
                {posts.map((post) => (
                    <MobilePostCard
                        key={post.id}
                        post={post}
                        deletingId={deletingId}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </>
    );
};

export default PostTable;