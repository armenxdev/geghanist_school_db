import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import MediaSlider from "../components/MediaSlider.jsx";
import { useState, useEffect } from "react";
import api from "../api/axios.js";

const admissionDocs = [
    "Ծնողի դիմումը",
    "Երեխայի ծննդյան վկայականի պատճենը",
    "Տեղեկանք հաշվառման մասին (անձնագրային բաժին)",
    "Երկու լուսանկար (3×4 չափի)",
    "Երեխայի բժշկական քարտը",
    "Բժշկից փաստաթուղթ (եթե վկայագրված չէ)",
];

const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("hy-AM", {
        day: "numeric", month: "long", year: "numeric",
    });
};

const NewsCard = ({ post }) => (
    <article className="news-card">
        <div className="news-card__image-wrap">
            <MediaSlider items={post.media || []} cover={post.coverImage} />
        </div>
        <Link to={`/posts/${post.id}`} className="news-card__body news-card__body--link">
            <h3 className="news-card__title">{post.title}</h3>
            {post.content && (
                <p className="news-card__excerpt">
                    {post.content.length > 120
                        ? post.content.slice(0, 120) + "…"
                        : post.content}
                </p>
            )}
            <div className="news-card__meta">
                <span className="news-card__meta-item">
                    <span aria-hidden="true">📅</span>
                    {formatDate(post.createdAt)}
                </span>
            </div>
            <span className="news-card__read-more">Կարդալ ավելին →</span>
        </Link>
    </article>
);

const EventCard = ({ post }) => {
    const d     = post.createdAt ? new Date(post.createdAt) : null;
    const day   = d ? d.getDate() : "—";
    const month = d ? d.toLocaleString("hy-AM", { month: "short" }) : "";

    return (
        <Link to={`/posts/${post.id}`} className="event-card event-card--link">
            <div className="event-card__date">
                <span className="event-card__day">{day}</span>
                <span className="event-card__month">{month}</span>
            </div>
            <div className="event-card__info">
                <h4 className="event-card__title">{post.title}</h4>
                {post.content && (
                    <span className="event-card__meta">
                        {post.content.length > 80
                            ? post.content.slice(0, 80) + "…"
                            : post.content}
                    </span>
                )}
            </div>
            {(post.coverImage || post.media?.[0]?.url) && (
                <img
                    src={post.coverImage || post.media[0].url}
                    alt={post.title}
                    className="event-card__thumb"
                    loading="lazy"
                />
            )}
        </Link>
    );
};

const NewsSkeleton = () => (
    <div className="news-card news-card--skeleton">
        <div className="news-card__image-wrap skel-block" style={{ aspectRatio: "16/9" }} />
        <div className="news-card__body">
            <div className="skel-line skel-line--lg" />
            <div className="skel-line skel-line--md" />
            <div className="skel-line skel-line--sm" />
        </div>
    </div>
);

const EventSkeleton = () => (
    <div className="event-card event-card--skeleton">
        <div className="skel-block" style={{ width: 48, height: 52, borderRadius: 8, flexShrink: 0 }} />
        <div className="event-card__info">
            <div className="skel-line skel-line--md" />
            <div className="skel-line skel-line--sm" />
        </div>
    </div>
);

