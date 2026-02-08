import { useState } from 'react';
import AdminDashboard from "./components/admin-dashboard/AdminDashboard";
import UserManagement from "./components/user-management/UserManagement";
import ShopManagement from "./components/shop-management/ShopManagement";
import CategoryManagement from "./components/category-management/CategoryManagement";
import SystemSettings from "./components/system-settings/SystemSettings";
import Home from './components/home-page/Home';
import './App.css';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Content, Sider } = Layout;

function App() {
  const [view, setView] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <AdminDashboard onNavigate={setView} />;
      case 'users': return <UserManagement />;
      case 'shops': return <ShopManagement />;
      case 'categories': return <CategoryManagement />;
      case 'settings': return <SystemSettings />;
      default: return <Home />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: !collapsed ? 'space-between' : 'center', padding: '16px 24px', height: 64, borderBottom: '1px solid #f0f0f0' }}>
          {!collapsed && (
            <div style={{ fontWeight: 'bold', fontSize: 18, color: '#52c41a', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              FruitShop
            </div>
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 32,
              height: 32,
              color: '#333'
            }}
          />
        </div>
        <Menu theme="light" defaultSelectedKeys={['dashboard']} mode="inline" onClick={(e) => setView(e.key)}
          style={{ borderRight: 0 }}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: 'users', icon: <UserOutlined />, label: 'User Management' },
            { key: 'shops', icon: <ShopOutlined />, label: 'Shop Management' },
            { key: 'categories', icon: <AppstoreOutlined />, label: 'Category Management' },
            { key: 'settings', icon: <SettingOutlined />, label: 'System Settings' },
          ]}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: 0 }}>
          {renderView()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
