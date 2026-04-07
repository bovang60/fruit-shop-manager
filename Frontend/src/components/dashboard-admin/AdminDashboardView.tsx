import { useState } from 'react'
import { AdminFrame, ADMIN_NAV_ITEMS } from '../common/admin-frame'
import './AdminDashboard.css'

export type Stat = {
    id: string
    label: string
    value: string
    trend?: string
    trendDir?: 'up' | 'down'
    footer?: string
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

interface WeeklyPoint {
    label: string
    value: string
    x: number
    y: number
}

interface Props {
    stats: Stat[]
    sellers: Seller[]
    weeklyOrders: WeeklyPoint[]
    isLoading: boolean;
    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    onSellerClick: (sellerId: number, sellerName: string) => void;
}

export default function AdminDashboardView({
    stats,
    sellers,
    weeklyOrders,
    isLoading,
    isSidebarCollapsed,
    onToggleSidebar,
    onSellerClick,
}: Props) {
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);

    const maxVal = weeklyOrders.length > 0 
        ? Math.max(...weeklyOrders.map(o => {
            const num = parseFloat(o.value.replace(/[^0-9.]/g, ''));
            return isNaN(num) ? 0 : num;
          }))
        : 100;

    const yLabels = [
        `${(maxVal * 1.5).toFixed(0)}`,
        `${(maxVal * 1.0).toFixed(0)}`,
        `${(maxVal * 0.5).toFixed(0)}`,
        '0'
    ];

    if (isLoading) {
        return (
            <div className="admin-dashboard-root" style={{ alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <p style={{ fontWeight: 700, color: '#00a76f' }}>Đang tải dữ liệu...</p>
            </div>
        )
    }

    return (
        <AdminFrame
            sidebarItems={ADMIN_NAV_ITEMS}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={onToggleSidebar}
        >
            <div className="page-header-content">
                <h1>Bảng điều khiển</h1>
                <p>Chào mừng trở lại! Đây là dữ liệu thống kê hệ thống của bạn.</p>
            </div>

                    {/* Stat Cards Grid */}
                    <div className="modern-stats-grid">
                        {stats.map(s => (
                            <div key={s.id} className="modern-stat-card">
                                <div className="stat-card-info" style={{ flex: 1 }}>
                                    <p className="stat-card-label">{s.label}</p>
                                    <h3 className="stat-card-value">{s.value}</h3>
                                </div>
                                <div className="stat-card-icon" style={s.color ? { color: s.color, backgroundColor: `${s.color}14` } : {}}>
                                    <span className="material-symbols-outlined">{s.icon}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Middle Section: Revenue Overview and Top Seller */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', padding: '0 2.5rem 1.5rem' }}>
                        {/* Revenue Overview */}
                        <div className="card-with-header overview-card">
                            <div className="card-header-row" style={{ padding: '1.5rem 1.5rem 0' }}>
                                <div className="card-title-group">
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Xu hướng đơn hàng (7 ngày qua)</h3>
                                </div>
                            </div>
                            <div className="overview-chart-container" style={{ padding: '0 1.5rem 1.5rem 2.5rem' }}>
                                <div className="weekly-revenue-svg-container" style={{ height: '220px', position: 'relative', marginTop: '1.5rem' }}>
                                    {/* Y-Axis Labels */}
                                    <div style={{ position: 'absolute', left: '-45px', top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 700, textAlign: 'right', width: '35px' }}>
                                        {yLabels.map((lbl, i) => <span key={i}>{lbl}</span>)}
                                    </div>

                                    <svg width="100%" height="100%" viewBox="0 0 800 220" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                        <defs>
                                            <linearGradient id="areaGradBlue" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Grid Lines */}
                                        <line x1="0" y1="0" x2="800" y2="0" stroke="#f1f5f9" strokeDasharray="4 4" />
                                        <line x1="0" y1="73" x2="800" y2="73" stroke="#f1f5f9" strokeDasharray="4 4" />
                                        <line x1="0" y1="146" x2="800" y2="146" stroke="#f1f5f9" strokeDasharray="4 4" />
                                        <line x1="0" y1="220" x2="800" y2="220" stroke="#f1f5f9" />

                                        {weeklyOrders.map((pt, i) => {
                                            const barWidth = 35;
                                            const minBarHeight = 10; // Increased from 4 for better visibility
                                            const rawHeight = 220 - pt.y;
                                            const displayHeight = Math.max(rawHeight, minBarHeight);
                                            const displayY = 220 - displayHeight;
                                            
                                            // Determine color: slightly more transparent if it's the minimum height (zero value)
                                            const isZero = rawHeight < 1;
                                            const barColor = hoverIdx === i ? '#1e40af' : (isZero ? '#94a3b8' : '#2563eb');
                                            
                                            return (
                                                <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                                                    <rect 
                                                        x={pt.x - barWidth/2} 
                                                        y={displayY} 
                                                        width={barWidth} 
                                                        height={displayHeight} 
                                                        fill={barColor} 
                                                        rx="4" 
                                                        ry="4"
                                                        style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}
                                                    />
                                                    {hoverIdx === i && (
                                                        <foreignObject x={pt.x - 40} y={pt.y - 35} width="80" height="25">
                                                            <div style={{ background: '#1e293b', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                                                                {pt.value}
                                                            </div>
                                                        </foreignObject>
                                                    )}
                                                </g>
                                            )
                                        })}
                                    </svg>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 700, padding: '0 4px', marginTop: '1.25rem' }}>
                                    {weeklyOrders.map((pt, i) => (
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
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Cửa hàng hàng đầu</h3>
                                </div>
                            </div>
                            <div className="seller-list-modern" style={{ padding: '0 1.5rem 1.5rem' }}>
                                {sellers.map((seller) => (
                                    <div 
                                        key={seller.id} 
                                        className="seller-item-modern" 
                                        onClick={() => onSellerClick(seller.id, seller.name)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="seller-avatar-square" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6ffed', borderRadius: '12px' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#00a76f', fontSize: '20px' }}>storefront</span>
                                        </div>
                                        <div className="seller-info-col">
                                            <div className="seller-name-row" style={{ alignItems: 'center' }}>
                                                <span className="seller-name-text">{seller.name}</span>
                                                <span className="seller-revenue-text">{seller.revenue}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

        </AdminFrame>
    )
}
