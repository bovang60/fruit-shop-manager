import { Link } from 'react-router-dom'
import './UserManagement.css'

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'SELLER'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED'

export type UserData = {
    id: number
    name: string
    username: string
    fullname: string
    email: string
    role: UserRole
    status: UserStatus
    avatar: string
    phone: string
}

export type SortDirection = 'asc' | 'desc' | null

export type SortConfig = {
    key: keyof UserData | null
    direction: SortDirection
}

export type Props = {
    users: UserData[]
    loading: boolean
    error: string | null
    searchQuery: string
    isSidebarCollapsed: boolean
    onToggleSidebar: () => void
    onSearchChange: (v: string) => void
    statusFilter: string
    onStatusFilterChange: (status: string) => void
    page: number
    totalPages: number
    totalElements: number
    onPageChange: (page: number) => void
    onStatusChange: (id: number, status: string) => void
    visibleColumns: Set<string>
    onToggleColumn: (col: string) => void
    viewMode: 'LIST' | 'DETAIL'
    selectedUser: UserData | null
    onViewDetail: (user: UserData) => void
    onBackToList: () => void
    sortConfig: SortConfig
    onSort: (key: keyof UserData) => void
}

export default function UserManagementView({
    users,
    loading,
    error,
    searchQuery,
    isSidebarCollapsed,
    onToggleSidebar,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
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
    sortConfig,
    onSort
}: Props) {
    const renderSortIcon = (key: keyof UserData) => {
        if (sortConfig.key !== key) return <span className="material-symbols-outlined sort-icon-hidden">unfold_more</span>
        if (sortConfig.direction === 'asc') return <span className="material-symbols-outlined sort-icon">expand_less</span>
        if (sortConfig.direction === 'desc') return <span className="material-symbols-outlined sort-icon">expand_more</span>
        return <span className="material-symbols-outlined sort-icon-hidden">unfold_more</span>
    }

    const renderListView = () => (
        <>
            <div className="page-header-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <nav className="breadcrumbs-modern">
                            <Link to="/admin-dashboard">Dashboard</Link>
                            <span className="material-symbols-outlined">chevron_right</span>
                            <span className="current">User Management</span>
                        </nav>
                        <h1>User Management</h1>
                        <p>Monitor and manage platform users, roles, and account permissions.</p>
                    </div>
                </div>
            </div>

            {/* Filter and Search Section */}
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
                    <button
                        className={`filter-tab-item ${statusFilter === 'BANNED' ? 'active' : ''}`}
                        onClick={() => onStatusFilterChange('BANNED')}
                    >
                        Banned
                    </button>
                </div>

                <div className="filter-search-actions">
                    <div className="modern-search-input-wrap">
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    <div className="utility-actions">
                        <div className="dropdown-container">
                            <button className="btn-utility">
                                <span className="material-symbols-outlined">tune</span>
                                Columns
                            </button>
                            <div className="column-toggle-dropdown">
                                <div className="dropdown-header-title">Toggle columns</div>
                                <div className="dropdown-body-options">
                                    <div
                                        className={`column-option-item ${visibleColumns.has('email') ? 'is-selected' : ''}`}
                                        onClick={() => onToggleColumn('email')}
                                    >
                                        <div className="checkmark-indicator">
                                            <span className="material-symbols-outlined">check</span>
                                        </div>
                                        <span className="option-label">Email</span>
                                    </div>
                                    <div
                                        className={`column-option-item ${visibleColumns.has('role') ? 'is-selected' : ''}`}
                                        onClick={() => onToggleColumn('role')}
                                    >
                                        <div className="checkmark-indicator">
                                            <span className="material-symbols-outlined">check</span>
                                        </div>
                                        <span className="option-label">Role</span>
                                    </div>
                                    <div
                                        className={`column-option-item ${visibleColumns.has('status') ? 'is-selected' : ''}`}
                                        onClick={() => onToggleColumn('status')}
                                    >
                                        <div className="checkmark-indicator">
                                            <span className="material-symbols-outlined">check</span>
                                        </div>
                                        <span className="option-label">Status</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-card">
                {error && <div className="error-banner">{error}</div>}
                <table className={`admin-table ${loading ? 'table-loading' : ''}`}>
                    <thead>
                        <tr>
                            <th onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Name {renderSortIcon('name')}
                                </div>
                            </th>
                            {visibleColumns.has('email') && (
                                <th onClick={() => onSort('email')} style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Email {renderSortIcon('email')}
                                    </div>
                                </th>
                            )}
                            {visibleColumns.has('role') && (
                                <th onClick={() => onSort('role')} style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Role {renderSortIcon('role')}
                                    </div>
                                </th>
                            )}
                            {visibleColumns.has('status') && (
                                <th onClick={() => onSort('status')} style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Status {renderSortIcon('status')}
                                    </div>
                                </th>
                            )}
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id}>
                                    <td className="user-name-cell">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div
                                                className="user-avatar-small"
                                                style={{
                                                    backgroundImage: `url(${u.avatar})`,
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    backgroundSize: 'cover'
                                                }}
                                            ></div>
                                            {u.name}
                                        </div>
                                    </td>
                                    {visibleColumns.has('email') && <td style={{ color: '#4b5563' }}>{u.email}</td>}
                                    {visibleColumns.has('role') && (
                                        <td>
                                            <span className={`role-badge role-${u.role.toLowerCase()}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                    )}
                                    {visibleColumns.has('status') && (
                                        <td>
                                            <span className={`status-chip status-${u.status.toLowerCase()}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                    )}
                                    <td>
                                        <div className="status-actions-group">
                                            <button
                                                className="icon-btn-action"
                                                title="View Detail"
                                                onClick={() => onViewDetail(u)}
                                            >
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>
                                            <div className="action-divider-vertical"></div>
                                            {u.status === 'ACTIVE' ? (
                                                <button
                                                    className="action-status-btn deactivate"
                                                    onClick={() => onStatusChange(u.id, 'INACTIVE')}
                                                    title="Deactivate User"
                                                >
                                                    Inactive
                                                </button>
                                            ) : (
                                                <button
                                                    className="action-status-btn activate"
                                                    onClick={() => onStatusChange(u.id, 'ACTIVE')}
                                                    title="Activate User"
                                                >
                                                    Active
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
                        Showing {users.length} of {totalElements} users
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
    )

    const renderDetailView = (user: UserData) => (
        <div className="user-detail-container">
            <div className="detail-top-bar">
                <button className="btn-back-circle" onClick={onBackToList} title="Back to User List">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>

            <div className="user-identity-card">
                <div className="user-avatar-large" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                <div className="user-identity-info">
                    <div className="identity-title-row">
                        <h2 className="user-name-title">{user.fullname}</h2>
                        <span className={`status-chip status-${user.status.toLowerCase()}`}>
                            {user.status}
                        </span>
                    </div>
                    <div className="user-role-meta">
                        <span className="material-symbols-outlined">verified_user</span>
                        <span>{user.role}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section-card">
                <div className="section-header-row">
                    <h3 className="section-title-label">User Information</h3>
                </div>
                <div className="section-content-body grid-info">
                    <div className="info-group">
                        <label>Username</label>
                        <p>{user.username}</p>
                    </div>
                    <div className="info-group">
                        <label>Full Name</label>
                        <p>{user.fullname}</p>
                    </div>
                    <div className="info-group">
                        <label>Email Address</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="info-group">
                        <label>Phone Number</label>
                        <p>{user.phone}</p>
                    </div>
                    <div className="info-group">
                        <label>Account Role</label>
                        <p>{user.role}</p>
                    </div>
                    <div className="info-group">
                        <label>Account Status</label>
                        <p>{user.status}</p>
                    </div>
                </div>
            </div>

            <div className="detail-action-footer">
                <button className="btn-cancel-action" onClick={onBackToList}>Close</button>
                <button
                    className={`btn-status-toggle ${user.status === 'ACTIVE' ? 'is-deactivate' : 'is-activate'}`}
                    onClick={() => {
                        onStatusChange(user.id, user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
                        onBackToList();
                    }}
                >
                    {user.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                </button>
            </div>
        </div>
    )

    return (
        <div className={`user-management-root ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
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
                            <Link to="/user-management" className="nav-item active" title="User Management">
                                <span className="material-symbols-outlined">person_search</span>
                                <span className="nav-label">User Management</span>
                            </Link>
                            <Link to="/shop-management" className="nav-item" title="Shop Management">
                                <span className="material-symbols-outlined">verified</span>
                                <span className="nav-label">Shop Management</span>
                            </Link>
                            <Link to="/category-management" className="nav-item" title="Category Management">
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
                        {viewMode === 'LIST' ? (
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
                        ) : (
                            <div className="detail-view-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginLeft: '1rem' }}>
                                User Profile Details
                            </div>
                        )}
                    </div>

                    <div className="header-actions-right">
                        <div className="user-avatar-circle">AS</div>
                    </div>
                </header>

                <div className="admin-content-scroll">
                    {viewMode === 'DETAIL' && selectedUser
                        ? renderDetailView(selectedUser)
                        : renderListView()
                    }
                </div>
            </main>
        </div>
    )
}
