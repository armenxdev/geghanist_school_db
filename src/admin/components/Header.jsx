import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const pageTitles = [
    { id: 1, label: "Վահանակ / Dashboard", path: '/admin/dashboard' },
    { id: 2, label: "Մեր Մասին", path: '/admin/about' },
    { id: 3, label: "Աշխատակազմ", path: '/admin/staff' },
    { id: 4, label: "Հաշվետվություններ", path: '/admin/reports' },
    { id: 5, label: "Հրապարակումներ", path: '/admin/posts' },
    { id: 6, label: "Փաստաթղթեր", path: '/admin/documents' },
];

const getInitials = (name) => {
    if (!name) return 'A';
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();
};

const Header = ({ onMenuToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { admin } = useSelector(state => state.auth);

    const title =
        pageTitles.find(page => page.path === location.pathname)?.label ||
        "Admin Panel";

    return (
        <header className="admin-header">

            <div className="admin-header__left">
                <button
                    className="admin-header__menu-btn"
                    onClick={onMenuToggle}
                >
                    ☰
                </button>

                <h1 className="admin-header__title">{title}</h1>
            </div>

            <div className="admin-header__right">
                <button
                    className="admin-header__profile-btn"
                    onClick={() => navigate('/admin/profile')}
                >
                    <div className="admin-header__avatar">
                        {getInitials(admin?.fullName)}
                    </div>

                    <span className="admin-header__fullname">
                        {admin?.fullName || "Admin"}
                    </span>
                </button>
            </div>

        </header>
    );
};

export default Header;