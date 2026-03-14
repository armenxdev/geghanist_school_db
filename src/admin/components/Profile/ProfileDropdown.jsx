import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {logoutThunk} from "../../../store/reducers/authSlice.js";
import './_profile.scss'

const getInitials = (name) => {
    if (!name) return 'A';
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

const AdminProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.auth);

    const handleLogout = async () => {
        await dispatch(logoutThunk());
        navigate('/login');
    };

    return (
        <div className="profile-page">
            <div className="profile-page__card">

                {/* Avatar */}
                <div className="profile-page__avatar">
                    {getInitials(admin?.fullName)}
                </div>

                {/* Info */}
                <div className="profile-page__info">
                    <h2 className="profile-page__name">{admin?.fullName}</h2>
                    <span className="profile-page__badge">Administrator</span>
                </div>

                <div className="profile-page__divider" />

                {/* Fields */}
                <div className="profile-page__fields">
                    <div className="profile-field">
                        <span className="profile-field__label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            Անուն Ազգանուն
                        </span>
                        <span className="profile-field__value">{admin?.fullName}</span>
                    </div>

                    <div className="profile-field">
                        <span className="profile-field__label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            Email
                        </span>
                        <span className="profile-field__value">{admin?.email}</span>
                    </div>

                    <div className="profile-field">
                        <span className="profile-field__label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Կարգավիճակ
                        </span>
                        <span className="profile-field__value">Administrator</span>
                    </div>
                </div>

                <div className="profile-page__divider" />

                {/* Logout */}
                <button className="profile-page__logout" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Ելք / Logout
                </button>
            </div>
        </div>
    );
};

export default AdminProfile;