const Home = () => {
    const [news,              setNews]              = useState([]);
    const [events,            setEvents]            = useState([]);
    const [announcements,     setAnnouncements]     = useState([]);
    const [newsLoading,       setNewsLoading]       = useState(true);
    const [eventsLoading,     setEventsLoading]     = useState(true);
    const [announcLoading,    setAnnouncLoading]    = useState(true);

    useEffect(() => {
        api.get("/posts", { params: { type: "news", limit: 3, sort: "newest" } })
            .then(({ data }) => setNews(data.data || []))
            .catch(() => setNews([]))
            .finally(() => setNewsLoading(false));
    }, []);

    useEffect(() => {
        api.get("/posts", { params: { type: "events", limit: 4, sort: "newest" } })
            .then(({ data }) => setEvents(data.data || []))
            .catch(() => setEvents([]))
            .finally(() => setEventsLoading(false));
    }, []);

    useEffect(() => {
        api.get("/posts", { params: { type: "announcements", limit: 3, sort: "newest" } })
            .then(({ data }) => setAnnouncements(data.data || []))
            .catch(() => setAnnouncements([]))
            .finally(() => setAnnouncLoading(false));
    }, []);

    return (
        <div className="home">
            <Hero
                title="Գեղանիստի Միջնակարգ Դպրոց"
                subtitle="Գյուղ Արթիկի տարածաշրջանում, Արթիկ քաղաքից մոտ 9կմ հյուսիս-արևելք, մարզկենտրոնից 19կմ հեռավորության վրա:"
                badge="Ընդունելություն 2025–2026 ուսումնական տարի"
                ctaText="Իմանալ ավելին"
                ctaLink="/about"
                secondaryCtaText="Կոնտակտ"
                secondaryCtaLink="/contact"
            />

            <section className="news-section section">
                <div className="container">
                    <div className="section__header">
                        <h2 className="section__title">Վերջին նորություններ</h2>
                        <Link to="/posts?type=news" className="section__link">
                            Տեսնել բոլորը <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="news-grid">
                        {newsLoading
                            ? Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />)
                            : news.length > 0
                                ? news.map((post) => <NewsCard key={post.id} post={post} />)
                                : (
                                    <p className="section__empty">
                                        Նորություններ դեռ չկան
                                    </p>
                                )
                        }
                    </div>
                </div>
            </section>

            <section className="cta">
                <div className="container">
                    <div className="cta__content">
                        <span className="cta__label">Ընդունելություն 2025–2026</span>
                        <h2 className="cta__title">Ընդունելության կարգը</h2>
                        <p className="cta__lead">
                            I դասարանի ընդունելության համար անհրաժեշտ փաստաթղթեր.
                        </p>
                        <ul className="cta__docs">
                            {admissionDocs.map((doc, i) => (
                                <li key={i} className="cta__docs-item">{doc}</li>
                            ))}
                        </ul>
                        <div className="cta__actions">
                            <Link to="/contact" className="btn btn--white">
                                Կապ հաստատել
                            </Link>
                            <Link to="/about" className="btn btn--ghost">
                                Իմանալ ավելին
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="announcements-section section">
                <div className="container">
                    <div className="section__header">
                        <h2 className="section__title">Հայտարարություններ</h2>
                        <Link to="/posts?type=announcements" className="section__link">
                            Տեսնել բոլորը <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="announcements-list">
                        {announcLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="announce-card announce-card--skeleton">
                                    <div className="skel-block" style={{ width: 52, height: 52, borderRadius: 8, flexShrink: 0 }} />
                                    <div className="announce-card__info">
                                        <div className="skel-line skel-line--md" />
                                        <div className="skel-line skel-line--sm" style={{ marginTop: 8 }} />
                                    </div>
                                </div>
                            ))
                            : announcements.length > 0
                                ? announcements.map((post) => (
                                    <Link
                                        key={post.id}
                                        to={`/posts/${post.id}`}
                                        className="announce-card"
                                    >
                                        <div className="announce-card__icon" aria-hidden="true">
                                            📣
                                        </div>
                                        <div className="announce-card__info">
                                            <h4 className="announce-card__title">{post.title}</h4>
                                            <span className="announce-card__date">
                                                {formatDate(post.createdAt)}
                                            </span>
                                        </div>
                                        <span className="announce-card__arrow">→</span>
                                    </Link>
                                ))
                                : <p className="section__empty">Հայտարարություններ դեռ չկան</p>
                        }
                    </div>
                </div>
            </section>

            <section className="events-section section">
                <div className="container">
                    <div className="section__header">
                        <h2 className="section__title">Միջոցառումներ</h2>
                        <Link to="/posts?type=events" className="section__link">
                            Տեսնել բոլորը <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="events-grid">
                        {eventsLoading
                            ? Array.from({ length: 4 }).map((_, i) => <EventSkeleton key={i} />)
                            : events.length > 0
                                ? events.map((post) => <EventCard key={post.id} post={post} />)
                                : (
                                    <p className="section__empty">
                                        Միջոցառումներ դեռ չկան
                                    </p>
                                )
                        }
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;