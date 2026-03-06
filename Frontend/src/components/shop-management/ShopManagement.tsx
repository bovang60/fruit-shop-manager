import React, { useState, useEffect } from 'react';
import ShopManagementView, { type Shop } from './ShopManagementView';
import { usePopup } from '../common/popup';

const ShopManagement: React.FC = () => {
    const { showNotice, showConfirm, showError } = usePopup();
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
    const [loading] = useState(false);

    const fetchShops = () => {
        // Mock Data based on activeTab
        const mockShops: Shop[] = [
            { id: 1, shopName: 'Sun Kissed Orchards', ownerName: 'Jonathan Miller', regDate: 'October 24, 2023', status: 'PENDING', description: 'Sun Kissed Orchards is a family-owned sustainable farm specializing in heritage citrus and stone fruits. We pride ourselves on tree-ripened produce delivered straight from our orchards to local communities. All our practices are organic-certified, ensuring the highest quality and nutritional value for our customers. We seek to join the platform to expand our reach to health-conscious consumers in the greater metropolitan area.', ownerPhone: '+1 (555) 902-3482', ownerEmail: 'contact@sunkisedorchards.com', businessAddress: '1242 Harvest Lane, Riverside Valley, CA 92501', documentUrls: ['Business_License.pdf', 'Organic_Certification.pdf'], productCount: 150, yearsInBusiness: 12, locationType: 'Rural', staffCount: 25 },
            { id: 2, shopName: 'Organic Veggies', ownerName: 'Jane Smith', regDate: '2023-02-15', status: 'APPROVED', description: 'Organic only', ownerPhone: '0987654321', ownerEmail: 'jane@example.com', businessAddress: '456 Farm Rd' },
            { id: 3, shopName: 'Bad Apples', ownerName: 'Bad Guy', regDate: '2023-03-10', status: 'REJECTED', rejectReason: 'Incomplete documents' },
        ];
        // Filter by tab status
        const filtered = mockShops.filter(s => s.status === activeTab || (activeTab === 'APPROVED' && s.status === 'SUSPENDED'));
        setShops(filtered);
    };

    useEffect(() => {
        fetchShops();
    }, [activeTab]);

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev
            localStorage.setItem('sidebar-collapsed', String(next))
            return next
        })
    }

    const handleApprove = (id: number) => {
        showConfirm(
            `Bạn có chắc chắn muốn phê duyệt shop này?`,
            () => {
                // Call API here
                showNotice(`Shop ${id} đã được phê duyệt thành công!`);
                setViewMode('LIST');
                fetchShops();
            },
            'Xác nhận phê duyệt'
        );
    };

    const handleSuspend = (id: number) => {
        showConfirm(
            `Bạn có chắc chắn muốn thay đổi trạng thái shop này?`,
            () => {
                // Call API here
                showNotice(`Shop ${id} đã thay đổi trạng thái`);
                fetchShops();
            },
            'Xác nhận thay đổi'
        );
    }

    const filteredShops = shops.filter(shop =>
        shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalElements = filteredShops.length;
    const totalPages = Math.ceil(totalElements / 10) || 1;

    return (
        <ShopManagementView
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            shops={filteredShops}
            viewMode={viewMode}
            selectedShop={selectedShop}
            setViewMode={setViewMode}
            onApprove={handleApprove}
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
