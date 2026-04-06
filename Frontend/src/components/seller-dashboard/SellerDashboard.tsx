import { useEffect, useState } from "react";
import { usePopup } from "../common/popup";
import SellerDashboardView, {
  type DashboardStats,
  type RecentOrder,
} from "./SellerDashboardView";
import {
  getSellerDashboardData,
  getSellerDashboardMessage,
} from "../../services/sellerDashboardService";
import {
  getOrderDisplayMessage,
  getSellerOrderById,
  type SellerOrderDto,
} from "../../services/sellerOrderService";

const SellerDashboard = ({ shopId }: { shopId: number }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<SellerOrderDto | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { showError } = usePopup();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await getSellerDashboardData(shopId);
        if (response.resultCd === 0 && response.data) {
          setStats(response.data.stats);
          setRecentOrders(response.data.recentOrders);
        } else {
          showError(
            getSellerDashboardMessage(
              response.message || "Không thể tải dữ liệu bảng điều khiển",
            ),
            "Lỗi",
          );
        }
      } catch (error) {
        console.error("Dashboard load failed", error);
        showError("Không thể kết nối đến hệ thống. Vui lòng thử lại.", "Lỗi");
      } finally {
        setIsLoading(false);
      }
    };

    if (shopId) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [shopId]);

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
      console.error("Load order detail failed", error);
      showError("Không thể tải chi tiết đơn hàng lúc này.", "Lỗi");
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <SellerDashboardView
      stats={stats}
      recentOrders={recentOrders}
      isLoading={isLoading}
      selectedOrder={selectedOrder}
      isDetailLoading={isDetailLoading}
      onViewDetail={handleViewDetail}
      onCloseDetail={() => setSelectedOrder(null)}
    />
  );
};

export default SellerDashboard;
