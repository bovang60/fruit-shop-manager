import { useState, useEffect } from 'react';
import { callApi } from '../../utils/apiClient';
import { useResolvedShopId } from '../seller/useResolvedShopId';
import SellerDashboardView, { type DashboardStats, type RecentOrder } from './SellerDashboardView';

const SellerDashboard = ({ shopId }: { shopId: number }) => {
    const { shopId: resolvedShopId, isResolving } = useResolvedShopId(shopId);
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        lowStockItems: 0
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const normalizeStats = (data: Partial<DashboardStats> | null | undefined): DashboardStats => ({
            totalRevenue: Number(data?.totalRevenue || 0),
            totalOrders: Number(data?.totalOrders || 0),
            pendingOrders: Number(data?.pendingOrders || 0),
            lowStockItems: Number(data?.lowStockItems || 0),
        });

        const normalizeOrders = (data: RecentOrder[] | null | undefined): RecentOrder[] =>
            Array.isArray(data)
                ? data.map((order) => ({
                    orderId: Number(order?.orderId || 0),
                    receiverName: order?.receiverName || 'N/A',
                    subTotal: Number(order?.subTotal || 0),
                    status: order?.status || 'PENDING',
                }))
                : [];

        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const statsRes = await callApi<null, { resultCd: number, data: DashboardStats }>(
                    `/api/seller/reports/${resolvedShopId}`
                );
                const ordersRes = await callApi<null, { resultCd: number, data: RecentOrder[] }>(
                    `/api/seller/orders/shop/${resolvedShopId}?limit=5`
                );

                setStats(statsRes.resultCd === 0 ? normalizeStats(statsRes.data) : normalizeStats(null));
                setRecentOrders(ordersRes.resultCd === 0 ? normalizeOrders(ordersRes.data) : []);
            } catch (error) {
                console.error("Dashboard load failed", error);
                setStats(normalizeStats(null));
                setRecentOrders([]);
            } finally {
                setTimeout(() => setIsLoading(false), 600);
            }
        };

        if (resolvedShopId) fetchDashboardData();
        else if (!isResolving) setIsLoading(false);
    }, [resolvedShopId, isResolving]);

    return (
        <SellerDashboardView
            stats={stats}
            recentOrders={recentOrders}
            isLoading={isLoading || isResolving}
        />
    );
};

export default SellerDashboard;
