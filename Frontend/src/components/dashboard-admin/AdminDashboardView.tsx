import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AdminDashboard.css'

export type Stat = {
    id: string
    label: string
    value: string
    trend: string
    trendDir: 'up' | 'down'
    footer: string
    icon: string
    color: string
}

export type Seller = {
    id: number
    name: string
    rating: number
    orders: string
    revenue: string
    trend: string
    trendDir: 'up' | 'down'
    img: string
}

interface MonthlyPoint {
    label: string
    value: string
    x: number
    y: number
}

interface CancelPoint {
    day: string
    total: number
    cancelled: number
}

interface Props {
    stats: Stat[]
    sellers: Seller[]
    monthlyOrders: MonthlyPoint[]
    cancelRateData: CancelPoint[]
    isLoading: boolean
    isSidebarCollapsed: boolean
    onToggleSidebar: () => void
}

export default function AdminDashboardView({
    stats,
    sellers,
    monthlyOrders,
    cancelRateData,
    isLoading,
    isSidebarCollapsed,
    onToggleSidebar
}: Props) {
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);
    const [hoverBarIdx, setHoverBarIdx] = useState<number | null>(null);

    if (isLoading) {
        return (
            <div className="admin-dashboard-root" style={{ alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <p style={{ fontWeight: 700, color: '#00a76f' }}>Loading Dashboard Data...</p>
            </div>
        )
    }

    return (
        <div className={`admin-dashboard-root ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Sidebar Navigation */}
            <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
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
                            <Link to="/admin-dashboard" className="nav-item active">
                                <span className="material-symbols-outlined">dashboard</span>
                                <span className="nav-label">Global Overview</span>
                            </Link>
                            <Link to="/user-management" className="nav-item">
                                <span className="material-symbols-outlined">person_search</span>
                                <span className="nav-label">User Management</span>
                            </Link>
                            <Link to="/shop-management" className="nav-item">
                                <span className="material-symbols-outlined">verified</span>
                                <span className="nav-label">Shop Management</span>
                            </Link>
                            <Link to="/category-management" className="nav-item">
                                <span className="material-symbols-outlined">category</span>
                                <span className="nav-label">Category Management</span>
                            </Link>
                        </nav>
                    </div>
                    <div>
                        <nav className="admin-nav">
                            <Link to="#" className="nav-item">
                                <span className="material-symbols-outlined">help_outline</span>
                                <span className="nav-label">Help Center</span>
                            </Link>
                            <Link to="/login" className="nav-item" style={{ color: '#ef4444' }}>
                                <span className="material-symbols-outlined">logout</span>
                                <span className="nav-label">Logout</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-header-rich">
                    <div className="header-left-part">
                        <div className="modern-search-bar">
                            <span className="material-symbols-outlined">search</span>
                            <input type="text" placeholder="Search anything..." />
                            <span className="search-shortcut">⌘K</span>
                        </div>
                    </div>
                    <div className="header-actions-right">
                        <div className="user-avatar-circle">AS</div>
                    </div>
                </header>

                <div className="admin-content-scroll">
                    <div className="page-header-content">
                        <h1>Dashboard</h1>
                        <p>Welcome back, Admin. Real-time insights for your business.</p>
                    </div>

                    {/* Stat Cards Grid */}
                    <div className="modern-stats-grid">
                        {stats.map(s => (
                            <div key={s.id} className="modern-stat-card">
                                <div className="stat-card-info">
                                    <p className="stat-card-label">{s.label}</p>
                                    <h3 className="stat-card-value">{s.value}</h3>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '4px' }}>
                                        <span style={{ color: s.trendDir === 'up' ? '#5ce444' : '#ef4444' }}>{s.trend}</span> vs last month
                                    </p>
                                </div>
                                <div className="stat-card-icon" style={s.color ? { color: s.color, backgroundColor: `${s.color}14` } : {}}>
                                    <span className="material-symbols-outlined">{s.icon}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Middle Section: Revenue Overview and Top Seller */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '0 2.5rem 1.5rem' }}>
                        {/* Revenue Overview */}
                        <div className="card-with-header overview-card">
                            <div className="card-header-row" style={{ padding: '1.5rem 1.5rem 0' }}>
                                <div className="card-title-group">
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Orders per Month</h3>
                                </div>
                            </div>
                            <div className="overview-chart-container" style={{ padding: '0 1.5rem 1.5rem' }}>
                                <div className="weekly-revenue-svg-container" style={{ height: '220px', position: 'relative', marginTop: '1rem' }}>
                                    <svg width="100%" height="100%" viewBox="0 0 800 220" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                        <defs>
                                            <linearGradient id="areaGradBlue" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#00b8d9" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="#00b8d9" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>

                                        <path d={`M0,${monthlyOrders[0].y} Q40,170 72,${monthlyOrders[1].y} T144,${monthlyOrders[2].y} T216,${monthlyOrders[3].y} T288,${monthlyOrders[4].y} T360,${monthlyOrders[5].y} T432,${monthlyOrders[6].y} T504,${monthlyOrders[7].y} T576,${monthlyOrders[8].y} T648,${monthlyOrders[9].y} T720,${monthlyOrders[10].y} T800,${monthlyOrders[11].y} V220 H0 Z`} fill="url(#areaGradBlue)" />
                                        <path d={`M0,${monthlyOrders[0].y} Q40,170 72,${monthlyOrders[1].y} T144,${monthlyOrders[2].y} T216,${monthlyOrders[3].y} T288,${monthlyOrders[4].y} T360,${monthlyOrders[5].y} T432,${monthlyOrders[6].y} T504,${monthlyOrders[7].y} T576,${monthlyOrders[8].y} T648,${monthlyOrders[9].y} T720,${monthlyOrders[10].y} T800,${monthlyOrders[11].y}`} fill="none" stroke="#2563eb" strokeWidth="3" />

                                        {monthlyOrders.map((pt, i) => (
                                            <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                                                <circle cx={pt.x} cy={pt.y} r={hoverIdx === i ? 6 : 4} fill="#2563eb" stroke="#fff" strokeWidth="2" style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
                                                {hoverIdx === i && (
                                                    <foreignObject x={pt.x - 40} y={pt.y - 45} width="80" height="25">
                                                        <div style={{ background: '#1e293b', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', textAlign: 'center' }}>
                                                            {pt.value}
                                                        </div>
                                                    </foreignObject>
                                                )}
                                            </g>
                                        ))}
                                    </svg>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 700, padding: '0 4px', marginTop: '1rem' }}>
                                    {monthlyOrders.map((pt, i) => (
                                        <span
                                            key={i}
                                            onMouseEnter={() => setHoverIdx(i)}
                                            onMouseLeave={() => setHoverIdx(null)}
                                            style={{ cursor: 'pointer', transition: 'color 0.2s', color: hoverIdx === i ? '#2563eb' : '#94a3b8' }}
                                        >
                                            {pt.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Seller */}
                        <div className="card-with-header overview-card">
                            <div className="card-header-row" style={{ padding: '1.5rem 1.5rem 0' }}>
                                <div className="card-title-group">
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Top Seller</h3>
                                </div>
                            </div>
                            <div className="seller-list-modern" style={{ padding: '0 1.5rem 1.5rem' }}>
                                {sellers.map((seller) => (
                                    <div key={seller.id} className="seller-item-modern">
                                        <div className="seller-avatar-square" style={{ backgroundImage: `url(${seller.img})`, borderRadius: '50%' }}></div>
                                        <div className="seller-info-col">
                                            <div className="seller-name-row">
                                                <span className="seller-name-text">{seller.name}</span>
                                                <span className="seller-revenue-text">{seller.revenue}</span>
                                            </div>
                                            <div className="seller-stats-row">
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{seller.orders}</span>
                                                <span className={`seller-trend-text up`}>
                                                    +{seller.trend}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Profit vs Expenses Full Width */}
                    <div style={{ padding: '0 2.5rem 2.5rem' }}>
                        <div className="card-with-header overview-card">
                            <div className="card-header-row" style={{ padding: '1.5rem 1.5rem 0' }}>
                                <div className="card-title-group">
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Cancel Rate per Month</h3>
                                </div>
                            </div>
                            <div className="overview-chart-container" style={{ padding: '1.5rem' }}>
                                <div className="daily-orders-bars" style={{ height: '220px', alignItems: 'flex-end', gap: '12px', position: 'relative' }}>
                                    {cancelRateData.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                gap: '3px',
                                                height: '100%',
                                                alignItems: 'flex-end',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={() => setHoverBarIdx(idx)}
                                            onMouseLeave={() => setHoverBarIdx(null)}
                                        >
                                            <div style={{ flex: 1, background: '#2563eb', height: `${(item.total / 100) * 100}%`, borderRadius: '3px', transition: 'all 0.3s', opacity: hoverBarIdx !== null && hoverBarIdx !== idx ? 0.3 : 1 }}></div>
                                            <div style={{ flex: 1, background: '#ef4444', height: `${(item.cancelled / 100) * 100}%`, borderRadius: '3px', transition: 'all 0.3s', opacity: hoverBarIdx !== null && hoverBarIdx !== idx ? 0.3 : 1 }}></div>

                                            {hoverBarIdx === idx && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '-65px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    background: '#1e293b',
                                                    color: 'white',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    zIndex: 10,
                                                    minWidth: '100px',
                                                    textAlign: 'center',
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                                                    pointerEvents: 'none'
                                                }}>
                                                    <div style={{ fontWeight: 800, marginBottom: '2px' }}>{item.day}</div>
                                                    <div style={{ color: '#60a5fa' }}>Total: {item.total}</div>
                                                    <div style={{ color: '#f87171' }}>Cancelled: {item.cancelled}</div>
                                                    <div style={{ borderTop: '1px solid #334155', marginTop: '4px', paddingTop: '2px', color: '#fbbf24' }}>
                                                        Rate: {((item.cancelled / item.total) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 700, marginTop: '1rem' }}>
                                    {cancelRateData.map((item, idx) => (
                                        <span
                                            key={idx}
                                            onMouseEnter={() => setHoverBarIdx(idx)}
                                            onMouseLeave={() => setHoverBarIdx(null)}
                                            style={{ flex: 1, textAlign: 'center', cursor: 'pointer', transition: 'color 0.2s', color: hoverBarIdx === idx ? '#2563eb' : '#94a3b8' }}
                                        >
                                            {item.day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
