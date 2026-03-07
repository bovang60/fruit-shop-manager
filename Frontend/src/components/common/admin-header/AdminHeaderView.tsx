import React from 'react';
import { Input, Badge, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { SearchOutlined, BellOutlined } from '@ant-design/icons';
import './AdminHeader.css';

interface AdminHeaderViewProps {
    placeholder: string;
    userMenuItems: MenuProps['items'];
    userName: string;
    userRole: string;
    avatarUrl: string;
    onMenuClick: MenuProps['onClick'];
}

const AdminHeaderView: React.FC<AdminHeaderViewProps> = ({
    placeholder,
    userMenuItems,
    userName,
    userRole,
    avatarUrl,
    onMenuClick
}) => {
    return (
        <header className="admin-header">
            <div style={{ flex: 1 }}></div>
            <div className="admin-header-right">
                <Input
                    placeholder={placeholder}
                    prefix={<SearchOutlined style={{ color: '#ccc' }} />}
                    className="admin-header-search"
                />
                <Badge dot offset={[-2, 2]}>
                    <BellOutlined style={{ fontSize: 20, color: '#666' }} />
                </Badge>

                <div className="admin-header-divider"></div>

                <div className="user-info-wrap">
                    <div className="user-text">
                        <div className="user-name">{userName}</div>
                        <div className="user-role">{userRole}</div>
                    </div>
                    <Dropdown menu={{ items: userMenuItems, onClick: onMenuClick }} placement="bottomRight" arrow>
                        <Avatar
                            src={avatarUrl}
                            className="user-avatar"
                        />
                    </Dropdown>
                </div>
            </div>
        </header>
    );
};

export default AdminHeaderView;
