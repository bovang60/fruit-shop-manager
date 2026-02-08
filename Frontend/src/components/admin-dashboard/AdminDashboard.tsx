import React from 'react';
import AdminDashboardView from './AdminDashboardView';

const data = [
  { name: 'Week 1', revenue: 4000, expenses: 2400 },
  { name: 'Week 2', revenue: 3000, expenses: 1398 },
  { name: 'Week 3', revenue: 5000, expenses: 3800 },
  { name: 'Week 4', revenue: 6500, expenses: 3908 },
  { name: 'Week 5', revenue: 7000, expenses: 4800 },
  { name: 'Week 6', revenue: 8500, expenses: 5800 },
  { name: 'Week 7', revenue: 10000, expenses: 6300 },
];

const topSellers = [
  { name: 'Green Valley Farm', revenue: '$42,500', orders: '2k+ orders', growth: '+12%', rating: 4.9, img: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80' },
  { name: 'Citrus Prime Market', revenue: '$38,120', orders: '1.5k orders', growth: '+8%', rating: 4.8, img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80' },
  { name: 'Tropical Express', revenue: '$29,400', orders: '980 orders', growth: '-2%', rating: 4.7, img: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80' },
  { name: 'Berry Direct', revenue: '$27,050', orders: '1.2k orders', growth: '+5.4%', rating: 4.6, img: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80' },
];

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  // Logic and state would go here

  return (
    <AdminDashboardView
      data={data}
      topSellers={topSellers}
      onNavigate={onNavigate}
    />
  );
};

export default AdminDashboard;
