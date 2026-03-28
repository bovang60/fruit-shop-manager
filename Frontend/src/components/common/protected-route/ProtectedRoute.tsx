import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromStorage } from '../../../services/authService';
import { usePopup } from '../popup';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { showError } = usePopup();
    const user = getUserFromStorage();

    useEffect(() => {
        if (user && requiredRole && user.role !== requiredRole) {
            showError('Bạn không có quyền truy cập trang này.', 'Từ chối truy cập');
        }
    }, [user, requiredRole, showError]);

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Logged in but doesn't have required role
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
