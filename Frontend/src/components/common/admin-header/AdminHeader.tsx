import React from 'react';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import AdminHeaderView from './AdminHeaderView';

interface AdminHeaderProps {
    placeholder?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
    placeholder = "Search categories, products, or sellers..."
}) => {
    // Logic for user menu action
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            console.log('Logging out...');
            // Add logout logic here
        }
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
        },
        {
            key: 'logout',
            label: 'Log out',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    // Mock user data - could be from state/context later
    const userData = {
        name: 'Admin Executive',
        role: 'SUPER ADMIN',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    };

    return (
        <AdminHeaderView
            placeholder={placeholder}
            userMenuItems={userMenuItems}
            userName={userData.name}
            userRole={userData.role}
            avatarUrl={userData.avatar}
        />
    );
};

export default AdminHeader;
