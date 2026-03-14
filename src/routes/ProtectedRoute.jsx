import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const { admin } = useSelector(state => state.auth);
    return admin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;