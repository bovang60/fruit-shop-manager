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
            <AdminHeader placeholder="Tìm kiếm cài đặt, cấu hình, hoặc nhật ký..." />

            <div style={{ marginBottom: 32 }}>
                <Title level={3} style={{ margin: '0 0 8px 0' }}>Cài Đặt Hệ Thống</Title>
                <Text type="secondary">Cấu hình các tham số chung, phương thức thanh toán và thông báo nền tảng</Text>
            </div>

            <Row gutter={[24, 24]}>
                {/* General Settings */}
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <GlobalOutlined style={{ color: '#52c41a' }} />
                                <span>Cài Đặt Chung</span>
                            </Space>
                        }
                        bordered={false}
                        className="settings-card"
                        headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
                        bodyStyle={{ padding: 24 }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <Text strong className="settings-field-label">TÊN TRANG WEB</Text>
                                <Input defaultValue="FruitShop Premium" size="large" style={{ borderRadius: 6 }} />
                            </div>
                            <div>
                                <Text strong className="settings-field-label">EMAIL CỬA HÀNG</Text>
                                <Input defaultValue="contact@fruitshop.com" size="large" style={{ borderRadius: 6 }} />
                            </div>
                            <div>
                                <Text strong className="settings-field-label">TIỀN TỆ</Text>
                                <Select defaultValue="usd" size="large" style={{ width: '100%', borderRadius: 6 }}>
                                    <Option value="usd">USD - US Dollar ($)</Option>
                                    <Option value="eur">EUR - Euro (€)</Option>
                                    <Option value="vnd">VND - Đồng Việt Nam (₫)</Option>
                                </Select>
                            </div>
                            <Button type="primary" size="large" block className="settings-save-btn">Lưu Thay Đổi</Button>
                        </div>
                    </Card>
                </Col>

                {/* Payment Gateways */}
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <CreditCardOutlined style={{ color: '#52c41a' }} />
                                <span>Cổng Thanh Toán</span>
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
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>Thẻ Tín Dụng</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Kích hoạt Visa, MasterCard, Amex</Text>
                                </div>
                                <Switch defaultChecked style={{ background: '#52c41a' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>PayPal</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Chấp nhận thanh toán PayPal quốc tế</Text>
                                </div>
                                <Switch defaultChecked style={{ background: '#52c41a' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>Ví Điện Tử</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Apple Pay, Google Pay, Ví nội địa</Text>
                                </div>
                                <Switch />
                            </div>
                            <div style={{ flexGrow: 1 }}></div>
                            <Button type="primary" size="large" block className="settings-save-btn">Lưu Thay Đổi</Button>
                        </div>
                    </Card>
                </Col>

                {/* Shipping Configurations */}
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <CarOutlined style={{ color: '#52c41a' }} />
                                <span>Cấu Hình Giao Hàng</span>
                            </Space>
                        }
                        bordered={false}
                        className="settings-card"
                        headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
                        bodyStyle={{ padding: 24 }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <Text strong className="settings-field-label">KHU VỰC GIAO HÀNG</Text>
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
                                            <PlusOutlined /> Thêm Khu Vực Mới
                                        </Tag>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Text strong className="settings-field-label">PHÍ CƠ BẢN ($)</Text>
                                <Input defaultValue="5.00" size="large" style={{ borderRadius: 6 }} />
                            </div>
                            <Button type="primary" size="large" block className="settings-save-btn">Lưu Thay Đổi</Button>
                        </div>
                    </Card>
                </Col>

                {/* Email Notifications */}
                <Col span={12}>
                    <Card
                        title={
                            <Space>
                                <MailOutlined style={{ color: '#52c41a' }} />
                                <span>Thông Báo Email</span>
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
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>Xác Nhận Đơn Hàng</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Gửi cho khách hàng sau khi mua hàng</Text>
                                </div>
                                <Switch defaultChecked style={{ background: '#52c41a' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>Email Tiếp Thị</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Ưu đãi hàng tuần và bản tin</Text>
                                </div>
                                <Switch defaultChecked style={{ background: '#52c41a' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 16 }}>Cảnh Báo Kho Hàng</Text>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Thông báo cho admin khi hàng sắp hết</Text>
                                </div>
                                <Switch />
                            </div>
                            <div style={{ flexGrow: 1 }}></div>
                            <Button type="primary" size="large" block className="settings-save-btn">Lưu Thay Đổi</Button>
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
                        <Text strong style={{ fontSize: 16, display: 'block' }}>Tính Toàn Vẹn Hệ Thống</Text>
                        <Text type="secondary" style={{ maxWidth: 600, display: 'block' }}>
                            Tất cả các thay đổi đối với cài đặt hệ thống đều được ghi lại cho mục đích kiểm soát. Đảm bảo cập nhật quan trọng được thực hiện trong thời gian lưu lượng truy cập thấp.
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
                    Xem Nhật Ký Kiểm Tra
                </Button>
            </div>
        </div>
    );
};

export default SystemSettingsView;
