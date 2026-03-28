import React, { useEffect, useState } from "react";
import { usePopup } from "../common/popup";
import {
    getOrderDisplayMessage,
    getSellerOrderById,
    getSellerOrdersByShop,
    updateSellerOrderStatus,
    type OrderFilterStatus,
    type OrderStatus,
    type SellerOrderDto,
} from "../../services/sellerOrderService";
import OrderManagerView from "./OrderManagerView";

const OrderManager = ({ shopId }: { shopId: number }) => {
    const storedShopId = Number(localStorage.getItem("shopId") || 0);
    const effectiveShopId = shopId || storedShopId;
    const [orders, setOrders] = useState<SellerOrderDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<OrderFilterStatus>("ALL");
    const [selectedOrder, setSelectedOrder] = useState<SellerOrderDto | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const { showConfirm, showError, showNotice } = usePopup();

    // Tải danh sách đơn hàng của Shop
    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const response = await getSellerOrdersByShop(effectiveShopId, filterStatus);
            if (response.resultCd === 0 && response.data) {
                setOrders(response.data);
            } else {
                showError(
                    getOrderDisplayMessage(
                        response.message || "Không thể tải danh sách đơn hàng",
                    ),
                    "Lỗi",
                );
            }
        } catch (error) {
            console.error("Failed to load orders:", error);
            showError("Không thể kết nối đến hệ thống. Vui lòng thử lại.", "Lỗi");
        } finally {
            // Delay 600ms theo checklist
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => {
        if (effectiveShopId) loadOrders();
    }, [effectiveShopId, filterStatus]);

    const handleViewDetail = async (orderId: number) => {
        setIsDetailLoading(true);
        try {
            const response = await getSellerOrderById(orderId);
            if (response.resultCd === 0 && response.data) {
                setSelectedOrder(response.data);
            } else {
                showError(
                    getOrderDisplayMessage(
                        response.message || "Không thể tải chi tiết đơn hàng",
                    ),
                    "Lỗi",
                );
            }
        } catch (error) {
            console.error("Failed to load order detail:", error);
            showError("Không thể tải chi tiết đơn hàng lúc này.", "Lỗi");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleCloseDetail = () => {
        setSelectedOrder(null);
    };

    // Cập nhật trạng thái đơn hàng (CONFIRMED, SHIPPING, v.v.)
    const handleUpdateStatus = async (orderId: number, nextStatus: string) => {
        showConfirm(
            "Bạn có chắc muốn cập nhật trạng thái đơn hàng này?",
            async () => {
                try {
                    const response = await updateSellerOrderStatus(
                        orderId,
                        nextStatus as OrderStatus,
                    );
                    if (response.resultCd === 0) {
                        showNotice("Cập nhật trạng thái đơn hàng thành công!", "Thành công");
                        await loadOrders();
                    } else {
                        showError(
                            getOrderDisplayMessage(
                                response.message || "Không thể cập nhật trạng thái đơn hàng",
                            ),
                            "Lỗi",
                        );
                    }
                } catch (error) {
                    console.error("Failed to update order status:", error);
                    showError("Không thể cập nhật trạng thái đơn hàng lúc này.", "Lỗi");
                }
            },
            "Xác nhận",
        );
    };

    return (
        <OrderManagerView
            orders={orders}
            isLoading={isLoading}
            selectedOrder={selectedOrder}
            isDetailLoading={isDetailLoading}
            onViewDetail={handleViewDetail}
            onCloseDetail={handleCloseDetail}
            onUpdateStatus={handleUpdateStatus}
            onFilterChange={(status) => setFilterStatus(status as OrderFilterStatus)}
            currentFilter={filterStatus}
        />
    );
};

export default OrderManager;
