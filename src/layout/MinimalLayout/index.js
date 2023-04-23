import { Navigate, Outlet, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { auth } from '../../constants/constants';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
    const token = localStorage.getItem(auth.accessToken);
    const location = useLocation();

    return token ? (
        <Navigate to="/" state={{ from: location }} replace />
    ) : (
        <>
            <Outlet />
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} closeOnClick={true} pauseOnHover={true} />
        </>
    );
};

export default MinimalLayout;
