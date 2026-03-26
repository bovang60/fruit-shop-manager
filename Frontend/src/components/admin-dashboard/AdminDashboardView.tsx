import React from 'react';
import { Card, Col, Row, List, Avatar, Typography, Tag, Button, Space, Spin, Empty } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    DollarCircleOutlined,
    ShopOutlined,
    UsergroupAddOutlined,
    AlertOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import AdminHeader from '../common/admin-header/AdminHeader';
import { type DashboardStats } from '../../services/adminService';
import './AdminDashboard.css';

const { Title, Text } = Typography;

interface AdminDashboardViewProps {
    stats: DashboardStats | null;
    loading: boolean;
    onNavigate: (view: string) => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ stats, loading, onNavigate }) => {
    if (loading) {
        return (
            <div className="dash-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Đang tải dữ liệu thống kê..." />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="dash-container">
                <AdminHeader placeholder="Tìm kiếm phân tích, người bán, hoặc báo cáo..." />
                <div style={{ marginTop: 50, textAlign: 'center' }}>
                    <Empty description="Không có dữ liệu khả dụng" />
                    <Button type="primary" onClick={() => window.location.reload()}>Thử lại</Button>
                </div>
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    // Prepare chart data (reverse if necessary as per guide)
    const chartData = [...stats.shopPerformanceMonthly].reverse().map(item => ({
        name: item.month,
        revenue: item.totalRevenue,
        orders: item.totalOrders,
        canceled: item.canceledOrders
    }));

    return (
        <div className="dash-container">
            <AdminHeader placeholder="Tìm kiếm phân tích, người bán, hoặc báo cáo..." />

            <div style={{ marginBottom: 32 }}>
                <Title level={3} style={{ margin: '0 0 8px 0' }}>Bảng Điều Khiển Quản Trị</Title>
                <Text type="secondary">Tổng quan về hiệu suất và các chỉ số chính của nền tảng</Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col span={6}>
                    <Card bordered={false} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div className="stat-icon-wrap" style={{ background: '#f6ffed' }}>
                                <DollarCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                            </div>
                            <Tag color="success" style={{ borderRadius: 12, height: 24, lineHeight: '22px' }}>
                                <ArrowUpOutlined /> GMV
                            </Tag>
                        </div>
                        <Text type="secondary" className="stat-label">Tổng Doanh Thu</Text>
                        <Title level={3} style={{ margin: '4px 0 0' }}>{formatCurrency(stats.totalRevenue)}</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div className="stat-icon-wrap" style={{ background: '#e6f7ff' }}>
                                <UsergroupAddOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                            </div>
                            <Tag color="blue" style={{ borderRadius: 12, height: 24, lineHeight: '22px' }}>Hoạt động</Tag>
                        </div>
                        <Text type="secondary" className="stat-label">Người bán hoạt động</Text>
                        <Title level={2} style={{ margin: '4px 0 0' }}>{formatNumber(stats.totalActiveSellers)}</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div className="stat-icon-wrap" style={{ background: '#f9f0ff' }}>
                                <ShopOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                            </div>
                            <Tag color={stats.cancellationRate > 5 ? 'error' : 'purple'} style={{ borderRadius: 12, height: 24, lineHeight: '22px' }}>
                                {stats.cancellationRate}%
                            </Tag>
                        </div>
                        <Text type="secondary" className="stat-label">Tỷ Lệ Hủy Đơn</Text>
                        <Title level={2} style={{ margin: '4px 0 0' }}>{stats.cancellationRate}%</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="stat-card" style={{ border: stats.pendingShopApprovals > 0 ? '1px solid #fff1f0' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div className="stat-icon-wrap" style={{ background: '#fff1f0' }}>
                                <AlertOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                            </div>
                            {stats.pendingShopApprovals > 0 && (
                                <Tag color="error" style={{ borderRadius: 12, height: 24, lineHeight: '22px' }}>
                                    {stats.pendingShopApprovals} Đang chờ
                                </Tag>
                            )}
                        </div>
                        <Text type="secondary" className="stat-label">Cần Phê Duyệt</Text>
                        <Title level={2} style={{ margin: '4px 0 0' }}>{stats.pendingShopApprovals}</Title>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col span={16}>
                    <Card bordered={false} className="chart-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <Title level={4} style={{ margin: 0 }}>Hiệu suất hàng tháng</Title>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Title level={2} style={{ margin: 0 }}>{formatCurrency(stats.totalRevenue)}</Title>
                                    <Text type="secondary">Tổng doanh thu trọn đời</Text>
                                </div>
                            </div>
                            <Space>
                                <Button size="small" type="primary" style={{ background: '#73d13d', color: '#fff', borderColor: '#73d13d' }}>Xem theo tháng</Button>
                            </Space>
                        </div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#73d13d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#73d13d" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1890ff" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                    <Tooltip
                                        formatter={(value: any, name: string | undefined) => [
                                            name === 'revenue' ? formatCurrency(value) : value,
                                            (name || '').charAt(0).toUpperCase() + (name || '').slice(1)
                                        ]}
                                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#73d13d" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="orders" stroke="#1890ff" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorOrders)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="top-sellers-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Title level={4} style={{ margin: 0 }}>Người bán hàng đầu</Title>
                            <Button type="link" size="small" style={{ color: '#52c41a' }} onClick={() => onNavigate('shops')}>Xem tất cả</Button>
                        </div>
                        <List
                            itemLayout="horizontal"
                            dataSource={stats.topSellers}
                            renderItem={(item, index) => (
                                <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '16px 0' }}>
                                    <List.Item.Meta
                                        avatar={
                                            <div style={{ position: 'relative' }}>
                                                <Avatar icon={<ShopOutlined />} shape="square" size={48} style={{ borderRadius: 8, backgroundColor: '#f0f2f5', color: '#52c41a' }} />
                                                <div className="rank-badge" style={{
                                                    background: index === 0 ? '#faad14' : index === 1 ? '#d9d9d9' : '#d48806'
                                                }}>
                                                    {index + 1}
                                                </div>
                                            </div>
                                        }
                                        title={<Text strong>{item.shopName}</Text>}
                                        description={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                                                <Text type="secondary">{formatNumber(item.totalUnitsSold)} đơn vị đã bán</Text>
                                            </div>
                                        }
                                    />
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold' }}>{formatCurrency(item.totalRevenue)}</div>
                                        <Tag color={item.status === 'APPROVED' ? 'success' : 'warning'} style={{ fontSize: 10, marginRight: 0 }}>
                                            {item.status === 'APPROVED' ? 'ĐÃ PHÊ DUYỆT' : 'CHỜ PHÊ DUYỆT'}
                                        </Tag>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboardView;
