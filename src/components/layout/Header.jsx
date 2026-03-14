import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import coatOfArms from '../../../public/Coat_of_arms_of_Armenia.svg.png';

const menuItems = [
    { id: 1, label: 'Գլխավոր',       path: '/'          },
    { id: 2, label: 'Մեր մասին',     path: '/about'     },
    { id: 5, label: 'Հրապարակումներ', path: '/posts'    },
    { id: 6, label: 'Աշխատակազմ',    path: '/staff'     },
    { id: 8, label: 'Փաստաթղթեր',    path: '/documents' },
    { id: 9, label: 'Հետադարձ Կապ',  path: '/contact'   },
];

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled,    setIsScrolled]    = useState(false);
    const location = useLocation();

    // ── Scroll ────────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ── Sidebar ───────────────────────────────────────────
    const openSidebar = () => {
        setIsSidebarOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        document.body.style.overflow = '';
    };

    const toggleSidebar = () => (isSidebarOpen ? closeSidebar() : openSidebar());

    // Close on route change
    useEffect(() => { closeSidebar(); }, [location.pathname]);

    // Close on Escape
    useEffect(() => {
        if (!isSidebarOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') closeSidebar(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isSidebarOpen]);

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <header className={`header${isScrolled ? ' header--scrolled' : ''}`}>

            {/* ── Top bar ── */}
            <div className="header__top">
                <div className="header__top-content container">
                    <span className="header__top-ministry">
                        ՀՀ Կրթության, գիտության, մշակույթի և սպորտի նախարարություն
                    </span>
                    <span className="header__top-motto">«Ուսումը լույս է բերում մարդու մեջ»</span>
                </div>
            </div>

            {/* ── Main bar ── */}
            <div className="header__main">
                <div className="header__main-inner container">

                    {/* Brand */}
                    <Link to="/" className="header__brand" aria-label="Գլխավոր էջ">
                        <img
                            src={coatOfArms}
                            alt="ՀՀ Զինանշան"
                            className="header__logo-img"
                        />
                        <div className="header__title-group">
                            <span className="header__title">Գեղանիստի Միջնակարգ Դպրոց</span>
                            <span className="header__subtitle">Պետական ուսումնական հաստատություն</span>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="header__nav" aria-label="Գլխավոր նավիգացիա">
                        <ul className="header__menu">
                            {menuItems.map((item) => (
                                <li key={item.id} className="header__menu-item">
                                    <Link
                                        to={item.path}
                                        className={`header__menu-link${isActive(item.path) ? ' active' : ''}`}
                                    >
                                        {item.label}
                                        <span className="header__menu-underline" aria-hidden="true" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Hamburger */}
                    <button
                        className={`header__hamburger${isSidebarOpen ? ' active' : ''}`}
                        onClick={toggleSidebar}
                        aria-label={isSidebarOpen ? 'Փակել մենյու' : 'Բացել մենյու'}
                        aria-expanded={isSidebarOpen}
                        aria-controls="mobile-sidebar"
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </button>

                </div>
            </div>

            {/* ── Overlay ── */}
            <div
                className={`header__overlay${isSidebarOpen ? ' active' : ''}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            {/* ── Mobile sidebar ── */}
            <aside
                id="mobile-sidebar"
                className={`header__sidebar${isSidebarOpen ? ' active' : ''}`}
                aria-hidden={!isSidebarOpen}
                aria-label="Մոբայl մենyու"
            >
                <div className="header__sidebar-header">
                    <img src={coatOfArms} alt="ՀՀ Զինանշան" className="header__sidebar-logo" />
                    <span className="header__sidebar-title">Գեղանիստի Դպրոց</span>
                    <button
                        className="header__sidebar-close"
                        onClick={closeSidebar}
                        aria-label="Փակել մենyու"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <nav aria-label="Մոբayul մenyu">
                    <ul className="header__sidebar-menu">
                        {menuItems.map((item, idx) => (
                            <li
                                key={item.id}
                                className="header__sidebar-item"
                                style={{ '--item-index': idx }}
                            >
                                <Link
                                    to={item.path}
                                    className={`header__sidebar-link${isActive(item.path) ? ' active' : ''}`}
                                    onClick={closeSidebar}
                                >
                                    <span className="header__sidebar-num">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

        </header>
    );
};

export default Header;