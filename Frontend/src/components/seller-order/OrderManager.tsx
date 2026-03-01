import React, { useState, useEffect } from 'react';
import { callApi, callApiWithMethod } from '../../utils/apiClient'; // Tích hợp API Client
import OrderManagerView, { type OrderData } from './OrderManagerView'; // Sử dụng type-only import

const OrderManager = ({ shopId }: { shopId: number }) => {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Tải danh sách đơn hàng của Shop
    const loadOrders = async () => {
        setIsLoading(true);
        try {
            // URL giả định dựa trên cấu trúc API mẫu
            const response = await callApi<null, { resultCd: number, data: OrderData[] }>(
                `/api/seller/orders/shop/${shopId}?status=${filterStatus}`
            );
            if (response.resultCd === 0 && response.data) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            // Delay 600ms theo checklist
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => {
        if (shopId) loadOrders();
    }, [shopId, filterStatus]);

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
            isLoading={isLoading}
            onUpdateStatus={handleUpdateStatus}
            onFilterChange={(s) => setFilterStatus(s)}
            currentFilter={filterStatus}
        />
    );
};

export default OrderManager;