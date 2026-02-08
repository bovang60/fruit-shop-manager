import React, { useState } from 'react';
import { Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import CategoryManagementView, { Category } from './CategoryManagementView';

const { Text } = Typography;

const CategoryManagement: React.FC = () => {
    // Mock Data
    const initialCategories: Category[] = [
        { id: 1, icon: '🍊', iconBg: '#fff7e6', name: 'Citrus Fruits', productCount: 1245, status: 'Active' },
        { id: 2, icon: '🍒', iconBg: '#fff1f0', name: 'Berries & Cherries', productCount: 892, status: 'Active' },
        { id: 3, icon: '☀️', iconBg: '#feffe6', name: 'Exotic Tropicals', productCount: 456, status: 'Active' },
        { id: 4, icon: '📦', iconBg: '#f0f2f5', name: 'Specialty Seeds', productCount: 0, status: 'Inactive' },
    ];

    const [categories] = useState<Category[]>(initialCategories);

    const columns: ColumnsType<Category> = [
        {
            title: 'ICON',
            dataIndex: 'icon',
            key: 'icon',
            render: (text: string, record: Category) => (
                <div
                    className="category-icon-box"
                    style={{ background: record.iconBg }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: 'CATEGORY NAME',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'PRODUCT COUNT',
            dataIndex: 'productCount',
            key: 'productCount',
            render: (count: number) => `${count} Items`,
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'Active' | 'Inactive') => (
                <Tag
                    color={status === 'Active' ? 'success' : 'default'}
                    className="status-tag"
                    style={{
                        background: status === 'Active' ? '#f6ffed' : '#f5f5f5',
                        color: status === 'Active' ? '#52c41a' : '#00000040',
                    }}
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            render: () => (
                <Space size="middle">
                    <EditOutlined className="action-icon" />
                    <DeleteOutlined className="action-icon" />
                </Space>
            ),
        },
    ];

    const filterMenu: MenuProps = {
        items: [
            { key: '1', label: 'All Categories' },
            { key: '2', label: 'Active Only' },
            { key: '3', label: 'Inactive Only' },
        ],
    };

    const sortMenu: MenuProps = {
        items: [
            { key: '1', label: 'Name (A-Z)' },
            { key: '2', label: 'Product Count (High-Low)' },
        ],
    };

    return (
        <CategoryManagementView
            categories={categories}
            columns={columns}
            filterMenu={filterMenu}
            sortMenu={sortMenu}
        />
    );
};

export default CategoryManagement;
