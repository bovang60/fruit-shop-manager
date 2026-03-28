import React, { useState, useEffect, useCallback } from 'react';
import ShopManagementView, { type Shop } from './ShopManagementView';
import { usePopup } from '../common/popup';
import { getShops, approveShop, rejectShop, suspendShop, type ShopDto } from '../../services/shopService';

const ShopManagement: React.FC = () => {
    const { showNotice, showConfirm, showError, showWarning, showPrompt } = usePopup();
    // UI State
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true'
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('PENDING');
    const [shops, setShops] = useState<Shop[]>([]);
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadShops = useCallback(async () => {
        setLoading(true);
        try {
            const filter: any = {
                status: activeTab === 'ALL' ? undefined : activeTab,
                page: page,
                size: 10,
                sort: 'createdAt,desc'
            };

            const response = await getShops(filter);

            if (response.resultCd === 0 && response.data) {
                const mappedShops: Shop[] = response.data.content.map((dto: ShopDto) => ({
                    id: dto.shopId,
                    shopName: dto.shopName,
                    ownerName: dto.ownerName,
                    regDate: new Date(dto.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    status: dto.status as any,
                    description: dto.description,
                    ownerPhone: dto.ownerPhone,
                    ownerEmail: dto.ownerEmail,
                    businessAddress: dto.businessAddress,
                    documentUrls: dto.documentUrls,
                    rejectReason: dto.rejectReason
                    // Other fields (productCount, etc.) can be added if available in DTO
                }));

                setShops(mappedShops);
                setTotalElements(response.data.totalElements);
                setTotalPages(response.data.totalPages);
            } else {
                showError(response.message || "Không thể tải danh sách cửa hàng");
            }
        } catch (error) {
            console.error("Failed to fetch shops:", error);
            showError("Lỗi kết nối khi tải danh sách cửa hàng");
        } finally {
            setLoading(false);
        }
    }, [activeTab, page, showError]);

    useEffect(() => {
        loadShops();
    }, [loadShops]);

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev
            localStorage.setItem('sidebar-collapsed', String(next))
            return next
        })
    }

    const handleApprove = (id: number) => {
        showConfirm(
            `Bạn có chắc chắn muốn phê duyệt shop này ? `,
            async () => {
                setLoading(true);
                try {
                    const response = await approveShop(id);
                    if (response.resultCd === 0) {
                        showNotice(`Shop đã được phê duyệt thành công!`);
                        setViewMode('LIST');
                        loadShops();
                    } else {
                        showError(response.message || "Không thể phê duyệt cửa hàng");
                    }
                } catch (error) {
                    showError("Lỗi kết nối khi phê duyệt cửa hàng");
                } finally {
                    setLoading(false);
                }
            },
            'Xác nhận phê duyệt'
        );
    };

    const handleReject = (id: number) => {
        showPrompt(
            "Vui lòng nhập lý do từ chối đơn đăng ký này:",
            (reason: string) => {

                if (!reason || reason.trim().length < 3) {
                    showWarning("Lý do quá ngắn! Vui lòng nhập ít nhất 3 ký tự.");
                    return;
                }
                if (reason.trim().length > 255) {
                    showWarning("Lý do quá dài! Vui lòng nhập dưới 255 ký tự.");
                    return;
                }

                showConfirm(
                    `Bạn có chắc chắn muốn từ chối shop này với lý do: "${reason.trim()}" ? `,
                    async () => {
                        setLoading(true);
                        try {
                            const response = await rejectShop(id, reason.trim());
                            if (response.resultCd === 0) {
                                showNotice(`Shop đã bị từ chối thành công!`);
                                setViewMode('LIST');
                                loadShops();
                            } else {
                                showError(response.message || "Không thể từ chối cửa hàng");
                            }
                        } catch (error) {
                            showError("Lỗi kết nối khi từ chối cửa hàng");
                        } finally {
                            setLoading(false);
                        }
                    },
                    'Xác nhận từ chối'
                );
            },
            'Từ chối cửa hàng',
            'Nhập lý do tại đây...'
        );
    };


    const handleSuspend = (id: number) => {
        showConfirm(
            `Bạn có chắc chắn muốn đình chỉ toàn bộ hoạt động của shop này?`,
            async () => {
                setLoading(true);
                try {
                    const response = await suspendShop(id);
                    if (response.resultCd === 0) {
                        showNotice(`Shop đã bị đình chỉ thành công!`);
                        setViewMode('LIST');
                        loadShops();
                    } else {
                        showError(response.message || "Không thể đình chỉ cửa hàng");
                    }
                } catch (error) {
                    showError("Lỗi kết nối khi đình chỉ cửa hàng");
                } finally {
                    setLoading(false);
                }
            },
            'Xác nhận đình chỉ'
        );
    };


    // Local search filtering as backend doesn't seem to support search param in guide
    const filteredShops = shops.filter(shop =>
        shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ShopManagementView
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={(tab) => { setActiveTab(tab); setPage(0); }}
            shops={filteredShops}
            viewMode={viewMode}
            selectedShop={selectedShop}
            setViewMode={setViewMode}
            onApprove={handleApprove}
            onReject={handleReject}
            onSuspend={handleSuspend}
            setSelectedShop={setSelectedShop}
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setPage}
            loading={loading}
        />
    );
};

export default ShopManagement;
