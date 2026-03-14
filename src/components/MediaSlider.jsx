import React, { useState, useCallback } from "react";

const MediaSlider = ({ items = [], cover = null }) => {
    const [current, setCurrent] = useState(0);

    const slides = items.length > 0
        ? items
        : cover
            ? [{ url: cover, type: "image" }]
            : [];

    const prev = useCallback(() =>
            setCurrent((c) => (c - 1 + slides.length) % slides.length),
        [slides.length]
    );

    const next = useCallback(() =>
            setCurrent((c) => (c + 1) % slides.length),
        [slides.length]
    );

    if (slides.length === 0) {
        return (
            <div className="ms ms--empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="1.2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                </svg>
            </div>
        );
    }

    const slide = slides[current];

    return (
        <div className="ms">
            <div className="ms__viewport">
                {slide.type === "video" ? (
                    <video
                        key={current}
                        src={slide.url}
                        className="ms__media"
                        controls
                        preload="metadata"
                    />
                ) : (
                    <img
                        key={current}
                        src={slide.url}
                        alt=""
                        className="ms__media ms__media--img"
                        loading="lazy"
                    />
                )}

                {slides.length > 1 && (
                    <>
                        <button
                            className="ms__arrow ms__arrow--prev"
                            onClick={prev}
                            aria-label="Previous"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="15,18 9,12 15,6"/>
                            </svg>
                        </button>
                        <button
                            className="ms__arrow ms__arrow--next"
                            onClick={next}
                            aria-label="Next"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="9,6 15,12 9,18"/>
                            </svg>
                        </button>

                        <div className="ms__dots">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    className={`ms__dot ${i === current ? "ms__dot--active" : ""}`}
                                    onClick={() => setCurrent(i)}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>

                        <span className="ms__counter">
                            {current + 1} / {slides.length}
                        </span>
                    </>
                )}
            </div>

            {slides.length > 2 && (
                <div className="ms__thumbs">
                    {slides.map((s, i) => (
                        <button
                            key={i}
                            className={`ms__thumb ${i === current ? "ms__thumb--active" : ""}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            {s.type === "video" ? (
                                <div className="ms__thumb-video">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5,3 19,12 5,21"/>
                                    </svg>
                                </div>
                            ) : (
                                <img src={s.url} alt="" loading="lazy"/>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaSlider;