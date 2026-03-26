import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../common/popup';
import { getUserOrders, type OrderDto } from '../../services/orderService';
import { getUserFromStorage } from '../../services/authService';
import OrderHistoryView from './OrderHistoryView';

export default function OrderHistory() {
  const navigate = useNavigate();
  const { showError } = usePopup();

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const user = getUserFromStorage();
  const userId = user?.userId;

  const fetchOrders = useCallback(async () => {
      if (!userId) {
        setLoading(false);
        showError('Vui lòng đăng nhập để xem đơn hàng');
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const response = await getUserOrders(userId);
        if (response.resultCd === 0 && response.data) {
          setOrders(response.data);
        } else {
          showError(response.message || 'Could not load order history');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        showError('Connection error while loading order history');
      } finally {
        setLoading(false);
      }
    }, [showError, userId]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const handleOrderClick = (orderId: number) => {
    navigate(`/order-detail/${orderId}`);
  };

  return (
    <OrderHistoryView
      orders={orders}
      loading={loading}
      onOrderClick={handleOrderClick}
    />
  );
}
