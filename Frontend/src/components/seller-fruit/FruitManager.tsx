import { useState, useEffect } from 'react';
import { callApi, callApiWithMethod } from '../../utils/apiClient';
import { useResolvedShopId } from '../seller/useResolvedShopId';
import FruitManagerView, { type FruitData } from './FruitManagerView';

const FruitManager = ({ shopId }: { shopId: number }) => {
    const { shopId: resolvedShopId, isResolving } = useResolvedShopId(shopId);
    const [fruits, setFruits] = useState<FruitData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load danh sách trái cây của Shop
    const loadFruits = async () => {
        setIsLoading(true);
        try {
            const response = await callApi<null, { resultCd: number, data: FruitData[] }>(
                `/api/fruits/shop/${resolvedShopId}`
            );
            if (response.resultCd === 0 && Array.isArray(response.data)) {
                setFruits(
                    response.data.map((fruit) => ({
                        fruitId: Number(fruit?.fruitId || 0),
                        fruitName: fruit?.fruitName || 'N/A',
                        price: Number(fruit?.price || 0),
                        stockQuantity: Number(fruit?.stockQuantity || 0),
                        status: fruit?.status || 'AVAILABLE',
                        imageUrl: fruit?.imageUrl,
                    }))
                );
            } else {
                setFruits([]);
            }
        } catch (error) {
            console.error("Failed to load fruits:", error);
            setFruits([]);
        } finally {
            // Giả lập delay 600ms theo checklist
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => {
        if (resolvedShopId) loadFruits();
        else if (!isResolving) setIsLoading(false);
    }, [resolvedShopId, isResolving]);

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
            isLoading={isLoading || isResolving}
            onSoftDelete={handleSoftDelete}
            onRefresh={loadFruits}
        />
    );
};

export default FruitManager;
