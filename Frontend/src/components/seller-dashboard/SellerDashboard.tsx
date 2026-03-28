import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../common/popup";
import {
  getUserOrders,
  confirmOrder,
  updateOrderStatus,
  type OrderDto,
} from "../../services/orderService";
import SellerDashboardView from "./SellerDashboardView";
import { LoadingModal } from "../common/loading";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { showNotice, showError, showConfirm } = usePopup();

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const userId = 3;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserOrders(userId);
      if (response.resultCd === 0 && response.data) {
        setOrders(response.data);
      } else {
        showError(response.message || "Could not load orders");
      }
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      showError("Connection error while loading orders");
    } finally {
      setLoading(false);
    }
  }, [showError, userId]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const handleConfirmOrder = (orderId: number) => {
    showConfirm("Confirm this order?", async () => {
      setActionLoading(true);
      try {
        const response = await confirmOrder(orderId, userId);
        if (response.resultCd === 0) {
          showNotice("Order confirmed successfully");
          void fetchOrders();
        } else {
          showError(response.message || "Could not confirm order");
        }
      } catch (error) {
        console.error("Error confirming order:", error);
        showError("Connection error while confirming order");
      } finally {
        setActionLoading(false);
      }
    });
  };

  const handleUpdateStatus = (orderId: number, status: string) => {
    showConfirm(`Update order status to ${status}?`, async () => {
      setActionLoading(true);
      try {
        const response = await updateOrderStatus(orderId, status, userId);
        if (response.resultCd === 0) {
          showNotice("Order status updated successfully");
          void fetchOrders();
        } else {
          showError(response.message || "Could not update order status");
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        showError("Connection error while updating order status");
      } finally {
        setActionLoading(false);
      }
    });
  };

  const handleOrderClick = (orderId: number) => {
    navigate(`/order-detail/${orderId}`);
  };

  return (
    <>
      <SellerDashboardView
        orders={orders}
        loading={loading}
        actionLoading={actionLoading}
        onConfirmOrder={handleConfirmOrder}
        onUpdateStatus={handleUpdateStatus}
        onOrderClick={handleOrderClick}
      />
      <LoadingModal
        isOpen={loading || actionLoading}
        message={actionLoading ? "Đang xử lý..." : "Đang tải đơn hàng..."}
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </>
  );
}
