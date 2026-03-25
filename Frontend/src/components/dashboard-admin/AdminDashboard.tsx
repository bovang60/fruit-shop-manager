import { useState, useEffect, useCallback } from 'react'
import AdminDashboardView from './AdminDashboardView'
import type { Stat, Seller } from './AdminDashboardView'
import { getDashboardStats } from '../../services/adminService'
import { usePopup } from '../common/popup'

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true'
    })
    
    const [stats, setStats] = useState<Stat[]>([])
    const [sellers, setSellers] = useState<Seller[]>([])
    const [monthlyOrders, setMonthlyOrders] = useState<any[]>([])
    
    const { showError } = usePopup()

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value) + ' đ'
    }

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value)
    }

    const loadData = useCallback(async () => {
        setIsLoading(true)
        console.log("DEBUG: AdminDashboard loadData started");
        try {
            const response = await getDashboardStats()
            console.log("DEBUG: AdminDashboard API response", response);
            if (response.resultCd === 0 && response.data) {
                const data = response.data

                // 1. Transform Stats
                const transformedStats: Stat[] = [
                    {
                        id: 'total-revenue',
                        label: 'Tổng doanh thu',
                        value: formatCurrency(data.totalRevenue),
                        trend: '+0%',
                        trendDir: 'up',
                        footer: 'vs last month',
                        icon: 'payments',
                        color: '#00a76f'
                    },
                    {
                        id: 'active-users',
                        label: 'Người dùng hoạt động',
                        value: formatNumber(data.activeUsers),
                        trend: '+0%',
                        trendDir: 'up',
                        footer: 'vs last month',
                        icon: 'person',
                        color: '#00b8d9'
                    },
                    {
                        id: 'total-orders',
                        label: 'Tổng đơn hàng',
                        value: formatNumber(data.totalOrders),
                        trend: '+0%',
                        trendDir: 'up',
                        footer: 'vs last month',
                        icon: 'shopping_cart',
                        color: '#ffab00'
                    },
                    {
                        id: 'pending-approvals',
                        label: 'Cửa hàng chờ duyệt',
                        value: formatNumber(data.pendingShopApprovals),
                        trend: 'Cần xử lý',
                        trendDir: 'down',
                        footer: 'Yêu cầu chờ duyệt',
                        icon: 'verified',
                        color: '#ff5630'
                    }
                ]
                setStats(transformedStats)

                // 2. Transform Sellers
                const transformedSellers: Seller[] = data.topSellers.map((s, idx) => ({
                    id: idx + 1,
                    name: s.shopName,
                    rating: 5.0,
                    orders: formatNumber(s.totalUnitsSold) + ' sales',
                    revenue: formatCurrency(s.totalRevenue),
                    trend: '0%',
                    trendDir: 'up',
                    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.shopName)}&background=random`
                }))
                setSellers(transformedSellers)

                // 3. Transform Revenue Trend (for the main chart)
                const maxRevenue = Math.max(...data.shopPerformanceMonthly.map(m => m.totalRevenue), 1)
                
                const transformedRevenue = data.shopPerformanceMonthly.slice(0, 12).reverse().map((m, i) => {
                    const [year, month] = m.month.split('-')
                    return {
                        label: `${month}/${year.slice(2)}`,
                        value: formatCurrency(m.totalRevenue),
                        x: 40 + (i / (data.shopPerformanceMonthly.length - 1 || 1)) * 720,
                        y: 220 - (m.totalRevenue / (maxRevenue * 1.2)) * 220
                    }
                })
                setMonthlyOrders(transformedRevenue.length > 0 ? transformedRevenue : [{ label: 'N/A', value: '0 đ', x: 0, y: 110 }])

            } else {
                console.error("DEBUG: AdminDashboard API returned error", response);
                showError(response.message || 'Không thể tải dữ liệu thống kê từ hệ thống')
            }
        } catch (error) {
            console.error('DEBUG: AdminDashboard Fetch error:', error)
            showError('Lỗi kết nối máy chủ khi tải dữ liệu dashboard')
        } finally {
            setIsLoading(false)
        }
    }, [showError])

    useEffect(() => {
        loadData()
    }, [loadData])

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(prev => {
            const next = !prev
            localStorage.setItem('sidebar-collapsed', String(next))
            return next
        })
    }

    return (
        <AdminDashboardView
            stats={stats}
            sellers={sellers}
            monthlyOrders={monthlyOrders}
            isLoading={isLoading}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
        />
    )
}
