import React, { useState } from 'react';
import CategoryManagementView from './CategoryManagementView';
import type { Category } from './CategoryManagementView';

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

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev
            localStorage.setItem('sidebar-collapsed', String(next))
            return next
        })
    }

    // Mock Data
    const initialCategories: Category[] = [
        { id: 1, name: 'Citrus Fruits', productCount: 1245, status: 'Active' },
        { id: 2, name: 'Berries & Cherries', productCount: 892, status: 'Active' },
        { id: 3, name: 'Exotic Tropicals', productCount: 456, status: 'Active' },
        { id: 4, name: 'Specialty Seeds', productCount: 0, status: 'Inactive' },
    ];

    const [allCategories] = useState<Category[]>(initialCategories);

    // Filtered data logic
    const filteredCategories = allCategories.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === '' || cat.status.toUpperCase() === statusFilter.toUpperCase();
        return matchesSearch && matchesStatus;
    });

    const handleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                if (prev.direction === 'asc') return { key, direction: 'desc' }
                if (prev.direction === 'desc') return { key: null, direction: null }
            }
            return { key, direction: 'asc' }
        })
    }

    const handleSaveCategory = (values: { name: string, status: 'Active' | 'Inactive' }) => {
        console.log('Saving Category:', values);
        // Here you would typically call an API
        setViewMode('LIST');
    };

    return (
        <CategoryManagementView
            categories={filteredCategories}
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
        />
    );
};

export default CategoryManagement;
