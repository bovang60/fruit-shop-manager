import React, { useState } from 'react';
import CategoryManagementView from './CategoryManagementView';
import type { Category } from './CategoryManagementView';
import { getCategories, createCategory, getCategoryById, updateCategory, type CategoryDto } from '../../services/categoryService';

export type SortDirection = 'asc' | 'desc' | null

export type SortConfig = {
    key: string | null
    direction: SortDirection
}

const CategoryManagement: React.FC = () => {
    // UI State
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true'
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null })
    const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'EDIT'>('LIST');

    // Pagination State
    const [page, setPage] = useState(0);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev
            localStorage.setItem('sidebar-collapsed', String(next))
            return next
        })
    }

    const loadCategories = async () => {
        setLoading(true);
        try {
            const filter = {
                search: searchQuery,
                page: page,
                size: 10,
                sort: sortConfig.key ? `${sortConfig.key},${sortConfig.direction}` : undefined,
                // Status mapping if needed, or backend handles it
            };

            const response = await getCategories(filter);

            if (response.resultCd === 0 && response.data) {
                const mappedCategories: Category[] = response.data.content.map((dto: CategoryDto) => ({
                    id: dto.categoryId,
                    name: dto.categoryName,
                    description: dto.description,
                    productCount: dto.fruitCount,
                    status: dto.status === 'ACTIVE' ? 'Active' : 'Inactive'
                }));

                setAllCategories(mappedCategories);
                setTotalElements(response.data.totalElements);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
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
                if (prev.direction === 'asc') return { key, direction: 'desc' }
                if (prev.direction === 'desc') return { key: null, direction: null }
            }
            return { key, direction: 'asc' }
        })
    }

    const handleEditCategory = async (id: number) => {
        setLoading(true);
        try {
            const response = await getCategoryById(id);
            if (response.resultCd === 0 && response.data) {
                const category: Category = {
                    id: response.data.categoryId,
                    name: response.data.categoryName,
                    description: response.data.description,
                    productCount: response.data.fruitCount,
                    status: response.data.status === 'ACTIVE' ? 'Active' : 'Inactive'
                };
                setCurrentCategory(category);
                setViewMode('EDIT');
            } else {
                alert(response.message || "Failed to fetch category details");
            }
        } catch (error) {
            console.error("Error fetching category details:", error);
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCategory = async (id: number, values: { name: string, status: 'Active' | 'Inactive', description: string }) => {
        setLoading(true);
        try {
            const response = await updateCategory(id, {
                categoryName: values.name,
                description: values.description,
                status: values.status.toUpperCase() as any
            });

            if (response.resultCd === 0) {
                setViewMode('LIST');
                loadCategories();
            } else {
                alert(response.message || "Failed to update category");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCategory = async (values: { name: string, status: 'Active' | 'Inactive', description: string }) => {
        setLoading(true);
        try {
            const response = await createCategory({
                categoryName: values.name,
                description: values.description,
                status: values.status.toUpperCase() as any
            });

            if (response.resultCd === 0) {
                setViewMode('LIST');
                loadCategories();
            } else {
                alert(response.message || "Failed to save category");
            }
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
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
            currentCategory={currentCategory}
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setPage}
            loading={loading}
        />
    );
};

export default CategoryManagement;
