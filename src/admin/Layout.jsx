import React, { useState } from 'react';
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import './pages/styles/_admin_main.scss'
import {Outlet} from "react-router-dom";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="admin-layout__body">
                <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />

                <main className="admin-layout__content">
                   <Outlet />
                </main>
            </div>

            {sidebarOpen && (
                <div
                    className="admin-layout__overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;