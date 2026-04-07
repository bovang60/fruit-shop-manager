import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { SortConfig } from "./CategoryManagement";
import { AdminFrame, ADMIN_NAV_ITEMS } from "../common/admin-frame";
import "./CategoryManagement.css";

export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount: number;
  totalStock: number;
  status: "Active" | "Inactive";
}

interface CategoryManagementViewProps {
  categories: Category[];
  searchQuery: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  viewMode: "LIST" | "CREATE" | "EDIT";
  setViewMode: (mode: "LIST" | "CREATE" | "EDIT") => void;
  onSave: (values: {
    name: string;
    status: "Active" | "Inactive";
    description: string;
  }) => void;
  onUpdate: (
    id: number,
    values: {
      name: string;
      status: "Active" | "Inactive";
      description: string;
    },
  ) => void;
  onEdit: (id: number) => void;
  currentCategory?: Category | null;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number, name: string) => void;
  onToggleStatus: (id: number) => void;
  loading?: boolean;
}

const CategoryManagementView: React.FC<CategoryManagementViewProps> = ({
  categories,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isSidebarCollapsed,
  onToggleSidebar,
  sortConfig,
  onSort,
  viewMode,
  setViewMode,
  onSave,
  onUpdate,
  onEdit,
  currentCategory,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onDelete,
  onToggleStatus,
  loading = false,
}) => {
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState<"Active" | "Inactive">("Active");
  const [newDescription, setNewDescription] = useState("");

  React.useEffect(() => {
    if (viewMode === "EDIT" && currentCategory) {
      setNewName(currentCategory.name);
      setNewStatus(currentCategory.status);
      setNewDescription(currentCategory.description || "");
    } else if (viewMode === "CREATE") {
      setNewName("");
      setNewStatus("Active");
      setNewDescription("");
    }
  }, [viewMode, currentCategory]);

  const renderSortIcon = (key: string) => {
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
        <nav className="breadcrumbs-modern">
          <Link to="/admin-dashboard">Dashboard</Link>
          <span className="material-symbols-outlined">chevron_right</span>
          <span className="current">Quản Lý Danh Mục</span>
        </nav>
        <h1>Quản Lý Danh Mục</h1>
        <p>Quản lý phân loại danh mục cho thị trường trái cây.</p>
      </div>

      <div className="management-filter-section">
        <div className="filter-search-actions">
          <div className="modern-search-input-wrap">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Tìm kiếm danh mục theo tên..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="custom-dropdown-filters">
            <div className="filter-select-wrap">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="modern-filter-select"
              >
                <option value="">Tất Cả Trạng Thái</option>
                <option value="ACTIVE">Trạng Thái: Đang Hoạt Động</option>
                <option value="INACTIVE">Trạng Thái: Ngừng Hoạt Động</option>
              </select>
              <span className="material-symbols-outlined select-arrow">
                expand_more
              </span>
            </div>
          </div>

          <button
            className="btn-primary-admin"
            onClick={() => setViewMode("CREATE")}
          >
            <span className="material-symbols-outlined">add</span>
            Thêm Danh Mục
          </button>
        </div>
      </div>

      <div className="table-card">
        <table className={`admin-table ${loading ? "table-loading" : ""}`}>
          <thead>
            <tr>
              <th onClick={() => onSort("name")} style={{ cursor: "pointer" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  Tên Danh Mục {renderSortIcon("name")}
                </div>
              </th>
              <th
                onClick={() => onSort("productCount")}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  Số Sản Phẩm {renderSortIcon("totalStock")}
                </div>
              </th>
              <th>Trạng Thái</th>
              <th style={{ textAlign: "center", width: "120px" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Đang tải...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Không tìm thấy danh mục nào.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  style={{ opacity: cat.status === "Inactive" ? 0.5 : 1 }}
                >
                  <td>
                    <span style={{ fontWeight: 700 }}>{cat.name}</span>
                  </td>
                  <td>{cat.totalStock ?? 0} sản phẩm</td>
                  <td>
                    <span
                      className={`status-chip status-${cat.status.toLowerCase()}`}
                    >
                      {cat.status === "Active" ? "Hoạt động" : "Khóa"}
                    </span>
                  </td>
                  <td>
                    <div className="status-actions-group">
                      <button
                        className="icon-btn-action"
                        disabled={cat.totalStock > 0}
                        style={{
                          opacity: cat.totalStock > 0 ? 0.5 : 1,
                          cursor:
                            cat.totalStock > 0 ? "not-allowed" : "pointer",
                        }}
                        title={
                          cat.totalStock > 0
                            ? "Không thể chỉnh sửa khi còn tồn kho"
                            : cat.status === "Active"
                              ? "Ngừng hoạt động"
                              : "Kích hoạt"
                        }
                        onClick={() => onToggleStatus(cat.id)}
                      >
                        <span className="material-symbols-outlined">
                          {cat.status === "Active"
                            ? "visibility"
                            : "visibility_off"}
                        </span>
                      </button>
                      <button
                        className="icon-btn-action"
                        title="Xem sản phẩm"
                        onClick={() => navigate(`/category-management/${cat.id}/products`)}
                      >
                        <span className="material-symbols-outlined">inventory_2</span>
                      </button>
                      <div className="action-divider-vertical"></div>
                      <button
                        className="icon-btn-action"
                        disabled={cat.totalStock > 0}
                        style={{
                          opacity: cat.totalStock > 0 ? 0.5 : 1,
                          cursor:
                            cat.totalStock > 0 ? "not-allowed" : "pointer",
                        }}
                        title={
                          cat.totalStock > 0
                            ? "Không thể chỉnh sửa khi còn tồn kho"
                            : "Chỉnh sửa"
                        }
                        onClick={() => onEdit(cat.id)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <div className="action-divider-vertical"></div>
                      <button
                        className="icon-btn-action"
                        disabled={cat.totalStock > 0}
                        style={{
                          color: cat.totalStock > 0 ? "#d1d5db" : "#ef4444",
                          opacity: cat.totalStock > 0 ? 0.5 : 1,
                          cursor:
                            cat.totalStock > 0 ? "not-allowed" : "pointer",
                        }}
                        title={
                          cat.totalStock > 0
                            ? "Không thể xóa khi còn tồn kho"
                            : "Xóa danh mục"
                        }
                        onClick={() => onDelete(cat.id, cat.name)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="table-footer">
          <p className="footer-stats">
            Hiển thị {categories.length} / {totalElements} danh mục
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

  const renderCreateView = () => (
    <div className="admin-modal-overlay" onClick={() => setViewMode("LIST")}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Tạo Danh Mục Mới</h2>
          <button
            className="admin-modal-close-btn"
            onClick={() => setViewMode("LIST")}
            title="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div
          className="admin-modal-body"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div className="info-group">
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#637381",
                fontSize: "0.75rem",
              }}
            >
              TÊN DANH MỤC
            </label>
            <input
              type="text"
              className="modern-search-input-wrap"
              style={{
                padding: "0 0.75rem",
                fontSize: "0.875rem",
                background: "#f4f6f8",
                border: "1px solid transparent",
                borderRadius: "10px",
                height: "48px",
                width: "100%",
              }}
              placeholder="vd: Trái Cây Nhiệt Đới"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="info-group">
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#637381",
                fontSize: "0.75rem",
              }}
            >
              MÔ TẢ
            </label>
            <textarea
              className="modern-search-input-wrap"
              style={{
                padding: "0.75rem",
                fontSize: "0.875rem",
                background: "#f4f6f8",
                border: "1px solid transparent",
                borderRadius: "10px",
                minHeight: "120px",
                width: "100%",
                resize: "vertical",
                display: "block",
              }}
              placeholder="Viết mô tả ngắn cho danh mục này..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <div className="info-group">
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#637381",
                fontSize: "0.75rem",
              }}
            >
              TRẠNG THÁI
            </label>
            <select
              className="modern-search-input-wrap"
              style={{
                padding: "0 0.75rem",
                fontSize: "0.875rem",
                appearance: "auto",
                background: "#f4f6f8",
                border: "1px solid transparent",
                borderRadius: "10px",
                height: "48px",
                width: "100%",
              }}
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as "Active" | "Inactive")
              }
            >
              <option value="Active">Đang Hoạt Động</option>
              <option value="Inactive">Ngừng Hoạt Động</option>
            </select>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button
            className="btn-cancel-action"
            onClick={() => setViewMode("LIST")}
          >
            Hủy
          </button>
          <button
            className="btn-status-toggle is-activate"
            onClick={() =>
              onSave({
                name: newName,
                status: newStatus,
                description: newDescription,
              })
            }
          >
            Lưu Danh Mục
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditView = () => (
    <div className="admin-modal-overlay" onClick={() => setViewMode("LIST")}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Chỉnh Sửa Danh Mục</h2>
          <button
            className="admin-modal-close-btn"
            onClick={() => setViewMode("LIST")}
            title="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div
          className="admin-modal-body"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div className="info-group">
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#637381",
                fontSize: "0.75rem",
              }}
            >
              TÊN DANH MỤC
            </label>
            <input
              type="text"
              className="modern-search-input-wrap"
              style={{
                padding: "0 0.75rem",
                fontSize: "0.875rem",
                background: "#f4f6f8",
                border: "1px solid transparent",
                borderRadius: "10px",
                height: "48px",
                width: "100%",
              }}
              placeholder="vd: Trái Cây Nhiệt Đới"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="info-group">
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#637381",
                fontSize: "0.75rem",
              }}
            >
              MÔ TẢ
            </label>
            <textarea
              className="modern-search-input-wrap"
              style={{
                padding: "0.75rem",
                fontSize: "0.875rem",
                background: "#f4f6f8",
                border: "1px solid transparent",
                borderRadius: "10px",
                minHeight: "120px",
                width: "100%",
                resize: "vertical",
                display: "block",
              }}
              placeholder="Viết mô tả ngắn cho danh mục này..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <div className="info-group">
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 600,
                color: "#637381",
                fontSize: "0.75rem",
              }}
            >
              TRẠNG THÁI
            </label>
            <select
              className="modern-search-input-wrap"
              style={{
                padding: "0 0.75rem",
                fontSize: "0.875rem",
                appearance: "auto",
                background: "#f4f6f8",
                border: "1px solid transparent",
                borderRadius: "10px",
                height: "48px",
                width: "100%",
              }}
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as "Active" | "Inactive")
              }
            >
              <option value="Active">Đang Hoạt Động</option>
              <option value="Inactive">Ngừng Hoạt Động</option>
            </select>
          </div>
        </div>

        <div className="detail-action-footer">
          <button
            className="btn-cancel-action"
            onClick={() => setViewMode("LIST")}
          >
            Hủy
          </button>
          <button
            className="btn-status-toggle is-activate"
            onClick={() =>
              currentCategory &&
              onUpdate(currentCategory.id, {
                name: newName,
                status: newStatus,
                description: newDescription,
              })
            }
            disabled={loading}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật danh mục"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminFrame
      sidebarItems={ADMIN_NAV_ITEMS}
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={onToggleSidebar}
      modalContent={
        viewMode === "CREATE" ? (
          renderCreateView()
        ) : viewMode === "EDIT" ? (
          renderEditView()
        ) : null
      }
    >
      {renderListView()}
    </AdminFrame>
  );
};

export default CategoryManagementView;
