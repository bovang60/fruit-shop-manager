import { useState, useEffect, useCallback } from "react";
import UserManagementView from "./UserManagementView";
import type { UserData, SortConfig } from "./UserManagementView";
import {
  getUsers,
  updateUserStatus,
  registerUser,
  getUserOrderHistory,
  type UserFilter,
  type UserStatus,
  type OrderDto,
} from "../../services/userService";
import { usePopup } from "../common/popup";
import { LoadingModal } from "../common/loading";

export default function UserManagement() {
  const { showSuccess, showError, showConfirm } = usePopup();
  // UI State
  const [viewMode, setViewMode] = useState<"LIST" | "DETAIL" | "ADD">("LIST");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(["email", "role", "status"]),
  );

  // API Data State
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  // Order History State
  const [userOrders, setUserOrders] = useState<OrderDto[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const filter: UserFilter = {
        search: searchQuery,
        status: statusFilter,
        role: roleFilter,
        page: page,
        size: pageSize,
        sort: sortConfig.key
          ? `${sortConfig.key},${sortConfig.direction}`
          : undefined,
      };

      const response = await getUsers(filter);

      if (response.resultCd === 0 && response.data) {
        const mappedUsers: UserData[] = response.data.content.map((u) => ({
          id: u.userId,
          name: u.fullName,
          username: u.email.split("@")[0], // Fallback username from email
          fullname: u.fullName,
          email: u.email,
          role: u.role as any,
          status: u.status as any,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=random`,
          phone: u.phoneNumber,
        }));
        setUsers(mappedUsers);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        showError(response.message || "Lỗi khi tải danh sách người dùng");
      }
    } catch (err) {
      showError("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    statusFilter,
    roleFilter,
    page,
    pageSize,
    sortConfig,
    showError,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleColumn = (col: string) => {
    setVisibleColumns((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev: boolean) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  const handleSort = (key: keyof UserData) => {
    setSortConfig((prev: SortConfig) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  const handleStatusChange = (id: number, status: string) => {
    const user = users.find((u) => u.id === id);
    const userName = user?.name || "người dùng";
    const userRole = user?.role;
    const apiStatus = status.toUpperCase() as UserStatus;

    let confirmMessage = "";
    let confirmTitle = "";

    if (apiStatus === "INACTIVE") {
      if (userRole === "SELLER") {
        confirmMessage = `Khóa người bán "${userName}" sẽ ẩn toàn bộ sản phẩm của shop và hủy các đơn hàng đang chờ xử lý. Bạn có chắc chắn?`;
      } else {
        confirmMessage = `Khóa tài khoản "${userName}"?`;
      }
      confirmTitle = "Xác nhận khóa tài khoản";
    } else {
      confirmMessage = `Kích hoạt lại tài khoản "${userName}"?`;
      confirmTitle = "Xác nhận kích hoạt";
    }

    showConfirm(
      confirmMessage,
      async () => {
        try {
          const response = await updateUserStatus(id, apiStatus);
          if (response.resultCd === 0) {
            showSuccess("Cập nhật trạng thái người dùng thành công!");
            fetchUsers();
            if (viewMode === "DETAIL") {
              setViewMode("LIST");
              setSelectedUser(null);
            }
          } else {
            showError(response.message || "Không thể cập nhật trạng thái");
          }
        } catch (err) {
          showError("Lỗi kết nối khi cập nhật trạng thái");
        }
      },
      confirmTitle,
    );
  };

  const handleViewDetail = async (user: UserData) => {
    setSelectedUser(user);
    setViewMode("DETAIL");
    // Fetch order history for this user
    setOrdersLoading(true);
    setUserOrders([]);
    try {
      const res = await getUserOrderHistory(user.id);
      if (res.resultCd === 0 && res.data) {
        setUserOrders(res.data);
      } else {
        showError(res.message || "Không thể tải lịch sử đơn hàng");
      }
    } catch {
      showError("Lỗi kết nối khi tải lịch sử đơn hàng");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleBackToList = () => {
    setViewMode("LIST");
    setSelectedUser(null);
    setUserOrders([]);
  };

  const handleAddUser = () => {
    setViewMode("ADD");
  };

  const handleSaveUser = async (data: any) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      if (response.resultCd === 0) {
        showSuccess("Thêm người dùng mới thành công!");
        setViewMode("LIST");
        fetchUsers();
      } else {
        showError(response.message || "Lỗi khi thêm người dùng");
      }
    } catch (err) {
      showError("Lỗi kết nối khi thêm người dùng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserManagementView
        users={users}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={(v: string) => {
          setSearchQuery(v);
          setPage(0); // Reset to first page on search
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(s: string) => {
          setStatusFilter(s);
          setPage(0);
        }}
        roleFilter={roleFilter}
        onRoleFilterChange={(r: string) => {
          setRoleFilter(r);
          setPage(0);
        }}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p: number) => setPage(p)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        onStatusChange={handleStatusChange}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        viewMode={viewMode}
        selectedUser={selectedUser}
        onViewDetail={handleViewDetail}
        onBackToList={handleBackToList}
        onAddUser={handleAddUser}
        onSaveUser={handleSaveUser}
        sortConfig={sortConfig}
        onSort={handleSort}
        userOrders={userOrders}
        ordersLoading={ordersLoading}
      />
      <LoadingModal
        isOpen={loading}
        message="Đang tải dữ liệu..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="blue"
      />
    </>
  );
}
