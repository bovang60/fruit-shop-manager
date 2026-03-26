import React from 'react';
import { Card, Typography, Row, Col, Input, Select, Switch, Button, Tag, Space } from 'antd';
import {
    GlobalOutlined,
    CreditCardOutlined,
    CarOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    PlusOutlined
} from '@ant-design/icons';
import AdminHeader from '../common/admin-header/AdminHeader';
import './SystemSettings.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface SystemSettingsViewProps {
    deliveryZones: string[];
    handleClose: (tag: string) => void;
    showInput: () => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputConfirm: () => void;
    inputVisible: boolean;
    inputValue: string;
}

const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
    deliveryZones,
    handleClose,
    showInput,
    handleInputChange,
    handleInputConfirm,
    inputVisible,
    inputValue
}) => {
    return (
        <div className="settings-container">
            <AdminHeader placeholder="Search settings, configurations, or logs..." />

            <div style={{ marginBottom: 32 }}>
                <Title level={3} style={{ margin: '0 0 8px 0' }}>System Settings</Title>
                <Text type="secondary">Configure global parameters, payment methods, and platform notifications</Text>
            </div>

            <Row gutter={[24, 24]}>
                {/* General Settings */}
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <GlobalOutlined style={{ color: '#52c41a' }} />
                                <span>General Settings</span>
                            </Space>
                        }
                        bordered={false}
                        className="settings-card"
                        headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
                        bodyStyle={{ padding: 24 }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <Text strong className="settings-field-label">SITE NAME</Text>
                                <Input defaultValue="FruitShop Premium" size="large" style={{ borderRadius: 6 }} />
                            </div>
                            <div>
                                <Text strong className="settings-field-label">STORE EMAIL</Text>
                                <Input defaultValue="contact@fruitshop.com" size="large" style={{ borderRadius: 6 }} />
                            </div>
                            <div>
                                <Text strong className="settings-field-label">CURRENCY</Text>
                                <Select defaultValue="usd" size="large" style={{ width: '100%', borderRadius: 6 }}>
                                    <Option value="usd">USD - US Dollar ($)</Option>
                                    <Option value="eur">EUR - Euro (€)</Option>
                                    <Option value="vnd">VND - Vietnamese Dong (₫)</Option>
                                </Select>
                            </div>
                            <Button type="primary" size="large" block className="settings-save-btn">Save Changes</Button>
                        </div>
                    </Card>
                </Col>

                {/* Payment Gateways */}
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <CreditCardOutlined style={{ color: '#52c41a' }} />
                                <span>Payment Gateways</span>
                            </Space>
                        }
                        bordered={false}
                        className="settings-card"
                        headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
                        bodyStyle={{ padding: 24 }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>Credit Card</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Enable Visa, MasterCard, Amex</Text>
                                </div>
                                <Switch defaultChecked style={{ background: '#52c41a' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>PayPal</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Accept International PayPal payments</Text>
                                </div>
                                <Switch defaultChecked style={{ background: '#52c41a' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>E-wallet</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Apple Pay, Google Pay, Local Wallets</Text>
                                </div>
                                <Switch />
                            </div>
                            <div style={{ flexGrow: 1 }}></div>
                            <Button type="primary" size="large" block className="settings-save-btn">Save Changes</Button>
                        </div>
                    </Card>
                </Col>

                {/* Shipping Configurations */}
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <CarOutlined style={{ color: '#52c41a' }} />
                                <span>Shipping Configurations</span>
                            </Space>
                        }
                        bordered={false}
                        className="settings-card"
                        headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
                        bodyStyle={{ padding: 24 }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <Text strong className="settings-field-label">DELIVERY ZONES</Text>
                                <div style={{ marginBottom: 8 }}>
                                    {deliveryZones.map((tag) => (
                                        <Tag
                                            key={tag}
                                            closable
                                            onClose={() => handleClose(tag)}
                                            style={{ marginBottom: 8, padding: '6px 14px', fontSize: 13, borderRadius: 16, border: '1px solid #d9d9d9', background: '#fafafa' }}
                                        >
                                            {tag}
                                        </Tag>
                                    ))}
                                    {inputVisible && (
                                        <Input
                                            type="text"
                                            size="small"
                                            style={{ width: 120, borderRadius: 16 }}
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onBlur={handleInputConfirm}
                                            onPressEnter={handleInputConfirm}
                                            autoFocus
                                        />
                                    )}
                                    {!inputVisible && (
                                        <Tag onClick={showInput} style={{ background: '#f6ffed', borderStyle: 'dashed', cursor: 'pointer', marginBottom: 8, padding: '6px 14px', fontSize: 13, color: '#52c41a', borderColor: '#b7eb8f', borderRadius: 16 }}>
                                            <PlusOutlined /> Add New Zone
                                        </Tag>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Text strong className="settings-field-label">BASE FEES ($)</Text>
                                <Input defaultValue="5.00" size="large" style={{ borderRadius: 6 }} />
                            </div>
                            <Button type="primary" size="large" block className="settings-save-btn">Save Changes</Button>
                        </div>
                    </Card>
                </Col>

                {/* Email Notifications */}
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <MailOutlined style={{ color: '#52c41a' }} />
                                <span>Email Notifications</span>
                            </Space>
                        }
                        bordered={false}
                        className="settings-card"
                        headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
                        bodyStyle={{ padding: 24 }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>Order Confirmations</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Sent to customer after purchase</Text>
                                </div>
                                <Switch defaultChecked style={{ background: '#52c41a' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>Marketing Emails</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Weekly deals and newsletters</Text>
                                </div>
                                <Switch defaultChecked style={{ background: '#52c41a' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>Stock Alerts</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Notify admins of low inventory</Text>
                                </div>
                                <Switch />
                            </div>
                            <div style={{ flexGrow: 1 }}></div>
                            <Button type="primary" size="large" block className="settings-save-btn">Save Changes</Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* System Integrity Banner */}
            <div className="integrity-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="integrity-icon-circle">
                        <SafetyCertificateOutlined style={{ color: '#fff', fontSize: 24 }} />
                    </div>
                    <div>
                        <Text strong style={{ fontSize: 16, display: 'block' }}>System Integrity</Text>
                        <Text type="secondary" style={{ maxWidth: 600, display: 'block' }}>
                            All changes made to system settings are logged for auditing purposes. Ensure critical updates are performed during low-traffic periods.
                        </Text>
                    </div>
                </div>
                <Button style={{
                    color: '#52c41a',
                    borderColor: '#b7eb8f',
                    background: '#fff',
                    fontWeight: 600,
                    borderRadius: 6
                }}>
                    View Audit Log
                </Button>
            </div>
        </div>
    );
};

export default SystemSettingsView;
