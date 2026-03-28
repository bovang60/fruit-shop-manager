import { useState, useEffect, useCallback } from 'react'
import AdminDashboardView from './AdminDashboardView'
import type { Stat, Seller } from './AdminDashboardView'
import { getDashboardStats, type DashboardDto } from '../../services/adminService'
import { usePopup } from '../common/popup'

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true'
    })
    
    const [stats, setStats] = useState<Stat[]>([])
    const [sellers, setSellers] = useState<Seller[]>([])
    const [weeklyOrders, setWeeklyOrders] = useState<any[]>([])
    
    const { showError } = usePopup()

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value) + ' đ'
    }

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value)
    }

    const loadData = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await getDashboardStats()
            if (response.resultCd === 0 && response.data) {
                const data: DashboardDto = response.data

                // 1. Transform Stats
                const transformedStats: Stat[] = [
                    {
                        id: 'total-revenue',
                        label: 'Tổng doanh thu',
                        value: formatCurrency(data.totalRevenue),
                        trend: '+0%',
                        trendDir: 'up',
                        footer: 'Doanh thu hệ thống',
                        icon: 'payments',
                        color: '#00a76f'
                    },
                    {
                        id: 'active-users',
                        label: 'Người dùng hoạt động',
                        value: formatNumber(data.activeUsers),
                        trend: '+0%',
                        trendDir: 'up',
                        footer: 'Người dùng tích cực',
                        icon: 'person',
                        color: '#00b8d9'
                    },
                    {
                        id: 'total-orders',
                        label: 'Tổng đơn hàng',
                        value: formatNumber(data.totalOrders),
                        trend: '+0%',
                        trendDir: 'up',
                        footer: 'Tổng đơn hàng',
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
                const transformedSellers: Seller[] = data.topSellers.map((s: any, idx: number) => ({
                    id: idx + 1,
                    name: s.shopName,
                    rating: 5.0,
                    orders: formatNumber(s.totalUnitsSold) + ' đơn vị',
                    revenue: formatCurrency(s.totalRevenue),
                    trend: '0%',
                    trendDir: 'up',
                    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.shopName)}&background=random`
                }))
                setSellers(transformedSellers)

                // 3. Transform Order Trend (Last 7 Days)
                const maxOrders = Math.max(...data.ordersLast7Days.map((d: any) => d.orderCount), 1)
                
                const transformedOrders = data.ordersLast7Days.map((d: any, i: number) => {
                    const [, month, day] = d.date.split('-')
                    return {
                        label: `${day}/${month}`,
                        value: `${d.orderCount} đơn`,
                        x: 40 + (i / (data.ordersLast7Days.length - 1 || 1)) * 720,
                        y: 220 - (d.orderCount / (maxOrders * 1.2)) * 220
                    }
                })
                setWeeklyOrders(transformedOrders.length > 0 ? transformedOrders : [{ label: 'N/A', value: '0 đơn', x: 0, y: 110 }])

            } else {
                showError(response.message || 'Không thể tải dữ liệu thống kê từ hệ thống')
            }
        } catch (error) {
            console.error('AdminDashboard Fetch error:', error)
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
            weeklyOrders={weeklyOrders}
            isLoading={isLoading}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
        />
    )
}
