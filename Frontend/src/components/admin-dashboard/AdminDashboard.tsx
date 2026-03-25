import React, { useEffect, useState } from 'react';
import AdminDashboardView from './AdminDashboardView';
import { getDashboardStats, type DashboardStats } from '../../services/adminService';
import { usePopup } from '../common/popup';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = usePopup();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getDashboardStats();
        if (response.resultCd === 0 && response.data) {
          setStats(response.data);
        } else {
          showError(response.message || 'Failed to fetch dashboard statistics');
        }
      } catch (err) {
        showError('An error occurred while fetching dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showError]);

  return (
    <AdminDashboardView
      stats={stats}
      loading={loading}
      onNavigate={onNavigate}
    />
  );
};

export default AdminDashboard;
