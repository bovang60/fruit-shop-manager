import React, { useState, useEffect } from 'react';
import { Button, Tag, Form, message, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import ShopManagementView, { type Shop } from './ShopManagementView';

const { Text } = Typography;

const ShopManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('PENDING');
    const [shops, setShops] = useState<Shop[]>([]);
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');
    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [rejectForm] = Form.useForm();

    const fetchShops = () => {
        // Mock Data based on activeTab
        const mockShops: Shop[] = [
            { id: 1, shopName: 'Sun Kissed Orchards', ownerName: 'Jonathan Miller', regDate: 'October 24, 2023', status: 'PENDING', description: 'Sun Kissed Orchards is a family-owned sustainable farm specializing in heritage citrus and stone fruits. We pride ourselves on tree-ripened produce delivered straight from our orchards to local communities. All our practices are organic-certified, ensuring the highest quality and nutritional value for our customers. We seek to join the platform to expand our reach to health-conscious consumers in the greater metropolitan area.', ownerPhone: '+1 (555) 902-3482', ownerEmail: 'contact@sunkisedorchards.com', businessAddress: '1242 Harvest Lane, Riverside Valley, CA 92501', documentUrls: ['Business_License.pdf', 'Organic_Certification.pdf'], productCount: 150, yearsInBusiness: 12, locationType: 'Rural', staffCount: 25 },
            { id: 2, shopName: 'Organic Veggies', ownerName: 'Jane Smith', regDate: '2023-02-15', status: 'APPROVED', description: 'Organic only', ownerPhone: '0987654321', ownerEmail: 'jane@example.com', businessAddress: '456 Farm Rd' },
            { id: 3, shopName: 'Bad Apples', ownerName: 'Bad Guy', regDate: '2023-03-10', status: 'REJECTED', rejectReason: 'Incomplete documents' },
        ];
        const filtered = mockShops.filter(s => s.status === activeTab || (activeTab === 'APPROVED' && s.status === 'SUSPENDED'));
        setShops(filtered);
    };

    useEffect(() => {
        fetchShops();
    }, [activeTab]);

    const handleApprove = (_id: number) => {
        message.success('Shop Approved');
        setViewMode('LIST');
        fetchShops();
    };

    const handleReject = (values: { reason: string }) => {
        message.success(`Shop Rejected: ${values.reason}`);
        setIsRejectModalVisible(false);
        setViewMode('LIST');
        fetchShops();
    };

    const handleSuspend = (_id: number) => {
        message.success('Shop Suspended/Activated');
        fetchShops();
    }

    const columns: ColumnsType<Shop> = [
        {
            title: 'SHOP NAME',
            dataIndex: 'shopName',
            key: 'shopName',
            render: (text) => <Text strong>{text}</Text>
        },
        { title: 'OWNER', dataIndex: 'ownerName', key: 'ownerName' },
        { title: 'REG DATE', dataIndex: 'regDate', key: 'regDate' },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    color={status === 'APPROVED' ? 'success' : status === 'PENDING' ? 'warning' : 'error'}
                    style={{ borderRadius: 12, fontWeight: 500 }}
                >
                    {status}
                </Tag>
            )
        },
        ...(activeTab === 'REJECTED' ? [{ title: 'REASON', dataIndex: 'rejectReason', key: 'rejectReason' }] : []),
        {
            title: 'ACTION',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" size="small" onClick={() => { setSelectedShop(record); setViewMode('DETAIL'); }}>View Detail</Button>
                    {activeTab === 'APPROVED' && (
                        <Button type="link" danger size="small" onClick={() => handleSuspend(record.id)}>
                            {record.status === 'SUSPENDED' ? 'Re-activate' : 'Suspend'}
                        </Button>
                    )}
                    {activeTab === 'REJECTED' && (
                        <Button type="link" size="small" onClick={() => handleApprove(record.id)}>Re-Approve</Button>
                    )}
                </Space>
            ),
        },
    ];

    const sortMenu: MenuProps = {
        items: [
            { key: '1', label: 'Name (A-Z)' },
            { key: '2', label: 'Date Registered' },
        ],
    };

    return (
        <ShopManagementView
            activeTab={activeTab}
            onTabChange={setActiveTab}
            shops={shops}
            columns={columns}
            sortMenu={sortMenu}
            viewMode={viewMode}
            selectedShop={selectedShop}
            setViewMode={setViewMode}
            isRejectModalVisible={isRejectModalVisible}
            onCancelReject={() => setIsRejectModalVisible(false)}
            onFinishReject={handleReject}
            rejectForm={rejectForm}
        />
    );
};

export default ShopManagement;
