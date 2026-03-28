import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from '../../utils/apiClient';
import { getUserFromStorage } from '../../services/authService';

const ProtectedRoute = ({ allowedRole }: { allowedRole: string }) => {
    const token = getAuthToken(); // Lấy token từ localStorage
    const user = getUserFromStorage(); // Lấy thông tin user từ localStorage

    if (!token || !user) {
        // Nếu chưa đăng nhập, chuyển hướng về trang Login
        return <Navigate to="/login" replace />;
    }

    if (user.role !== allowedRole) {
        // Nếu sai vai trò, quay về trang chủ
        return <Navigate to="/" replace />;
    }

    return <Outlet />; // Cho phép truy cập vào các route con
};

export default ProtectedRoute;
