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

const SellerDashboard = ({ shopId }: { shopId: number }) => {
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        lowStockItems: 0
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
