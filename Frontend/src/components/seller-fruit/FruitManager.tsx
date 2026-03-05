import React, { useState, useEffect } from 'react';
import { callApi, callApiWithMethod } from '../../utils/apiClient';
import FruitManagerView, { type FruitData } from './FruitManagerView';

const FruitManager = ({ shopId }: { shopId: number }) => {
    const [fruits, setFruits] = useState<FruitData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load danh sách trái cây của Shop
    const loadFruits = async () => {
        setIsLoading(true);
        try {
            const response = await callApi<null, { resultCd: number, data: FruitData[] }>(
                `/api/fruits/shop/${shopId}`
            );
            if (response.resultCd === 0 && response.data) {
                setFruits(response.data);
            }
        } catch (error) {
            console.error("Failed to load fruits:", error);
        } finally {
            // Giả lập delay 600ms theo checklist
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => {
        if (shopId) loadFruits();
    }, [shopId]);

    // Soft Delete: Cập nhật status thành DISCONTINUED
    const handleSoftDelete = async (fruitId: number) => {
        if (!window.confirm("Bạn có chắc muốn ngừng kinh doanh sản phẩm này?")) return;

        try {
            const response = await callApiWithMethod<{ status: string }, { resultCd: number }>(
                'PATCH',
                `/api/fruits/${fruitId}/status`,
                { status: 'DISCONTINUED' }
            );
            if (response.resultCd === 0) {
                loadFruits();
            }
        } catch (error) {
            alert("Không thể xóa sản phẩm lúc này.");
        }
    };

    return (
        <FruitManagerView
            fruits={fruits}
            isLoading={isLoading}
            onSoftDelete={handleSoftDelete}
            onRefresh={loadFruits}
        />
    );
};

export default FruitManager;