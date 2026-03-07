import { useState, useEffect, useCallback } from 'react'
import UserManagementView from './UserManagementView'
import type { UserData, SortConfig } from './UserManagementView'
import { getUsers, updateUserStatus, type UserFilter } from '../../services/userService'

export default function UserManagement() {
    // UI State
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST')
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true'
    })
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(['email', 'role', 'status']))

    // API Data State
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Filter & Pagination State
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [page, setPage] = useState(0)
    const [pageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null })

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const filter: UserFilter = {
                search: searchQuery,
                status: statusFilter,
                page: page,
                size: pageSize,
                sort: sortConfig.key ? `${sortConfig.key},${sortConfig.direction}` : undefined
            }

            const response = await getUsers(filter)

            if (response.resultCd === 0 && response.data) {
                const mappedUsers: UserData[] = response.data.content.map(u => ({
                    id: u.userId,
                    name: u.fullName,
                    username: u.email.split('@')[0], // Fallback username from email
                    fullname: u.fullName,
                    email: u.email,
                    role: u.role as any,
                    status: u.status as any,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=random`,
                    phone: u.phoneNumber
                }))
                setUsers(mappedUsers)
                setTotalPages(response.data.totalPages)
                setTotalElements(response.data.totalElements)
            } else {
                setError(response.message || 'Lỗi khi tải danh sách người dùng')
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ')
        } finally {
            setLoading(false)
        }
    }, [searchQuery, statusFilter, page, pageSize, sortConfig])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleToggleColumn = (col: string) => {
        setVisibleColumns((prev: Set<string>) => {
            const next = new Set(prev)
            if (next.has(col)) next.delete(col)
            else next.add(col)
            return next
        })
    }

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed((prev: boolean) => {
            const next = !prev
            localStorage.setItem('sidebar-collapsed', String(next))
            return next
        })
    }

    const handleSort = (key: keyof UserData) => {
        setSortConfig((prev: SortConfig) => {
            if (prev.key === key) {
                if (prev.direction === 'asc') return { key, direction: 'desc' }
                if (prev.direction === 'desc') return { key: null, direction: null }
            }
            return { key, direction: 'asc' }
        })
    }

    const handleStatusChange = async (id: number, status: string) => {
        try {
            // Map UI status back to API status if needed
            const apiStatus = status.toUpperCase()
            const response = await updateUserStatus(id, apiStatus)
            if (response.resultCd === 0) {
                fetchUsers() // Refresh list
            } else {
                alert(response.message || 'Lỗi khi cập nhật trạng thái')
            }
        } catch (err) {
            alert('Lỗi kết nối khi cập nhật trạng thái')
        }
    }

    const handleViewDetail = (user: UserData) => {
        setSelectedUser(user)
        setViewMode('DETAIL')
    }

    const handleBackToList = () => {
        setViewMode('LIST')
        setSelectedUser(null)
    }

    return (
        <UserManagementView
            users={users}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={(v: string) => {
                setSearchQuery(v)
                setPage(0) // Reset to first page on search
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(s: string) => {
                setStatusFilter(s)
                setPage(0)
            }}
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={(p: number) => setPage(p)}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            onStatusChange={handleStatusChange}
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
            viewMode={viewMode}
            selectedUser={selectedUser}
            onViewDetail={handleViewDetail}
            onBackToList={handleBackToList}
            sortConfig={sortConfig}
            onSort={handleSort}
        />
    )
}

