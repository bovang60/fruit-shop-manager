import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePopup } from '../common/popup';
import { getOrderDetail, cancelOrder, completeOrder, type OrderDto } from '../../services/orderService';
import { getUserFromStorage } from '../../services/authService';
import OrderDetailView from './OrderDetailView';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const { showNotice, showError, showConfirm } = usePopup();

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const user = getUserFromStorage();
  const userId = user?.userId || 0; // Fallback so we don't crash, but auth should handle this

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const response = await getOrderDetail(Number(orderId), userId);
      if (response.resultCd === 0 && response.data) {
        setOrder(response.data);
      } else {
        showError(response.message || 'Could not load order details');
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      showError('Connection error while loading order details');
    } finally {
      setLoading(false);
    }
  }, [orderId, showError, userId]);

  useEffect(() => {
    void fetchOrderDetail();
  }, [fetchOrderDetail]);

  const handleCancelOrder = () => {
    if (!order) return;
    showConfirm('Are you sure you want to cancel this order?', async () => {
      setActionLoading(true);
      try {
        const response = await cancelOrder(order.orderId, userId);
        if (response.resultCd === 0) {
          showNotice('Order cancelled successfully');
          fetchOrderDetail();
        } else {
          showError(response.message || 'Could not cancel order');
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        showError('Connection error while cancelling order');
      } finally {
        setActionLoading(false);
      }
    });
  };

  const handleCompleteOrder = () => {
    if (!order) return;
    showConfirm('Confirm order completion?', async () => {
      setActionLoading(true);
      try {
        const response = await completeOrder(order.orderId, userId);
        if (response.resultCd === 0) {
          showNotice('Order marked as completed');
          fetchOrderDetail();
        } else {
          showError(response.message || 'Could not complete order');
        }
      } catch (error) {
        console.error('Error completing order:', error);
        showError('Connection error while completing order');
      } finally {
        setActionLoading(false);
      }
    });
  };

  return (
    <OrderDetailView
      order={order}
      loading={loading}
      actionLoading={actionLoading}
      onCancelOrder={handleCancelOrder}
      onCompleteOrder={handleCompleteOrder}
    />
  );
}
