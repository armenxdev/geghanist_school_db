import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthThunk, logoutThunk } from './store/reducers/authSlice.js';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from "./routes/routes.jsx";

const App = () => {
    const dispatch    = useDispatch();
    const { authChecked } = useSelector(state => state.auth);


    useEffect(() => {
        dispatch(checkAuthThunk());
    }, [dispatch]);

    useEffect(() => {
        const handler = () => dispatch(logoutThunk());
        window.addEventListener('auth:logout', handler);
        return () => window.removeEventListener('auth:logout', handler);
    }, [dispatch]);

    if (!authChecked) return <div className="app-loader" />;

    return (
        <>
            <RouterProvider router={routes} />
            <ToastContainer
                position="bottom-right"
                autoClose={3500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
            />
        </>
    );
};

export default App;