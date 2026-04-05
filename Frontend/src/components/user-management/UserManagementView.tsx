import { Link } from "react-router-dom";
import { AdminFrame, ADMIN_NAV_ITEMS } from "../common/admin-frame";
import "./UserManagement.css";

export type UserRole = "ADMIN" | "CUSTOMER" | "SELLER";
export type UserStatus = "ACTIVE" | "INACTIVE";

export type UserData = {
  id: number;
  name: string;
  username: string;
  fullname: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  phone: string;
};

export type SortDirection = "asc" | "desc" | null;

export type SortConfig = {
  key: keyof UserData | null;
  direction: SortDirection;
};

export type Props = {
  users: UserData[];
  loading: boolean;
  searchQuery: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onStatusChange: (id: number, status: string) => void;
  visibleColumns: Set<string>;
  onToggleColumn: (col: string) => void;
  viewMode: "LIST" | "DETAIL" | "ADD";
  selectedUser: UserData | null;
  onViewDetail: (user: UserData) => void;
  onBackToList: () => void;
  onAddUser: () => void;
  onSaveUser: (data: any) => void;
  sortConfig: SortConfig;
  onSort: (key: keyof UserData) => void;
};

export default function UserManagementView({
  users,
  loading,
  searchQuery,
  isSidebarCollapsed,
  onToggleSidebar,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onStatusChange,
  visibleColumns,
  onToggleColumn,
  viewMode,
  selectedUser,
  onViewDetail,
  onBackToList,
  onAddUser,
  onSaveUser,
  sortConfig,
  onSort,
}: Props) {
  const renderSortIcon = (key: keyof UserData) => {
    if (sortConfig.key !== key)
      return (
        <span className="material-symbols-outlined sort-icon-hidden">
          unfold_more
        </span>
      );
    if (sortConfig.direction === "asc")
      return (
        <span className="material-symbols-outlined sort-icon">expand_less</span>
      );
    if (sortConfig.direction === "desc")
      return (
        <span className="material-symbols-outlined sort-icon">expand_more</span>
      );
    return (
      <span className="material-symbols-outlined sort-icon-hidden">
        unfold_more
      </span>
    );
  };

  const renderListView = () => (
    <>
      <div className="page-header-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <nav className="breadcrumbs-modern">
              <Link to="/admin-dashboard">Bảng điều khiển</Link>
              <span className="material-symbols-outlined">chevron_right</span>
              <span className="current">Quản lý người dùng</span>
            </nav>
            <h1>Quản lý người dùng</h1>
            <p>
              Theo dõi và quản lý người dùng nền tảng, vai trò và quyền hạn tài
              khoản.
            </p>
          </div>
          <button className="btn-primary-admin" onClick={onAddUser}>
            <span className="material-symbols-outlined">person_add</span>
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="management-filter-section">
        <div className="filter-search-actions">
          <div className="modern-search-input-wrap">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="custom-dropdown-filters">
            <div className="filter-select-wrap">
              <select
                value={roleFilter}
                onChange={(e) => onRoleFilterChange(e.target.value)}
                className="modern-filter-select"
              >
                <option value="">Tất cả vai trò</option>
                <option value="CUSTOMER">Khách hàng</option>
                <option value="SELLER">Người bán</option>
              </select>
              <span className="material-symbols-outlined select-arrow">
                expand_more
              </span>
            </div>

            <div className="filter-select-wrap">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="modern-filter-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Trạng thái: Hoạt động</option>
                <option value="INACTIVE">Trạng thái: Khóa</option>
              </select>
              <span className="material-symbols-outlined select-arrow">
                expand_more
              </span>
            </div>
          </div>

          <div className="utility-actions">
            <div className="dropdown-container">
              <button className="btn-utility">
                <span className="material-symbols-outlined">tune</span>
                Cột hiển thị
              </button>
              <div className="column-toggle-dropdown">
                <div className="dropdown-header-title">Ẩn/Hiện cột</div>
                <div className="dropdown-body-options">
                  <div
                    className={`column-option-item ${visibleColumns.has("email") ? "is-selected" : ""}`}
                    onClick={() => onToggleColumn("email")}
                  >
                    <div className="checkmark-indicator">
                      <span className="material-symbols-outlined">check</span>
                    </div>
                    <span className="option-label">Email</span>
                  </div>
                  <div
                    className={`column-option-item ${visibleColumns.has("role") ? "is-selected" : ""}`}
                    onClick={() => onToggleColumn("role")}
                  >
                    <div className="checkmark-indicator">
                      <span className="material-symbols-outlined">check</span>
                    </div>
                    <span className="option-label">Role</span>
                  </div>
                  <div
                    className={`column-option-item ${visibleColumns.has("status") ? "is-selected" : ""}`}
                    onClick={() => onToggleColumn("status")}
                  >
                    <div className="checkmark-indicator">
                      <span className="material-symbols-outlined">check</span>
                    </div>
                    <span className="option-label">Trạng thái</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-card">
        <table className={`admin-table ${loading ? "table-loading" : ""}`}>
          <thead>
            <tr>
              <th onClick={() => onSort("name")} style={{ cursor: "pointer" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  Tên {renderSortIcon("name")}
                </div>
              </th>
              {visibleColumns.has("email") && (
                <th
                  onClick={() => onSort("email")}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Email {renderSortIcon("email")}
                  </div>
                </th>
              )}
              {visibleColumns.has("role") && (
                <th
                  onClick={() => onSort("role")}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Vai trò {renderSortIcon("role")}
                  </div>
                </th>
              )}
              {visibleColumns.has("status") && (
                <th
                  onClick={() => onSort("status")}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Trạng thái {renderSortIcon("status")}
                  </div>
                </th>
              )}
              <th style={{ textAlign: "center", width: "200px" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Đang tải người dùng...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Không tìm thấy người dùng.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="user-name-cell">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        className="user-avatar-small"
                        style={{
                          backgroundImage: `url(${u.avatar})`,
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundSize: "cover",
                        }}
                      ></div>
                      {u.name}
                    </div>
                  </td>
                  {visibleColumns.has("email") && (
                    <td style={{ color: "#4b5563" }}>{u.email}</td>
                  )}
                  {visibleColumns.has("role") && (
                    <td>
                      <span
                        className={`role-badge role-${u.role.toLowerCase()}`}
                      >
                        {u.role === "ADMIN"
                          ? "Quản trị"
                          : u.role === "SELLER"
                            ? "Người bán"
                            : "Khách hàng"}
                      </span>
                    </td>
                  )}
                  {visibleColumns.has("status") && (
                    <td>
                      <span
                        className={`status-chip status-${u.status.toLowerCase()}`}
                      >
                        {u.status === "ACTIVE" ? "Hoạt động" : "Khóa"}
                      </span>
                    </td>
                  )}
                  <td>
                    <div className="status-actions-group">
                      <button
                        className="icon-btn-action"
                        title="Xem chi tiết"
                        onClick={() => onViewDetail(u)}
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <div className="action-divider-vertical"></div>
                      {u.status === "ACTIVE" ? (
                        <button
                          className="action-status-btn deactivate"
                          onClick={() => onStatusChange(u.id, "INACTIVE")}
                          title="Khóa tài khoản"
                        >
                          Khóa
                        </button>
                      ) : (
                        <button
                          className="action-status-btn activate"
                          onClick={() => onStatusChange(u.id, "ACTIVE")}
                          title="Kích hoạt tài khoản"
                        >
                          Kích hoạt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="table-footer">
          <p className="footer-stats">
            Hiển thị {users.length} trên {totalElements} người dùng
          </p>
          <div className="pagination-group">
            <button
              className="page-btn"
              disabled={page === 0 || loading}
              onClick={() => onPageChange(page - 1)}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                chevron_left
              </span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <button
                key={p}
                className={`page-btn ${page === p ? "active" : ""}`}
                onClick={() => onPageChange(p)}
                disabled={loading}
              >
                {p + 1}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={page >= totalPages - 1 || loading}
              onClick={() => onPageChange(page + 1)}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderDetailView = (user: UserData) => (
    <div className="admin-modal-overlay" onClick={onBackToList}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Chi tiết người dùng</h2>
          <button
            className="admin-modal-close-btn"
            onClick={onBackToList}
            title="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div
          className="admin-modal-body"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            className="user-identity-card"
            style={{
              marginBottom: 0,
              padding: "1rem",
              gap: "1.5rem",
              boxShadow: "none",
            }}
          >
            <div
              className="user-avatar-large"
              style={{
                backgroundImage: `url(${user.avatar})`,
                width: "80px",
                height: "80px",
                borderRadius: "16px",
              }}
            ></div>
            <div className="user-identity-info">
              <div className="identity-title-row">
                <h2 className="user-name-title">{user.fullname}</h2>
                <span
                  className={`status-chip status-${user.status.toLowerCase()}`}
                >
                  {user.status === "ACTIVE" ? "Hoạt động" : "Khóa"}
                </span>
              </div>
              <div className="user-role-meta">
                <span className="material-symbols-outlined">verified_user</span>
                <span>
                  {user.role === "ADMIN"
                    ? "Quản trị"
                    : user.role === "SELLER"
                      ? "Người bán"
                      : "Khách hàng"}
                </span>
              </div>
            </div>
          </div>

          <div
            className="detail-section-card"
            style={{ marginBottom: 0, padding: "1rem", boxShadow: "none" }}
          >
            <div
              className="section-header-row"
              style={{
                marginBottom: "1.25rem",
                borderBottom: "1px solid #f4f6f8",
                paddingBottom: "0.75rem",
              }}
            >
              <h3
                className="section-title-label"
                style={{ margin: 0, fontSize: "0.875rem", color: "#637381" }}
              >
                Thông tin người dùng
              </h3>
            </div>
            <div className="section-content-body grid-info">
              <div className="info-group">
                <label>Tên đăng nhập</label>
                <p>{user.username}</p>
              </div>
              <div className="info-group">
                <label>Họ và tên</label>
                <p>{user.fullname}</p>
              </div>
              <div className="info-group">
                <label>Địa chỉ Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-group">
                <label>Số điện thoại</label>
                <p>{user.phone}</p>
              </div>
              <div className="info-group">
                <label>Vai trò tài khoản</label>
                <p>
                  {user.role === "ADMIN"
                    ? "Quản trị"
                    : user.role === "SELLER"
                      ? "Người bán"
                      : "Khách hàng"}
                </p>
              </div>
              <div className="info-group">
                <label>Trạng thái tài khoản</label>
                <p>{user.status === "ACTIVE" ? "Hoạt động" : "Khóa"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button className="btn-cancel-action" onClick={onBackToList}>
            Đóng
          </button>
          <button
            className={`btn-status-toggle ${user.status === "ACTIVE" ? "is-deactivate" : "is-activate"}`}
            onClick={() => {
              onStatusChange(
                user.id,
                user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              );
              onBackToList();
            }}
          >
            {user.status === "ACTIVE"
              ? "Khóa tài khoản"
              : "Kích hoạt tài khoản"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAddView = () => (
    <div className="admin-modal-overlay" onClick={onBackToList}>
      <div
        className="admin-modal-content"
        style={{ maxWidth: "500px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h2>Thêm người dùng mới</h2>
          <button
            className="admin-modal-close-btn"
            onClick={onBackToList}
            title="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSaveUser(Object.fromEntries(formData));
          }}
        >
          <div
            className="admin-modal-body"
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div className="form-group-modern">
              <label>Họ và tên</label>
              <input
                name="fullName"
                type="text"
                required
                placeholder="Nhập họ và tên"
                className="modern-input"
              />
            </div>
            <div className="form-group-modern">
              <label>Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="Nhập địa chỉ email"
                className="modern-input"
              />
            </div>
            <div className="form-group-modern">
              <label>Mật khẩu</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Nhập mật khẩu"
                className="modern-input"
              />
            </div>
            <div className="form-group-modern">
              <label>Số điện thoại</label>
              <input
                name="phoneNumber"
                type="tel"
                placeholder="Nhập số điện thoại"
                className="modern-input"
              />
            </div>
            <div className="form-group-modern">
              <label>Vai trò</label>
              <div className="filter-select-wrap" style={{ width: "100%" }}>
                <select
                  name="role"
                  required
                  className="modern-filter-select"
                  style={{ width: "100%" }}
                >
                  <option value="CUSTOMER">Khách hàng</option>
                  {/* <option value="SELLER">Người bán</option> */}
                </select>
                <span className="material-symbols-outlined select-arrow">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="btn-cancel-action"
              onClick={onBackToList}
            >
              Hủy
            </button>
            <button type="submit" className="btn-save-action">
              Lưu người dùng
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <AdminFrame
      sidebarItems={ADMIN_NAV_ITEMS}
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={onToggleSidebar}
      modalContent={
        viewMode === "DETAIL" && selectedUser
          ? renderDetailView(selectedUser)
          : viewMode === "ADD"
            ? renderAddView()
            : null
      }
    >
      {renderListView()}
    </AdminFrame>
  );
}
