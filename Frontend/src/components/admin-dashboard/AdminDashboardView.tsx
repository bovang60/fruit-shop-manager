import React from 'react';
import { Card, Col, Row, List, Avatar, Typography, Tag, Button, Space } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    DollarCircleOutlined,
    ShopOutlined,
    UsergroupAddOutlined,
    AlertOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import AdminHeader from '../common/admin-header/AdminHeader';
import './AdminDashboard.css';

const { Title, Text } = Typography;

interface AdminDashboardViewProps {
    data: any[];
    topSellers: any[];
    onNavigate: (view: string) => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ data, topSellers, onNavigate }) => {
    return (
        <div className="dash-container">
            <AdminHeader placeholder="Search analytics, sellers, or reports..." />

            <div style={{ marginBottom: 32 }}>
                <Title level={3} style={{ margin: '0 0 8px 0' }}>Executive Dashboard</Title>
                <Text type="secondary">Overview of platform performance and key metrics</Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col span={6}>
                    <Card bordered={false} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div className="stat-icon-wrap" style={{ background: '#f6ffed' }}>
                                <DollarCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                            </div>
                            <Tag color="success" style={{ borderRadius: 12, height: 24, lineHeight: '22px' }}>+8.4%</Tag>
                        </div>
                        <Text type="secondary" className="stat-label">Total Revenue</Text>
                        <Title level={2} style={{ margin: '4px 0 0' }}>$1,240,500</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div className="stat-icon-wrap" style={{ background: '#e6f7ff' }}>
                                <UsergroupAddOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                            </div>
                            <Tag color="blue" style={{ borderRadius: 12, height: 24, lineHeight: '22px' }}>+2.1%</Tag>
                        </div>
                        <Text type="secondary" className="stat-label">Active Sellers</Text>
                        <Title level={2} style={{ margin: '4px 0 0' }}>1,450</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div className="stat-icon-wrap" style={{ background: '#f9f0ff' }}>
                                <ShopOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                            </div>
                            <Tag color="purple" style={{ borderRadius: 12, height: 24, lineHeight: '22px' }}>+1.5%</Tag>
                        </div>
                        <Text type="secondary" className="stat-label">Acquisition Rate</Text>
                        <Title level={2} style={{ margin: '4px 0 0' }}>12.5%</Title>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="stat-card" style={{ border: '1px solid #fff1f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div className="stat-icon-wrap" style={{ background: '#fff1f0' }}>
                                <AlertOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                            </div>
                            <Tag color="error" style={{ borderRadius: 12, height: 24, lineHeight: '22px' }}>34 Pending</Tag>
                        </div>
                        <Text type="secondary" className="stat-label">Needs Approval</Text>
                        <Title level={2} style={{ margin: '4px 0 0' }}>Action Req.</Title>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col span={16}>
                    <Card bordered={false} className="chart-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <Title level={4} style={{ margin: 0 }}>Revenue vs Expenses</Title>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Title level={2} style={{ margin: 0 }}>$840,200</Title>
                                    <Tag color="success" icon={<ArrowUpOutlined />}>5.2%</Tag>
                                </div>
                            </div>
                            <Space>
                                <Button size="small">7D</Button>
                                <Button size="small" type="primary" style={{ background: '#73d13d', color: '#fff', borderColor: '#73d13d' }}>30D</Button>
                                <Button size="small">90D</Button>
                            </Space>
                        </div>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#73d13d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#73d13d" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#73d13d" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="expenses" stroke="#ff4d4f" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorExpenses)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="top-sellers-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Title level={4} style={{ margin: 0 }}>Top Sellers</Title>
                            <Button type="link" size="small" style={{ color: '#52c41a' }} onClick={() => onNavigate('shops')}>View All</Button>
                        </div>
                        <List
                            itemLayout="horizontal"
                            dataSource={topSellers}
                            renderItem={(item, index) => (
                                <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '16px 0' }}>
                                    <List.Item.Meta
                                        avatar={
                                            <div style={{ position: 'relative' }}>
                                                <Avatar src={item.img} shape="square" size={48} style={{ borderRadius: 8 }} />
                                                <div className="rank-badge" style={{
                                                    background: index === 0 ? '#faad14' : index === 1 ? '#d9d9d9' : '#d48806'
                                                }}>
                                                    {index + 1}
                                                </div>
                                            </div>
                                        }
                                        title={<Text strong>{item.name}</Text>}
                                        description={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                                                <Text type="secondary">⭐ {item.rating}</Text>
                                                <Text type="secondary">({item.orders})</Text>
                                            </div>
                                        }
                                    />
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold' }}>{item.revenue}</div>
                                        <div style={{ color: item.growth.startsWith('+') ? '#52c41a' : '#ff4d4f', fontSize: 12 }}>
                                            {item.growth}
                                        </div>
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
