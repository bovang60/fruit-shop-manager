import React from 'react';
import { Table, Button, Tag, Space, Typography, Dropdown, MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    FilterOutlined,
    EditOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    DownOutlined
} from '@ant-design/icons';
import AdminHeader from '../common/admin-header/AdminHeader';
import './CategoryManagement.css';

const { Title, Text } = Typography;

export interface Category {
    id: number;
    icon: string;
    iconBg: string;
    name: string;
    productCount: number;
    status: 'Active' | 'Inactive';
}

interface CategoryManagementViewProps {
    categories: Category[];
    columns: ColumnsType<Category>;
    filterMenu: MenuProps;
    sortMenu: MenuProps;
}

const CategoryManagementView: React.FC<CategoryManagementViewProps> = ({
    categories,
    columns,
    filterMenu,
    sortMenu
}) => {
    return (
        <div className="category-mgmt-container">
            <AdminHeader />

            {/* Page Title & Subtitle */}
            <div className="page-header-section">
                <Title level={3} className="page-title">Product Categories</Title>
                <Text type="secondary">Manage the global taxonomy for the fruit marketplace</Text>
            </div>

            {/* Toolbar: Filter, Sort, Add Button */}
            <div className="toolbar-section">
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
                    className="add-btn"
                >
                    Add New Category
                </Button>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={categories}
                pagination={{ position: ['bottomRight'], pageSize: 4, showSizeChanger: false }}
                rowKey="id"
                rowSelection={{ type: 'checkbox' }}
            />

            {/* Footer Banner */}
            <div className="footer-banner">
                <div className="banner-info-wrap">
                    <div className="info-icon-circle">
                        <InfoCircleOutlined style={{ color: '#fff', fontSize: 24 }} />
                    </div>
                    <div>
                        <Text strong style={{ fontSize: 16, display: 'block' }}>Taxonomy Management</Text>
                        <Text type="secondary" style={{ maxWidth: 600, display: 'block' }}>
                            Updating category names will reflect across all linked products immediately. Deleting a category requires reassignment of active products.
                        </Text>
                    </div>
                </div>
                <Button className="banner-btn">
                    System logs
                </Button>
            </div>
        </div>
    );
};

export default CategoryManagementView;
