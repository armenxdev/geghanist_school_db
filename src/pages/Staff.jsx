import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, resetStaff } from '../store/reducers/staffSlice.js';


const initials = (fullName) => {
    if (!fullName) return '??';
    return fullName.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('');
};


const StaffCard = ({ member, index }) => (
    <div className="staff-card">
        <div className="staff-card__index">
            {String(index + 1).padStart(2, '0')}
        </div>
        <div className="staff-card__avatar">
            {initials(member.fullName)}
        </div>
        <div className="staff-card__body">
            <h3 className="staff-card__name">{member.fullName}</h3>
            <p className="staff-card__role">{member.role}</p>
        </div>
    </div>
);


const SkeletonCard = () => (
    <div className="staff-card staff-card--skeleton" aria-hidden="true">
        <div className="staff-card__index skeleton-block" />
        <div className="staff-card__avatar skeleton-block" />
        <div className="staff-card__body">
            <div className="skeleton-block skeleton-block--name" />
            <div className="skeleton-block skeleton-block--role" />
        </div>
    </div>
);


const Staff = () => {
    const dispatch      = useDispatch();
    const fetchedRef    = useRef(false);
    const prevCountRef  = useRef(0);   // երկ-ի չափ item-ներ load-ից առաջ
    const gridRef       = useRef(null); // grid-ի ref՝ scroll-ի համար

    const { staffList, total, count, loading, error, page, limit, hasMore } =
        useSelector((state) => state.staff);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        dispatch(resetStaff());
        dispatch(fetchStaff({ page: 1, limit }));
    }, [dispatch, limit]);

    // Երբ load more-ից հետո նոր item-ներ հայտնվեն՝ scroll ենք նոր card-ներին
    useEffect(() => {
        const prevCount = prevCountRef.current;
        const newCount  = staffList.length;

        if (!loading && newCount > prevCount && prevCount > 0 && gridRef.current) {
            const cards = gridRef.current.querySelectorAll('.staff-card:not(.staff-card--skeleton)');
            const firstNew = cards[prevCount];
            if (firstNew) {
                firstNew.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        prevCountRef.current = newCount;
    }, [staffList.length, loading]);

    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            prevCountRef.current = staffList.length;
            dispatch(fetchStaff({ page, limit }));
        }
    }, [dispatch, loading, hasMore, page, limit, staffList.length]);

    const handleRetry = useCallback(() => {
        fetchedRef.current = false;
        dispatch(resetStaff());
        dispatch(fetchStaff({ page: 1, limit }));
    }, [dispatch, limit]);

    const isFirstLoad = loading && staffList.length === 0;

    return (
        <div className="page-content">
            <section className="staff-section">
                <div className="container">

                    <div className="staff-header">
                        <div className="staff-header__text">
                            <h1 className="staff-header__title">Աշխատակազմ</h1>
                            <p className="staff-header__sub">
                                Քանակ ·{' '}
                                <strong>{count} Աշխատակից</strong>
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="staff-error" role="alert">
                            <p className="staff-error__msg">{error}</p>
                            <button
                                className="staff-error__retry"
                                onClick={handleRetry}
                            >
                                Փորձել Կրկին
                            </button>
                        </div>
                    )}

                    <div className="staff-grid" ref={gridRef}>
                        {staffList.map((member, index) => (
                            <StaffCard
                                key={member.id ?? index}
                                member={member}
                                index={index}
                            />
                        ))}

                        {isFirstLoad &&
                            Array.from({ length: limit }).map((_, i) => (
                                <SkeletonCard key={`sk-${i}`} />
                            ))
                        }
                    </div>

                    {loading && staffList.length > 0 && (
                        <div className="staff-loading">
                            <div className="staff-loading__spinner" />
                            <span>Բեռնվում է...</span>
                        </div>
                    )}

                    {!loading && hasMore && staffList.length > 0 && (
                        <div className="staff-load-more">
                            <button
                                className="staff-load-more__btn"
                                onClick={handleLoadMore}
                            >
                                Բեռնել ավելին
                            </button>
                        </div>
                    )}

                    {!hasMore && staffList.length > 0 && (
                        <p className="staff-end">
                            Բոլոր աշխատակիցները ցուցադրվել են
                        </p>
                    )}

                </div>
            </section>
        </div>
    );
};

export default Staff;