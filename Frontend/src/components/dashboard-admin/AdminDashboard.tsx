import { useState, useEffect } from 'react'
import AdminDashboardView from './AdminDashboardView'
import type { Stat, Seller } from './AdminDashboardView'

const MOCK_STATS: Stat[] = [
    {
        id: 'total-revenue',
        label: 'Total Revenue',
        value: '$45,231.89',
        trend: '-26.2%',
        trendDir: 'down',
        footer: 'vs last month',
        icon: 'payments',
        color: '#00a76f'
    },
    {
        id: 'active-users',
        label: 'Active Users',
        value: '2,350',
        trend: '+15.2%',
        trendDir: 'up',
        footer: 'vs last month',
        icon: 'person',
        color: '#00b8d9'
    },
    {
        id: 'total-orders',
        label: 'Total Orders',
        value: '1,234',
        trend: '-2.3%',
        trendDir: 'down',
        footer: 'vs last month',
        icon: 'shopping_cart',
        color: '#ffab00'
    },
    {
        id: 'conversion-rate',
        label: 'Conversion Rate',
        value: '3.42%',
        trend: '+1.8%',
        trendDir: 'up',
        footer: 'vs last month',
        icon: 'trending_up',
        color: '#ff5630'
    }
]

const MOCK_SELLERS: Seller[] = [
    {
        id: 1,
        name: 'Green Valley Farm',
        rating: 4.9,
        orders: '2.4k sales',
        revenue: '$85,200.00',
        trend: '15.2%',
        trendDir: 'up',
        img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 2,
        name: 'Citrus Prime Market',
        rating: 4.8,
        orders: '1.8k sales',
        revenue: '$72,120.00',
        trend: '9.5%',
        trendDir: 'up',
        img: 'https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 3,
        name: 'Tropical Express',
        rating: 4.7,
        orders: '1.2k sales',
        revenue: '$45,400.00',
        trend: '4.2%',
        trendDir: 'up',
        img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 4,
        name: 'Berry Direct',
        rating: 4.6,
        orders: '1.5k sales',
        revenue: '$38,050.00',
        trend: '6.4%',
        trendDir: 'up',
        img: 'https://images.unsplash.com/photo-1595147389795-37094173bfd8?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: 5,
        name: 'Organic Roots',
        rating: 4.5,
        orders: '980 sales',
        revenue: '$32,150.00',
        trend: '3.7%',
        trendDir: 'up',
        img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=100'
    }
]

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true'
    })

    const ordersPerMonth = [
        { label: 'Jan', value: '1,200', x: 0, y: 180 },
        { label: 'Feb', value: '1,500', x: 72, y: 160 },
        { label: 'Mar', value: '1,100', x: 144, y: 190 },
        { label: 'Apr', value: '1,300', x: 216, y: 170 },
        { label: 'May', value: '1,890', x: 288, y: 140 },
        { label: 'Jun', value: '2,100', x: 360, y: 120 },
        { label: 'Jul', value: '2,500', x: 432, y: 90 },
        { label: 'Aug', value: '2,800', x: 504, y: 70 },
        { label: 'Sep', value: '2,600', x: 576, y: 80 },
        { label: 'Oct', value: '3,100', x: 648, y: 50 },
        { label: 'Nov', value: '3,300', x: 720, y: 40 },
        { label: 'Dec', value: '3,500', x: 800, y: 30 }
    ]

    const cancelRatePerMonth = [
        { day: 'Jan', total: 80, cancelled: 5 },
        { day: 'Feb', total: 85, cancelled: 4 },
        { day: 'Mar', total: 95, cancelled: 12 },
        { day: 'Apr', total: 70, cancelled: 3 },
        { day: 'May', total: 88, cancelled: 7 },
        { day: 'Jun', total: 92, cancelled: 6 },
        { day: 'Jul', total: 85, cancelled: 4 },
        { day: 'Aug', total: 78, cancelled: 5 },
        { day: 'Sep', total: 82, cancelled: 3 },
        { day: 'Oct', total: 90, cancelled: 8 },
        { day: 'Nov', total: 94, cancelled: 5 },
        { day: 'Dec', total: 98, cancelled: 4 }
    ]

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(prev => {
            const next = !prev
            localStorage.setItem('sidebar-collapsed', String(next))
            return next
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AdminDashboardView
            stats={MOCK_STATS}
            sellers={MOCK_SELLERS}
            monthlyOrders={ordersPerMonth}
            cancelRateData={cancelRatePerMonth}
            isLoading={isLoading}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
        />
    )
}
