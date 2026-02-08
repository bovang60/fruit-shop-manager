import React from 'react';
import { Table, Tabs, Button, Modal, Tag, Input, Form, Card, Row, Col, Typography, Breadcrumb, Space, Divider, Dropdown, MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    UserOutlined,
    FilePdfOutlined,
    ShopOutlined,
    CalendarOutlined,
    ArrowLeftOutlined,
    DownOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import AdminHeader from '../common/admin-header/AdminHeader';
import './ShopManagement.css';

const { Title, Text, Paragraph } = Typography;

export interface Shop {
    id: number;
    shopName: string;
    ownerName: string;
    regDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    rejectReason?: string;
    description?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    businessAddress?: string;
    documentUrls?: string[];
    productCount?: number;
    yearsInBusiness?: number;
    locationType?: string;
    staffCount?: number;
}

interface ShopManagementViewProps {
    activeTab: string;
    onTabChange: (key: string) => void;
    shops: Shop[];
    columns: ColumnsType<Shop>;
    sortMenu: MenuProps;
    viewMode: 'LIST' | 'DETAIL';
    selectedShop: Shop | null;
    setViewMode: (mode: 'LIST' | 'DETAIL') => void;
    isRejectModalVisible: boolean;
    onCancelReject: () => void;
    onFinishReject: (values: { reason: string }) => void;
    rejectForm: any;
}

const ShopManagementView: React.FC<ShopManagementViewProps> = ({
    activeTab,
    onTabChange,
    shops,
    columns,
    sortMenu,
    viewMode,
    selectedShop,
    setViewMode,
    isRejectModalVisible,
    onCancelReject,
    onFinishReject,
    rejectForm
}) => {
    if (viewMode === 'DETAIL' && selectedShop) {
        return (
            <div className="shop-detail-container">
                <AdminHeader />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            onClick={() => setViewMode('LIST')}
                            style={{ marginRight: 16 }}
                        />
                        <Title level={3} style={{ marginBottom: 0, marginRight: 16 }}>Shop Details</Title>
                    </div>
                </div>

                <Breadcrumb
                    style={{ marginBottom: 24 }}
                    items={[
                        { title: 'Shop Management' },
                        { title: activeTab === 'PENDING' ? 'Pending Approvals' : 'Shops' },
                        { title: selectedShop.shopName },
                    ]}
                />

                <Card className="shop-main-card" style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div className="shop-icon-circle">
                            <ShopOutlined style={{ fontSize: 32, color: '#fff' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <Title level={2} style={{ margin: 0, marginRight: 12, fontSize: 24 }}>{selectedShop.shopName}</Title>
                                <Tag color={selectedShop.status === 'PENDING' ? 'gold' : 'green'} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4 }}>
                                    {selectedShop.status}
                                </Tag>
                            </div>
                            <Space style={{ color: '#666' }} size="large">
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <UserOutlined /> {selectedShop.ownerName}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CalendarOutlined /> Registered: {selectedShop.regDate}
                                </span>
                            </Space>
                        </div>
                    </div>
                </Card>

                <Row gutter={24} style={{ marginBottom: 24 }}>
                    <Col span={16}>
                        <Card title="General Information" bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <Row gutter={[24, 24]}>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Owner Name</Text>
                                    <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>{selectedShop.ownerName}</div>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Contact Email</Text>
                                    <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>{selectedShop.ownerEmail}</div>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Phone Number</Text>
                                    <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>{selectedShop.ownerPhone}</div>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Business Address</Text>
                                    <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>{selectedShop.businessAddress}</div>
                                </Col>
                            </Row>
                            <Divider />
                            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Description</Text>
                            <Paragraph style={{ marginTop: 8, color: '#555', lineHeight: 1.6 }}>
                                {selectedShop.description || 'No description provided.'}
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Uploaded Documents" bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {selectedShop.documentUrls?.map((_url, index) => (
                                    <div key={index} className="doc-item">
                                        <FilePdfOutlined style={{ fontSize: 20, color: '#ff4d4f', marginRight: 12 }} />
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <Text ellipsis style={{ fontWeight: 500 }}>Document_{index + 1}.pdf</Text>
                                            <div style={{ fontSize: 11, color: '#999' }}>2.4 MB</div>
                                        </div>
                                    </div>
                                )) || <Text type="secondary">No documents.</Text>}
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="Reject Reason"
                    open={isRejectModalVisible}
                    onCancel={onCancelReject}
                    onOk={rejectForm.submit}
                >
                    <Form form={rejectForm} onFinish={onFinishReject}>
                        <Form.Item name="reason" rules={[{ required: true, message: 'Reason is required' }]}>
                            <Input.TextArea rows={4} placeholder="Enter rejection reason..." />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }

    return (
        <div className="shop-mgmt-container">
            <AdminHeader />

            <div style={{ marginBottom: 32 }}>
                <Title level={3} style={{ margin: '0 0 8px 0' }}>Shop Management</Title>
                <Text type="secondary">Review applications and manage active sellers shops</Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={onTabChange}
                    type="card"
                    items={[
                        { key: 'PENDING', label: 'Pending Applications' },
                        { key: 'APPROVED', label: 'Approved Shops' },
                        { key: 'REJECTED', label: 'Rejected Shops' },
                    ]}
                />

                <Dropdown menu={sortMenu}>
                    <Button style={{ borderRadius: 6 }}>
                        <Space>
                            Sort by <DownOutlined style={{ fontSize: 10 }} />
                        </Space>
                    </Button>
                </Dropdown>
            </div>

            <Table
                columns={columns}
                dataSource={shops}
                rowKey="id"
                pagination={{ position: ['bottomRight'] }}
            />

            <div className="footer-banner-shop">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="info-icon-circle-shop">
                        <InfoCircleOutlined style={{ color: '#fff', fontSize: 24 }} />
                    </div>
                    <div>
                        <Text strong style={{ fontSize: 16, display: 'block' }}>Approval SLA </Text>
                        <Text type="secondary" style={{ maxWidth: 600, display: 'block' }}>
                            New shop applications should be reviewed within 48 hours. Pending applications older than 3 days will be flagged.
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopManagementView;
