import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    School,
    LayoutDashboard,
    Info,
    Users,
    FileText,
    Newspaper,
    ArrowLeft,
} from 'lucide-react';

const menuItems = [
    { id: 1, label: "Վահանակ",       path: '/admin/dashboard', icon: LayoutDashboard },
    { id: 2, label: "Մեր Մասին",     path: '/admin/about',     icon: Info            },
    { id: 3, label: "Աշխատակազմ",    path: '/admin/staff',     icon: Users           },
    { id: 4, label: "Փաստաթղթեր",    path: '/admin/documents', icon: FileText        },
    { id: 5, label: "Հրապարակումներ", path: '/admin/posts',    icon: Newspaper       },
];

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
            {/* ── Brand ── */}
            <div className="sidebar__brand">
                <div className="sidebar__brand-icon">
                    <School size={20} />
                </div>
                <div className="sidebar__brand-text">
                    <span className="sidebar__brand-name">Կայքի Կառավարում</span>
                    <span className="sidebar__brand-sub">Admin Panel</span>
                </div>
            </div>

            {/* ── Nav ── */}
            <nav className="sidebar__nav">
                <span className="sidebar__nav-label">Կառավարում</span>

                {menuItems.map(({ id, label, path, icon: Icon }) => (
                    <NavLink
                        to={path}
                        key={id}
                        className={({ isActive }) =>
                            `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
                        }
                        onClick={onClose}
                    >
                        <span className="sidebar__nav-icon">
                            <Icon size={17} />
                        </span>
                        <span className="sidebar__nav-text">{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* ── Footer ── */}
            <div className="sidebar__footer">
                <NavLink to="/" className="sidebar__back-link" onClick={onClose}>
                    <ArrowLeft size={15} />
                    Վերադառնալ Կայք
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;