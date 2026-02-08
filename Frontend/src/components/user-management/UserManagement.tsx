import React, { useState, useEffect } from 'react';
import { Space, Tag, Typography, Avatar, Form, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    UserOutlined
} from '@ant-design/icons';
import UserManagementView, { User } from './UserManagementView';

const { Text } = Typography;

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        setLoading(true);
        // Mock Data
        const mockUsers: User[] = [
            { id: 1, username: 'admin', fullname: 'Super Admin', email: 'admin@fruit.com', phone: '1234567890', address: 'Admin HQ', role: 'ADMIN', status: 'ACTIVE' },
            { id: 2, username: 'seller1', fullname: 'John Seller', email: 'john@shop.com', phone: '0987654321', address: 'Fruit Market', role: 'SELLER', status: 'ACTIVE' },
            { id: 3, username: 'customer1', fullname: 'Jane Doe', email: 'jane@gmail.com', phone: '0112233445', address: 'Home', role: 'CUSTOMER', status: 'INACTIVE' },
            { id: 4, username: 'customer2', fullname: 'Mike Ross', email: 'mike@law.com', phone: '0112233999', address: 'Pearson Hardman', role: 'CUSTOMER', status: 'ACTIVE' },
        ];
        setUsers(mockUsers);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: User) => {
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleUpdate = async () => {
        message.success('User updated successfully');
        setIsModalVisible(false);
        fetchUsers();
    };

    const columns: ColumnsType<User> = [
        {
            title: 'USER',
            key: 'user',
            render: (_, record) => (
                <div className="user-info-cell">
                    <Avatar
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: record.role === 'ADMIN' ? '#ffccc7' : record.role === 'SELLER' ? '#bae0ff' : '#d9f7be',
                            color: '#555'
                        }}
                    />
                    <div className="user-detail-text">
                        <Text strong>{record.fullname}</Text>
                        <Text className="user-email-text">{record.email}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'ROLE',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag
                    color={role === 'ADMIN' ? 'red' : role === 'SELLER' ? 'blue' : 'green'}
                    className="role-tag"
                >
                    {role}
                </Tag>
            )
        },
        {
            title: 'PHONE',
            dataIndex: 'phone',
            key: 'phone',
            render: (text: string) => <Text>{text}</Text>
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag
                    color={status === 'ACTIVE' ? 'success' : 'default'}
                    className="status-tag-user"
                    style={{
                        background: status === 'ACTIVE' ? '#f6ffed' : '#f5f5f5',
                        color: status === 'ACTIVE' ? '#52c41a' : '#00000040',
                    }}
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        className="action-icon-user"
                        onClick={() => handleEdit(record)}
                    />
                    <DeleteOutlined className="action-icon-user" />
                </Space>
            ),
        },
    ];

    const filterMenu: MenuProps = {
        items: [
            { key: '1', label: 'All Users' },
            { key: '2', label: 'Active Only' },
            { key: '3', label: 'Inactive Only' },
        ],
    };

    const sortMenu: MenuProps = {
        items: [
            { key: '1', label: 'Name (A-Z)' },
            { key: '2', label: 'Recent' },
        ],
    };

    return (
        <UserManagementView
            users={users}
            loading={loading}
            columns={columns}
            filterMenu={filterMenu}
            sortMenu={sortMenu}
            isModalVisible={isModalVisible}
            onCancelModal={() => setIsModalVisible(false)}
            onFinishForm={handleUpdate}
            form={form}
        />
    );
};

export default UserManagement;
