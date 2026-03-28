import { useState, useEffect } from 'react';
import { callApi, callApiWithMethod } from '../../utils/apiClient'; // Tích hợp API Client
import { useResolvedShopId } from '../seller/useResolvedShopId';
import OrderManagerView, { type OrderData } from './OrderManagerView'; // Sử dụng type-only import

const OrderManager = ({ shopId }: { shopId: number }) => {
    const { shopId: resolvedShopId, isResolving } = useResolvedShopId(shopId);
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Tải danh sách đơn hàng của Shop
    const loadOrders = async () => {
        setIsLoading(true);
        try {
            // URL giả định dựa trên cấu trúc API mẫu
            const response = await callApi<null, { resultCd: number, data: OrderData[] }>(
                `/api/seller/orders/shop/${resolvedShopId}?status=${filterStatus}`
            );
            if (response.resultCd === 0 && Array.isArray(response.data)) {
                setOrders(
                    response.data.map((order) => ({
                        orderId: Number(order?.orderId || 0),
                        receiverName: order?.receiverName || 'N/A',
                        receiverPhone: order?.receiverPhone || 'N/A',
                        totalAmount: Number(order?.totalAmount || 0),
                        status: order?.status || 'PENDING',
                        createdAt: order?.createdAt || new Date().toISOString(),
                    }))
                );
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to load orders:", error);
            setOrders([]);
        } finally {
            // Delay 600ms theo checklist
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => {
        if (resolvedShopId) loadOrders();
        else if (!isResolving) setIsLoading(false);
    }, [resolvedShopId, filterStatus, isResolving]);

    // Cập nhật trạng thái đơn hàng (CONFIRMED, SHIPPING, v.v.)
    const handleUpdateStatus = async (orderId: number, nextStatus: string) => {
        try {
            const response = await callApiWithMethod<{ status: string }, { resultCd: number }>(
                'PATCH',
                `/api/seller/orders/${orderId}/status`,
                { status: nextStatus }
            );
            if (response.resultCd === 0) {
                loadOrders();
            }
        } catch (error) {
            alert("Lỗi khi cập nhật trạng thái đơn hàng.");
        }
    };

    return (
        <OrderManagerView
            orders={orders}
            isLoading={isLoading || isResolving}
            onUpdateStatus={handleUpdateStatus}
            onFilterChange={(s) => setFilterStatus(s)}
            currentFilter={filterStatus}
        />
    );
};

export default OrderManager;
