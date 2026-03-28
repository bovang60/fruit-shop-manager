import { useState, useEffect } from 'react';
import { callApi, callApiWithMethod } from '../../utils/apiClient'; // Tích hợp API Client
import { useResolvedShopId } from '../seller/useResolvedShopId';
import VoucherView, { type VoucherData } from './VoucherView'; // Sử dụng type-only import

type SaveVoucherRequest = Partial<VoucherData> & {
    shopId: number;
};

const Voucher = ({ shopId }: { shopId: number }) => {
    const { shopId: resolvedShopId, isResolving } = useResolvedShopId(shopId);
    const [vouchers, setVouchers] = useState<VoucherData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Tải danh sách Voucher của Shop
    const loadVouchers = async () => {
        setIsLoading(true);
        try {
            const response = await callApi<null, { resultCd: number, data: VoucherData[] }>(
                `/api/vouchers/shop/${resolvedShopId}`
            );
            if (response.resultCd === 0 && Array.isArray(response.data)) {
                setVouchers(
                    response.data.map((voucher) => ({
                        voucherId: Number(voucher?.voucherId || 0),
                        code: voucher?.code || '',
                        discountValue: Number(voucher?.discountValue || 0),
                        minOrderValue: Number(voucher?.minOrderValue || 0),
                        expiryDate: voucher?.expiryDate || '',
                        status: voucher?.status || 'ACTIVE',
                    }))
                );
            } else {
                setVouchers([]);
            }
        } catch (error) {
            console.error("Failed to load vouchers:", error);
            setVouchers([]);
        } finally {
            // Delay 600ms theo checklist
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => {
        if (resolvedShopId) loadVouchers();
        else if (!isResolving) setIsLoading(false);
    }, [resolvedShopId, isResolving]);

    // Thêm mới hoặc cập nhật Voucher
    const handleSaveVoucher = async (data: Partial<VoucherData>) => {
        try {
            const response = await callApiWithMethod<SaveVoucherRequest, { resultCd: number }>(
                'POST',
                '/api/vouchers',
                { ...data, shopId: resolvedShopId }
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
            isLoading={isLoading || isResolving}
            onSave={handleSaveVoucher}
            onRefresh={loadVouchers}
        />
    );
};

export default Voucher;
