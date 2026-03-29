import React from 'react';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import AdminHeaderView from './AdminHeaderView';
import { clearUserStorage, getUserFromStorage } from '../../../services/authService';

interface AdminHeaderProps {
    placeholder?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
    placeholder = "Tìm kiếm danh mục, sản phẩm, hoặc người bán..."
}) => {
    const navigate = useNavigate();
    const user = getUserFromStorage();

    // Logic for user menu action
    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'logout') {
            console.log('Logging out...');
            clearUserStorage();
            navigate('/login');
        } else if (key === 'profile') {
            navigate('/profile');
        }
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Hồ sơ',
            icon: <UserOutlined />,
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    // User data from storage or defaults
    const userData = {
        name: user?.fullName || 'Admin Executive',
        role: user?.role || 'SUPER ADMIN',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    };

    return (
        <AdminHeaderView
            placeholder={placeholder}
            userMenuItems={userMenuItems}
            userName={userData.name}
            userRole={userData.role}
            avatarUrl={userData.avatar}
            onMenuClick={handleMenuClick}
        />
    );
};

export default AdminHeader;
