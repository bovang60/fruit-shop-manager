import React, { useState, useEffect } from 'react';
import { callApi } from '../../utils/apiClient'; // Giả sử path này
import SellerDashboardView, { type DashboardStats, type RecentOrder } from './SellerDashboardView';

const SellerDashboard = ({ shopId }: { shopId: number }) => {
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        lowStockItems: 0
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Sử dụng callApi đã được cung cấp thay vì fetch thuần
                const statsRes = await callApi<null, { resultCd: number, data: DashboardStats }>(
                    `/api/seller/reports/${shopId}`
                );
                const ordersRes = await callApi<null, { resultCd: number, data: RecentOrder[] }>(
                    `/api/seller/orders/shop/${shopId}?limit=5`
                );

                if (statsRes.resultCd === 0) setStats(statsRes.data);
                if (ordersRes.resultCd === 0) setRecentOrders(ordersRes.data);
            } catch (error) {
                console.error("Dashboard load failed", error);
            } finally {
                // Giả lập delay 600ms theo checklist
                setTimeout(() => setIsLoading(false), 600);
            }
        };

        if (shopId) fetchDashboardData();
    }, [shopId]);

    return (
        <SellerDashboardView
            stats={stats}
            recentOrders={recentOrders}
            isLoading={isLoading}
        />
    );
};

export default SellerDashboard;