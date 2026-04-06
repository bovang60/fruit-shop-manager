import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShopById, type ShopDto } from '../../services/shopService';
import { getProducts, type ProductSummaryDto } from '../../services/productService';
import ShopDetailView from './ShopDetailView';

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  
  const [shop, setShop] = useState<ShopDto | null>(null);
  const [products, setProducts] = useState<ProductSummaryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchShopData = async () => {
      if (!shopId) return;
      
      setLoading(true);
      setError('');
      
      try {
        const id = parseInt(shopId, 10);
        if (isNaN(id)) {
          setError('Mã cửa hàng không hợp lệ');
          setLoading(false);
          return;
        }

        // Fetch Shop info and Shop's products in parallel
        const [shopRes, productsRes] = await Promise.all([
          getShopById(id),
          getProducts({ shopId: id, pageSize: 50 }) // fetch up to 50 items for now
        ]);

        if (shopRes.resultCd === 0 && shopRes.data) {
          setShop(shopRes.data);
        } else {
          setError(shopRes.message || 'Không tìm thấy thông tin cửa hàng');
        }

        if (productsRes.resultCd === 0 && productsRes.data) {
          // getProducts returns Paginated response or direct array depending on api.
          // Based on ProductService, it returns ProductListResponse.
          const prodList = (productsRes.data as any).products || productsRes.data;
          setProducts(Array.isArray(prodList) ? prodList : []);
        }
      } catch (err) {
        console.error('Error fetching shop data:', err);
        setError('Lỗi kết nối khi tải cửa hàng');
      } finally {
        setLoading(false);
      }
    };

    void fetchShopData();
  }, [shopId]);

  return <ShopDetailView shop={shop} products={products} loading={loading} error={error} />;
}
