import React, { useRef, useState } from "react";

const VideoThumb = ({ src }) => (
    <div className="media-thumb media-thumb--video">
        <video src={src} preload="metadata" muted />
        <div className="media-thumb__play">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
            </svg>
        </div>
    </div>
);

const ImageThumb = ({ src, alt }) => (
    <div className="media-thumb media-thumb--image">
        <img src={src} alt={alt} loading="lazy" />
    </div>
);

const MediaPreviewList = ({ items, onChange }) => {
    const dragIndex = useRef(null);
    const [dragOver, setDragOver] = useState(null);

    if (!items || items.length === 0) return null;

    const handleRemove = (id) => {
        const updated = items.filter((item) => item.id !== id);
        // Revoke old object URL to avoid memory leaks
        const removed = items.find((i) => i.id === id);
        if (removed?.previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(removed.previewUrl);
        }
        onChange(updated);
    };

    // ── Drag-and-drop reorder ─────────────────────────────────────────────────
    const handleDragStart = (e, index) => {
        dragIndex.current = index;
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (index) => {
        if (dragIndex.current === index) return;
        setDragOver(index);
    };

    const handleDragEnd = () => {
        setDragOver(null);
        dragIndex.current = null;
    };

    const handleDropOnItem = (e, dropIndex) => {
        e.preventDefault();
        const from = dragIndex.current;
        if (from === null || from === dropIndex) return;

        const reordered = [...items];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(dropIndex, 0, moved);
        onChange(reordered);
        setDragOver(null);
    };

    return (
        <div className="media-preview-section">
            <div className="media-preview-header">
        <span className="media-preview-header__title">
          Media ({items.length})
        </span>
                <span className="media-preview-header__hint">
          Drag to reorder · First item = cover image fallback
        </span>
            </div>

            <div className="media-preview-list">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={`media-card ${dragOver === index ? "media-card--drag-over" : ""} ${index === 0 ? "media-card--first" : ""}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnItem(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="media-card__drag-handle" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
                                <circle cx="9" cy="5"  r="1.5" /><circle cx="15" cy="5"  r="1.5" />
                                <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                                <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                            </svg>
                        </div>

                        <div className="media-card__order">{index + 1}</div>

                        {item.type === "video"
                            ? <VideoThumb src={item.previewUrl} />
                            : <ImageThumb src={item.previewUrl} alt={item.name} />
                        }

                        <div className="media-card__info">
                            <span className="media-card__name" title={item.name}>{item.name}</span>
                            <span className={`media-card__badge media-card__badge--${item.type}`}>
                {item.type}
              </span>
                            {index === 0 && (
                                <span className="media-card__badge media-card__badge--cover">cover</span>
                            )}
                        </div>

                        <button
                            type="button"
                            className="media-card__remove"
                            onClick={() => handleRemove(item.id)}
                            aria-label={`Remove ${item.name}`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6"  y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaPreviewList;