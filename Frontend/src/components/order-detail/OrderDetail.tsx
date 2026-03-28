import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePopup } from '../common/popup';
import { getOrderDetail, cancelOrder, completeOrder, type OrderDto } from '../../services/orderService';
import { getUserFromStorage } from '../../services/authService';
import { createFeedback, updateFeedback, getFeedbackByProduct, type FeedbackDto } from '../../services/feedbackService';
import OrderDetailView from './OrderDetailView';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const { showNotice, showError, showConfirm } = usePopup();

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  
  // Feedback state: map of productId -> FeedbackDto
  const [feedbacks, setFeedbacks] = useState<Record<number, FeedbackDto>>({});

  const user = getUserFromStorage();
  const userId = user?.userId || 0;

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const response = await getOrderDetail(Number(orderId), userId);
      if (response.resultCd === 0 && response.data) {
        setOrder(response.data);
      } else {
        showError(response.message || 'Không thể tải chi tiết đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      showError('Lỗi kết nối khi tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [orderId, showError, userId]);

  useEffect(() => {
    void fetchOrderDetail();
  }, [fetchOrderDetail]);

  // Load existing feedbacks if DELIVERED or COMPLETED
  useEffect(() => {
    const status = order?.status?.toUpperCase();
    if (order && (status === 'DELIVERED' || status === 'COMPLETED') && order.items) {
      const loadFeedbacks = async () => {
        const newFeedbacks: Record<number, FeedbackDto> = { ...feedbacks };
        let hasUpdates = false;
        
        await Promise.all(
          (order.items || []).map(async (item) => {
            const res = await getFeedbackByProduct(item.productId);
            if (res.resultCd === 0 && res.data) {
              // Try to find a feedback that matches this order or user.
              const existing = res.data.find(f => 
                (f.orderId && f.orderId === order.orderId) || 
                (!f.orderId && f.userName === user?.fullName) // Fallback heuristic
              );
              if (existing) {
                newFeedbacks[item.productId] = existing;
                hasUpdates = true;
              }
            }
          })
        );
        
        if (hasUpdates) {
          setFeedbacks(newFeedbacks);
        }
      };
      
      void loadFeedbacks();
    }
  }, [order, user?.fullName]);

  const handleCancelOrder = () => {
    if (!order) return;
    showConfirm('Bạn có chắc chắn muốn hủy đơn hàng này?', async () => {
      setActionLoading(true);
      try {
        const response = await cancelOrder(order.orderId, userId);
        if (response.resultCd === 0) {
          showNotice('Đã hủy đơn hàng thành công');
          fetchOrderDetail();
        } else {
          showError(response.message || 'Không thể hủy đơn hàng');
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        showError('Lỗi kết nối khi hủy đơn hàng');
      } finally {
        setActionLoading(false);
      }
    });
  };

  const handleCompleteOrder = () => {
    if (!order) return;
    showConfirm('Xác nhận hoàn thành đơn hàng?', async () => {
      setActionLoading(true);
      try {
        const response = await completeOrder(order.orderId, userId);
        if (response.resultCd === 0) {
          showNotice('Đơn hàng đã được hoàn thành');
          fetchOrderDetail();
        } else {
          showError(response.message || 'Không thể hoàn thành đơn hàng');
        }
      } catch (error) {
        console.error('Error completing order:', error);
        showError('Lỗi kết nối khi hoàn thành đơn hàng');
      } finally {
        setActionLoading(false);
      }
    });
  };

  const handleFeedbackSubmit = async (productId: number, rating: number, comment: string, existingFeedbackId?: number) => {
    if (!order || !userId) return;
    
    setActionLoading(true);
    try {
      const request = {
        orderId: order.orderId,
        productId,
        rating,
        comment
      };
      
      let res;
      if (existingFeedbackId) {
        res = await updateFeedback(userId, existingFeedbackId, request);
      } else {
        res = await createFeedback(userId, request);
      }
      
      if (res.resultCd === 0 && res.data) {
        showNotice(existingFeedbackId ? 'Cập nhật đánh giá thành công' : 'Gửi đánh giá thành công');
        setFeedbacks(prev => ({
          ...prev,
          [productId]: res.data!
        }));
      } else if (res.resultCd === 409) {
        showError('Bạn đã đánh giá sản phẩm này cho đơn hàng này rồi.');
      } else {
        showError(res.message || 'Không thể gửi đánh giá');
      }
    } catch (e) {
      showError('Đã xảy ra lỗi hệ thống khi gửi đánh giá.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <OrderDetailView
      order={order}
      loading={loading}
      actionLoading={actionLoading}
      feedbacks={feedbacks}
      onCancelOrder={handleCancelOrder}
      onCompleteOrder={handleCompleteOrder}
      onFeedbackSubmit={handleFeedbackSubmit}
    />
  );
}
