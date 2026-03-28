import React, { useState } from "react";
import CategoryManagementView from "./CategoryManagementView";
import type { Category } from "./CategoryManagementView";
import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  type CategoryDto,
} from "../../services/categoryService";
// import { usePopup } from "../common/popup/PopupProvider";
import { LoadingModal } from "../common/loading";

import { usePopup } from "../common/popup";

export type SortDirection = "asc" | "desc" | null;

export type SortConfig = {
  key: string | null;
  direction: SortDirection;
};

const CategoryManagement: React.FC = () => {
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [viewMode, setViewMode] = useState<"LIST" | "CREATE" | "EDIT">("LIST");

  // Pagination State
  const [page, setPage] = useState(0);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const { showNotice, showError, showConfirm } = usePopup();

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const filter: any = {
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        page: page,
        size: 10,
      };

      if (sortConfig.key) {
        if (sortConfig.key === "name") {
          filter.sort = `categoryName,${sortConfig.direction}`;
        } else if (sortConfig.key === "productCount") {
          filter.sortByProductCount = true;
        }
      }

      const response = await getCategories(filter);

      if (response.resultCd === 0 && response.data) {
        const mappedCategories: Category[] = response.data.content.map(
          (dto: CategoryDto) => ({
            id: dto.categoryId,
            name: dto.categoryName,
            description: dto.description,
            productCount: dto.productCount ?? (dto as any).totalProducts ?? 0,
            totalStock: dto.totalStock ?? 0,
            status: dto.status === "ACTIVE" ? "Active" : "Inactive",
          }),
        );

        setAllCategories(mappedCategories);
        setTotalElements(response.data.totalElements);
        setTotalPages(response.data.totalPages);
      } else {
        showError(response.message || "Không thể tải danh sách danh mục");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      showError("Lỗi kết nối khi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCategories();
  }, [page, searchQuery, statusFilter, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  const handleEditCategory = async (id: number) => {
    setLoading(true);
    try {
      const response = await getCategoryById(id);
      if (response.resultCd === 0 && response.data) {
        const category: Category = {
          id: response.data.categoryId,
          name: response.data.categoryName,
          description: response.data.description,
          productCount: response.data.productCount ?? 0,
          totalStock: response.data.totalStock ?? 0,
          status: response.data.status === "ACTIVE" ? "Active" : "Inactive",
        };
        setCurrentCategory(category);
        setViewMode("EDIT");
      } else {
        showError(response.message || "Không thể lấy thông tin danh mục");
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
      showError("Lỗi kết nối khi lấy thông tin danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (
    id: number,
    values: {
      name: string;
      status: "Active" | "Inactive";
      description: string;
    },
  ) => {
    setLoading(true);
    try {
      const response = await updateCategory(id, {
        categoryName: values.name,
        description: values.description,
        status: values.status.toUpperCase() as any,
      });

      if (response.resultCd === 0) {
        showNotice("Cập nhật danh mục thành công!");
        setViewMode("LIST");
        loadCategories();
      } else {
        showError(response.message || "Không thể cập nhật danh mục");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      showError("Lỗi kết nối khi cập nhật danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (values: {
    name: string;
    status: "Active" | "Inactive";
    description: string;
  }) => {
    setLoading(true);
    try {
      const response = await createCategory({
        categoryName: values.name,
        description: values.description,
        status: values.status.toUpperCase() as any,
      });

      if (response.resultCd === 0) {
        showNotice("Thêm danh mục mới thành công!");
        setViewMode("LIST");
        loadCategories();
      } else {
        showError(response.message || "Không thể lưu danh mục");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      showError("Lỗi kết nối khi lưu danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (id: number, name: string) => {
    showConfirm(
      `Bạn có chắc chắn muốn xóa danh mục "${name}"?`,
      async () => {
        setLoading(true);
        try {
          const response = await deleteCategory(id);
          if (response.resultCd === 0) {
            showNotice(response.message || "Đã xóa danh mục thành công");

            if (!response.data) {
              // Trường hợp trả về data là null -> Backend đã xóa thật.
              setAllCategories((allCategories) =>
                allCategories.filter((c) => c.id !== id),
              );
            } else {
              // Trường hợp trả về data là object -> Backend chỉ đổi INACTIVE.
              setAllCategories((allCategories) =>
                allCategories.map((c) =>
                  c.id === id
                    ? {
                        ...c,
                        status: "Inactive",
                        productCount: response.data!.productCount,
                      }
                    : c,
                ),
              );
            }
          } else {
            showError(response.message || "Không thể xóa danh mục");
          }
        } catch (error) {
          console.error("Error deleting category:", error);
          showError("Lỗi kết nối khi xóa danh mục");
        } finally {
          setLoading(false);
        }
      },
      "Xác nhận xóa",
    );
  };

  const handleToggleStatus = async (id: number) => {
    setLoading(true);
    try {
      const response = await toggleCategoryStatus(id);
      if (response.resultCd === 0 && response.data) {
        const newStatus =
          response.data.status === "ACTIVE"
            ? "Active"
            : ("Inactive" as "Active" | "Inactive");
        setAllCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
        );
        showNotice(
          `Danh mục đã chuyển sang ${newStatus === "Active" ? "Hoạt động" : "Ngừng hoạt động"}!`,
        );
      } else {
        showError(response.message || "Không thể đổi trạng thái danh mục");
      }
    } catch (error) {
      showError("Lỗi kết nối khi đổi trạng thái danh mục");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CategoryManagementView
        categories={allCategories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        sortConfig={sortConfig}
        onSort={handleSort}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onSave={handleSaveCategory}
        onUpdate={handleUpdateCategory}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onToggleStatus={handleToggleStatus}
        currentCategory={currentCategory}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        loading={loading}
      />
      <LoadingModal
        isOpen={loading}
        message="Đang xử lý..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </>
  );
};

export default CategoryManagement;
