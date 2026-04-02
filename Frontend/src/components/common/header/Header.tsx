import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserFromStorage } from "../../../services/authService";
import { getSellerOrdersByShop } from "../../../services/sellerOrderService";
import type { SellerOrderDto } from "../../../services/sellerOrderService";
import HeaderView from "./HeaderView";
import { checkCanRegisterShop } from "../../../services/shopService";
import { usePopup } from "../popup/PopupProvider";
const SEEN_KEY = (shopId: number) => `notif_seen_${shopId}`;

export default function Header({
  hideProfile = false,
}: {
  hideProfile?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [isSeller, setIsSeller] = useState(false);
  const [shopId, setShopId] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<SellerOrderDto[]>([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { showNotice } = usePopup();

  // Load user info from localStorage
  useEffect(() => {
    const loadUserInfo = () => {
      const user = getUserFromStorage();
      if (user) {
        setUserAvatar(user.image);
        setUserName(user.fullName);
        setUserRole(user.role);
        const normalizedRole = String(user.role || "").toUpperCase();
        const hasSellerRole = normalizedRole.includes("SELLER");
        // Some accounts may carry shopId before role normalization is finalized.
        setIsSeller(hasSellerRole || Boolean(user.shopId));
        setShopId(user.shopId ?? null);
      } else {
        setUserAvatar(undefined);
        setUserName("");
        setUserRole("");
      }
    };

    loadUserInfo();

    // Listen for storage changes (when user updates avatar in another tab or after upload)
    const handleStorageChange = () => {
      loadUserInfo();
    };

    // Custom event for same-tab updates
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userUpdated", handleStorageChange);
    };
  }, []);

  const handleNavigateToProfile = () => {
    // if (isAdmin) {
    //   navigate("/admin-profile");
    //   return;
    // }
    navigate("/profile");
  };
  const handleNavigateToHome = () => navigate("/home");
  const handleNavigateToProducts = () => navigate("/products");
  const handleNavigateToOrders = () => navigate("/order-history");
  const handleNavigateToCart = () => {
    navigate("/cart");
  };
  // Poll for PENDING orders every 30 seconds when user is a seller with a shopId
  useEffect(() => {
    if (!isSeller || !shopId) return;

    const fetchPendingOrders = async () => {
      try {
        const response = await getSellerOrdersByShop(shopId, "PENDING");
        if (response.resultCd === 0 && response.data) {
          const orders = response.data;
          setPendingOrders(orders);

          const seen: number[] = JSON.parse(
            localStorage.getItem(SEEN_KEY(shopId)) || "[]",
          );
          const seenSet = new Set(seen);
          setNewOrderCount(
            orders.filter((o) => !seenSet.has(o.orderId)).length,
          );
        }
      } catch {
        // silently ignore - don't disrupt header on notification error
      }
    };

    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 30_000);
    return () => clearInterval(interval);
  }, [isSeller, shopId]);

  const handleNotifToggle = () => setIsNotifOpen((prev) => !prev);

  const handleMarkAllRead = () => {
    if (!shopId) return;
    const allIds = pendingOrders.map((o) => o.orderId);
    localStorage.setItem(SEEN_KEY(shopId), JSON.stringify(allIds));
    setNewOrderCount(0);
    setIsNotifOpen(false);
  };

  const handleNotifOrderClick = (orderId: number) => {
    if (shopId) {
      const seen: number[] = JSON.parse(
        localStorage.getItem(SEEN_KEY(shopId)) || "[]",
      );
      if (!seen.includes(orderId)) {
        seen.push(orderId);
        localStorage.setItem(SEEN_KEY(shopId), JSON.stringify(seen));
        setNewOrderCount((prev) => Math.max(0, prev - 1));
      }
    }
    setIsNotifOpen(false);
    navigate("/seller/orders");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigateToSellerRegistration = async () => {
    const user = getUserFromStorage();
    if (!user) {
      showNotice(
        "Vui lòng đăng nhập để đăng ký trở thành người bán",
        "Yêu cầu đăng nhập",
      );
      navigate("/login");
      return;
    }

    // Kiểm tra quyền đăng ký mở shop
    const canRegisterRes = await checkCanRegisterShop(user.userId);
    if (canRegisterRes.resultCd === 0) {
      if (canRegisterRes.data) {
        navigate("/register-shop");
      } else {
        showNotice(
          canRegisterRes.message ||
          "Bạn đã có shop hoặc đơn đăng ký đang chờ duyệt.",
          "Thông báo",
        );
      }
    } else {
      // Nếu API lỗi, vẫn cho vào trang đăng ký để trang đó tự xử lý lại
      navigate("/register-shop");
    }
  };

  const handleNavigateToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  const isAdmin = getUserFromStorage()?.role === "ADMIN";

  const handleNavigateToSellerPortal = () => {
    navigate("/seller/dashboard");
  };

  return (
    <HeaderView
      userAvatar={userAvatar}
      userName={userName}
      userRole={userRole}
      currentPath={location.pathname}
      isAdmin={isAdmin}
      onNavigateToHome={handleNavigateToHome}
      onNavigateToProducts={handleNavigateToProducts}
      onNavigateToOrders={handleNavigateToOrders}
      onNavigateToProfile={handleNavigateToProfile}
      onLogout={handleLogout}
      onNavigateToSellerRegistration={handleNavigateToSellerRegistration}
      onNavigateToCart={handleNavigateToCart}
      onNavigateToAdminDashboard={handleNavigateToAdminDashboard}
      hideProfile={hideProfile}
      onNavigateToSellerPortal={handleNavigateToSellerPortal}
      isSeller={isSeller}
      newOrderCount={newOrderCount}
      pendingOrders={pendingOrders}
      isNotifOpen={isNotifOpen}
      onNotifToggle={handleNotifToggle}
      onMarkAllRead={handleMarkAllRead}
      onNotifOrderClick={handleNotifOrderClick}
    />
  );
}
