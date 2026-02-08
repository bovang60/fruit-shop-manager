import React from 'react';
import { Table, Button, Input, Select, Tag, Modal, Form, Space, Typography, Dropdown, MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    FilterOutlined,
    DownOutlined
} from '@ant-design/icons';
import AdminHeader from '../common/admin-header/AdminHeader';
import './UserManagement.css';

const { Title, Text } = Typography;

export interface User {
    id: number;
    username: string;
    fullname: string;
    email: string;
    phone: string;
    address: string;
    role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
    status: 'ACTIVE' | 'INACTIVE';
}

interface UserManagementViewProps {
    users: User[];
    loading: boolean;
    columns: ColumnsType<User>;
    filterMenu: MenuProps;
    sortMenu: MenuProps;
    isModalVisible: boolean;
    onCancelModal: () => void;
    onFinishForm: (values: any) => void;
    form: any;
}

const UserManagementView: React.FC<UserManagementViewProps> = ({
    users,
    loading,
    columns,
    filterMenu,
    sortMenu,
    isModalVisible,
    onCancelModal,
    onFinishForm,
    form
}) => {
    return (
        <div className="user-mgmt-container">
            <AdminHeader placeholder="Search users by name, email or role..." />

            {/* Page Title & Subtitle */}
            <div style={{ marginBottom: 32 }}>
                <Title level={3} style={{ margin: '0 0 8px 0' }}>User Management</Title>
                <Text type="secondary">Manage user accounts, roles, and permissions</Text>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Space size={16}>
                    <Dropdown menu={filterMenu}>
                        <Button style={{ borderRadius: 6 }}>
                            <Space>
                                <FilterOutlined /> Filter <DownOutlined style={{ fontSize: 10 }} />
                            </Space>
                        </Button>
                    </Dropdown>
                    <Dropdown menu={sortMenu}>
                        <Button style={{ borderRadius: 6 }}>
                            <Space>
                                Sort by <DownOutlined style={{ fontSize: 10 }} />
                            </Space>
                        </Button>
                    </Dropdown>
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="add-btn-user"
                >
                    Add New User
                </Button>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={users}
                pagination={{ position: ['bottomRight'], pageSize: 5, showSizeChanger: false }}
                rowKey="id"
                loading={loading}
            />

            {/* Footer Banner */}
            <div className="footer-banner-user">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="info-icon-circle-user">
                        <InfoCircleOutlined style={{ color: '#fff', fontSize: 24 }} />
                    </div>
                    <div>
                        <Text strong style={{ fontSize: 16, display: 'block' }}>Security & Access Control</Text>
                        <Text type="secondary" style={{ maxWidth: 600, display: 'block' }}>
                            Changes to user roles will take effect immediately. Ensure you verify identity before granting Admin privileges.
                        </Text>
                    </div>
                </div>
                <Button className="banner-btn-user">
                    Security Logs
                </Button>
            </div>

            {/* Edit Modal */}
            <Modal
                title="Edit User"
                open={isModalVisible}
                onCancel={onCancelModal}
                onOk={form.submit}
            >
                <Form form={form} onFinish={onFinishForm} layout="vertical">
                    <Form.Item name="fullname" label="Full Name"><Input disabled /></Form.Item>
                    <Form.Item name="username" label="Username"><Input disabled /></Form.Item>
                    <Form.Item name="email" label="Email"><Input disabled /></Form.Item>
                    <Form.Item name="phone" label="Phone"><Input disabled /></Form.Item>
                    <Form.Item name="role" label="Role"><Input disabled /></Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="ACTIVE">Active</Select.Option>
                            <Select.Option value="INACTIVE">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

// Re-importing missing InfoCircleOutlined locally since it was used in footer
import { InfoCircleOutlined } from '@ant-design/icons';

export default UserManagementView;
