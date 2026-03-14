import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttributes } from '../store/reducers/attributeSlice.js';

const SCHOOL_CORE = {
    name: "Շիրակի մարզի Գեղանիստի միջնակարգ դպրոց ՊՈԱԿ",
    description: "Միջնակարգ դպրոց՝ Շիրակի մարզում, Արթիկ համայնքում, Գեղանիստում"
};

const Icon = ({ name }) => {
    const paths = {
        location: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />,
        person:   <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>,
        door:     <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></>,
        monitor:  <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
        wifi:     <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>,
        dumbbell: <path d="M6 4v16M18 4v16M6 9h12M6 15h12"/>,
        users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
        graduate: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2.21 2.69 4 6 4s6-1.79 6-4v-5"/></>,
    };

    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
             aria-hidden="true">
            {paths[name] || paths.person}
        </svg>
    );
};

const SkeletonBlock = ({ className }) => (
    <div className={`skeleton-block ${className || ''}`} />
);

const About = () => {
    const dispatch = useDispatch();
    const { data: attributes, loading, error } = useSelector(state => state.school);

    useEffect(() => {
        dispatch(fetchAttributes());
    }, [dispatch]);

    if (loading) return (
        <div className="page-content">
            <section className="about-intro">
                <div className="container">
                    <SkeletonBlock className="skeleton-block--title" />
                    <SkeletonBlock className="skeleton-block--text" />
                    <SkeletonBlock className="skeleton-block--text" />
                </div>
            </section>
            <section className="school-info-section">
                <div className="container">
                    <div className="school-info__grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="school-info__item school-info__item--skeleton">
                                <SkeletonBlock className="skeleton-block--icon" />
                                <div className="school-info__item-body">
                                    <SkeletonBlock className="skeleton-block--label" />
                                    <SkeletonBlock className="skeleton-block--value" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );

    if (error) return (
        <div className="page-content">
            <div className="about-error">
                <div className="about-error__icon" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                </div>
                <p className="about-error__msg">{error}</p>
                <button className="about-error__retry" onClick={() => dispatch(fetchAttributes())}>
                    Փորձել կրկին
                </button>
            </div>
        </div>
    );

    return (
        <div className="page-content">
            <section className="about-intro">
                <div className="container">
                    <h1 className="about-intro__title">{SCHOOL_CORE.name}</h1>
                    {SCHOOL_CORE.description && (
                        <p className="about-intro__text">{SCHOOL_CORE.description}</p>
                    )}
                </div>
            </section>

            <section className="school-info-section">
                <div className="container">
                    <h2 className="school-info__title">Դպրոցի մասին</h2>

                    {attributes?.length > 0 ? (
                        <div className="school-info__grid">
                            {attributes.map((attr, i) => (
                                <div key={attr.id ?? i} className="school-info__item">
                                    <div className="school-info__item-icon">
                                        <Icon name="door" />
                                    </div>
                                    <div className="school-info__item-body">
                                        <span className="school-info__label">{attr.attributeName}</span>
                                        <span className="school-info__value">{attr.attributeValue}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="school-info__empty">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <path d="M9 3v18M3 9h6M3 15h6"/>
                            </svg>
                            <p>Տվյալներ դեռ չկան</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default About;