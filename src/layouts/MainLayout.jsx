import { Outlet } from 'react-router-dom';
import Footer from '../components/layout/Footer.jsx';
import Header from "../components/layout/Header.jsx";


const MainLayout = () => {
    return (
        <div className="wrapper">
            <Header />

            <main className="main">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;