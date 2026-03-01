import React, { useState, useEffect } from 'react';
import { callApi, callApiWithMethod } from '../../utils/apiClient'; // Tích hợp API Client
import VoucherView, { type VoucherData } from './VoucherView'; // Sử dụng type-only import

const Voucher = ({ shopId }: { shopId: number }) => {
    const [vouchers, setVouchers] = useState<VoucherData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Tải danh sách Voucher của Shop
    const loadVouchers = async () => {
        setIsLoading(true);
        try {
            const response = await callApi<null, { resultCd: number, data: VoucherData[] }>(
                `/api/vouchers/shop/${shopId}`
            );
            if (response.resultCd === 0 && response.data) {
                setVouchers(response.data);
            }
        } catch (error) {
            console.error("Failed to load vouchers:", error);
        } finally {
            // Delay 600ms theo checklist
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => {
        if (shopId) loadVouchers();
    }, [shopId]);

    // Thêm mới hoặc cập nhật Voucher
    const handleSaveVoucher = async (data: Partial<VoucherData>) => {
        try {
            const response = await callApiWithMethod<Partial<VoucherData>, { resultCd: number }>(
                'POST',
                '/api/vouchers',
                { ...data, shopId }
            );
            if (response.resultCd === 0) {
                alert("Lưu voucher thành công!");
                loadVouchers();
            }
        } catch (error) {
            alert("Lỗi khi lưu voucher.");
        }
    };

    return (
        <VoucherView
            vouchers={vouchers}
            isLoading={isLoading}
            onSave={handleSaveVoucher}
            onRefresh={loadVouchers}
        />
    );
};

export default Voucher;