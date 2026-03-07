import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SortConfig } from './CategoryManagement';
import './CategoryManagement.css';

export interface Category {
    id: number;
    name: string;
    description?: string;
    productCount: number;
    status: 'Active' | 'Inactive';
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
    viewMode: 'LIST' | 'CREATE' | 'EDIT';
    setViewMode: (mode: 'LIST' | 'CREATE' | 'EDIT') => void;
    onSave: (values: { name: string, status: 'Active' | 'Inactive', description: string }) => void;
    onUpdate: (id: number, values: { name: string, status: 'Active' | 'Inactive', description: string }) => void;
    onEdit: (id: number) => void;
    currentCategory?: Category | null;
    page: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onDelete: (id: number, name: string) => void;
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
    loading = false
}) => {

    const [newName, setNewName] = useState('');
    const [newStatus, setNewStatus] = useState<'Active' | 'Inactive'>('Active');
    const [newDescription, setNewDescription] = useState('');

    React.useEffect(() => {
        if (viewMode === 'EDIT' && currentCategory) {
            setNewName(currentCategory.name);
            setNewStatus(currentCategory.status);
            setNewDescription(currentCategory.description || '');
        } else if (viewMode === 'CREATE') {
            setNewName('');
            setNewStatus('Active');
            setNewDescription('');
        }
    }, [viewMode, currentCategory]);

    const renderSortIcon = (key: string) => {
        if (sortConfig.key !== key) return <span className="material-symbols-outlined sort-icon-hidden">unfold_more</span>
        if (sortConfig.direction === 'asc') return <span className="material-symbols-outlined sort-icon">expand_less</span>
        if (sortConfig.direction === 'desc') return <span className="material-symbols-outlined sort-icon">expand_more</span>
        return <span className="material-symbols-outlined sort-icon-hidden">unfold_more</span>
    }

    const renderListView = () => (
        <>
            <div className="page-header-content">
                <nav className="breadcrumbs-modern">
                    <Link to="/admin-dashboard">Dashboard</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Category Management</span>
                </nav>
                <h1>Category Management</h1>
                <p>Manage the global taxonomy for the fruit marketplace.</p>
            </div>

            <div className="management-filter-section">
                <div className="filter-tabs-container">
                    <button
                        className={`filter-tab-item ${statusFilter === '' ? 'active' : ''}`}
                        onClick={() => onStatusFilterChange('')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-tab-item ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
                        onClick={() => onStatusFilterChange('ACTIVE')}
                    >
                        Active
                    </button>
                    <button
                        className={`filter-tab-item ${statusFilter === 'INACTIVE' ? 'active' : ''}`}
                        onClick={() => onStatusFilterChange('INACTIVE')}
                    >
                        Inactive
                    </button>
                </div>

                <div className="filter-search-actions">
                    <div className="modern-search-input-wrap">
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder="Search categories by name..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary-admin" onClick={() => setViewMode('CREATE')}>
                        <span className="material-symbols-outlined">add</span>
                        Add Category
                    </button>
                </div>
            </div>

            <div className="table-card">
                <table className={`admin-table ${loading ? 'table-loading' : ''}`}>
                    <thead>
                        <tr>
                            <th onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Category Name {renderSortIcon('name')}
                                </div>
                            </th>
                            <th onClick={() => onSort('productCount')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Product Count {renderSortIcon('productCount')}
                                </div>
                            </th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Loading categories...</td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No categories found.</td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td><span style={{ fontWeight: 700 }}>{cat.name}</span></td>
                                    <td>{cat.productCount} Items</td>
                                    <td>
                                        <span className={`status-chip status-${cat.status.toLowerCase()}`}>
                                            {cat.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="status-actions-group">
                                            <button className="icon-btn-action" onClick={() => onEdit(cat.id)}>
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button
                                                className="icon-btn-action"
                                                style={{ color: '#ef4444' }}
                                                onClick={() => onDelete(cat.id, cat.name)}
                                            >
                                                <span className="material-symbols-outlined">delete</span>
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
                        Showing {categories.length} of {totalElements} categories
                    </p>
                    <div className="pagination-group">
                        <button
                            className="page-btn"
                            disabled={page === 0 || loading}
                            onClick={() => onPageChange(page - 1)}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i).map(p => (
                            <button
                                key={p}
                                className={`page-btn ${page === p ? 'active' : ''}`}
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
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    const renderCreateView = () => (
        <div className="user-detail-container">
            <div className="detail-top-bar" style={{ marginBottom: '1.5rem' }}>
                <button className="btn-back-circle" onClick={() => setViewMode('LIST')} title="Back to List">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>

            <div className="page-header-content" style={{ marginBottom: '2rem' }}>
                <nav className="breadcrumbs-modern">
                    <Link to="/admin-dashboard">Dashboard</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span onClick={() => setViewMode('LIST')} style={{ cursor: 'pointer' }}>Category Management</span>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Create Category</span>
                </nav>
                <h1>Create New Category</h1>
                <p>Define a new segment for the product marketplace.</p>
            </div>

            <div className="detail-section-card">
                <h3 className="section-title-label" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#637381', borderBottom: '1px solid #f4f6f8', paddingBottom: '0.75rem' }}>Category Details</h3>
                <div className="section-content-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                    <div className="info-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#637381', fontSize: '0.75rem' }}>CATEGORY NAME</label>
                        <input
                            type="text"
                            className="modern-search-input-wrap"
                            style={{ padding: '0 0.75rem', fontSize: '0.875rem', background: '#f4f6f8', border: '1px solid transparent', borderRadius: '10px', height: '48px', width: '100%' }}
                            placeholder="e.g. Tropical Fruits"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div className="info-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#637381', fontSize: '0.75rem' }}>DESCRIPTION</label>
                        <textarea
                            className="modern-search-input-wrap"
                            style={{ padding: '0.75rem', fontSize: '0.875rem', background: '#f4f6f8', border: '1px solid transparent', borderRadius: '10px', minHeight: '120px', width: '100%', resize: 'vertical', display: 'block' }}
                            placeholder="Write a brief description of this category..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                    </div>
                    <div className="info-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#637381', fontSize: '0.75rem' }}>STATUS</label>
                        <select
                            className="modern-search-input-wrap"
                            style={{ padding: '0 0.75rem', fontSize: '0.875rem', appearance: 'auto', background: '#f4f6f8', border: '1px solid transparent', borderRadius: '10px', height: '48px', width: '100%' }}
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as 'Active' | 'Inactive')}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="detail-action-footer">
                <button className="btn-cancel-action" onClick={() => setViewMode('LIST')}>Cancel</button>
                <button className="btn-status-toggle is-activate" onClick={() => onSave({ name: newName, status: newStatus, description: newDescription })}>Save Category</button>
            </div>
        </div>
    );

    const renderEditView = () => (
        <div className="user-detail-container">
            <div className="detail-top-bar" style={{ marginBottom: '1.5rem' }}>
                <button className="btn-back-circle" onClick={() => setViewMode('LIST')} title="Back to List">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>

            <div className="page-header-content" style={{ marginBottom: '2rem' }}>
                <nav className="breadcrumbs-modern">
                    <Link to="/admin-dashboard">Dashboard</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span onClick={() => setViewMode('LIST')} style={{ cursor: 'pointer' }}>Category Management</span>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Edit Category</span>
                </nav>
                <h1>Edit Category</h1>
                <p>Modify existing segment details.</p>
            </div>

            <div className="detail-section-card">
                <h3 className="section-title-label" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#637381', borderBottom: '1px solid #f4f6f8', paddingBottom: '0.75rem' }}>Category Details</h3>
                <div className="section-content-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                    <div className="info-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#637381', fontSize: '0.75rem' }}>CATEGORY NAME</label>
                        <input
                            type="text"
                            className="modern-search-input-wrap"
                            style={{ padding: '0 0.75rem', fontSize: '0.875rem', background: '#f4f6f8', border: '1px solid transparent', borderRadius: '10px', height: '48px', width: '100%' }}
                            placeholder="e.g. Tropical Fruits"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div className="info-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#637381', fontSize: '0.75rem' }}>DESCRIPTION</label>
                        <textarea
                            className="modern-search-input-wrap"
                            style={{ padding: '0.75rem', fontSize: '0.875rem', background: '#f4f6f8', border: '1px solid transparent', borderRadius: '10px', minHeight: '120px', width: '100%', resize: 'vertical', display: 'block' }}
                            placeholder="Write a brief description of this category..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                    </div>
                    <div className="info-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#637381', fontSize: '0.75rem' }}>STATUS</label>
                        <select
                            className="modern-search-input-wrap"
                            style={{ padding: '0 0.75rem', fontSize: '0.875rem', appearance: 'auto', background: '#f4f6f8', border: '1px solid transparent', borderRadius: '10px', height: '48px', width: '100%' }}
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as 'Active' | 'Inactive')}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="detail-action-footer">
                <button className="btn-cancel-action" onClick={() => setViewMode('LIST')}>Cancel</button>
                <button
                    className="btn-status-toggle is-activate"
                    onClick={() => currentCategory && onUpdate(currentCategory.id, { name: newName, status: newStatus, description: newDescription })}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Category'}
                </button>
            </div>
        </div>
    );

    return (
        <div className={`user-management-root ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Sidebar matches UserManagement */}
            <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} aria-label="Main Sidebar">
                <div className="sidebar-inner">
                    <div>
                        <div className="admin-brand" onClick={onToggleSidebar} style={{ cursor: 'pointer' }}>
                            <div className="brand-icon">
                                <span className="material-symbols-outlined">storefront</span>
                            </div>
                            <div className="brand-text">
                                <h1>FruitShop Admin</h1>
                                <p>Executive Portal</p>
                            </div>
                            <button className="toggle-btn">
                                <span className="material-symbols-outlined">
                                    {isSidebarCollapsed ? 'menu_open' : 'menu'}
                                </span>
                            </button>
                        </div>
                        <nav className="admin-nav">
                            <Link to="/admin-dashboard" className="nav-item" title="Global Overview">
                                <span className="material-symbols-outlined">dashboard</span>
                                <span className="nav-label">Global Overview</span>
                            </Link>
                            <Link to="/user-management" className="nav-item" title="User Management">
                                <span className="material-symbols-outlined">person_search</span>
                                <span className="nav-label">User Management</span>
                            </Link>
                            <Link to="/shop-management" className="nav-item" title="Shop Management">
                                <span className="material-symbols-outlined">verified</span>
                                <span className="nav-label">Shop Management</span>
                            </Link>
                            <Link to="/category-management" className="nav-item active" title="Category Management">
                                <span className="material-symbols-outlined">category</span>
                                <span className="nav-label">Category Management</span>
                            </Link>
                        </nav>
                    </div>
                    <div>
                        <nav className="admin-nav">
                            <Link to="#" className="nav-item" title="Help Center">
                                <span className="material-symbols-outlined">help_outline</span>
                                <span className="nav-label">Help Center</span>
                            </Link>
                            <Link to="/login" className="nav-item" style={{ color: '#ef4444' }} title="Logout">
                                <span className="material-symbols-outlined">logout</span>
                                <span className="nav-label">Logout</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header-rich">
                    <div className="header-left-part">
                        <div className="modern-search-bar">
                            <span className="material-symbols-outlined">search</span>
                            <input
                                type="text"
                                placeholder="Search anything..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                            <span className="search-shortcut">⌘K</span>
                        </div>
                    </div>
                    <div className="header-actions-right">
                        <div className="user-avatar-circle">AS</div>
                    </div>
                </header>

                <div className="admin-content-scroll">
                    {viewMode === 'CREATE' ? renderCreateView() :
                        viewMode === 'EDIT' ? renderEditView() :
                            renderListView()}
                </div>
            </main>
        </div>
    );
};

export default CategoryManagementView;
