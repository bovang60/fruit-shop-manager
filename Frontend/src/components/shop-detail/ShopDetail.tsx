import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShopById, type ShopDto } from '../../services/shopService';
import { getProducts, type ProductSummaryDto } from '../../services/productService';
import ShopDetailView from './ShopDetailView';
import { addToCart } from '../../services/cartService';
import { getUserWishlist, addToWishlist, removeFromWishlist } from '../../services/wishlistService';
import { getUserFromStorage } from '../../services/authService';
import { usePopup } from '../common/popup';

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();

  const [shop, setShop] = useState<ShopDto | null>(null);
  const [products, setProducts] = useState<ProductSummaryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);

  const { showNotice, showError } = usePopup();
  const user = getUserFromStorage();
  const userId = user?.userId || 0;

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

  useEffect(() => {
    if (userId) {
      loadWishlist();
    }
  }, [userId]);

  const loadWishlist = async () => {
    try {
      const resp = await getUserWishlist(userId);
      if (resp.resultCd === 0 && resp.data) {
        setWishlistIds(resp.data.map((item: any) => item.productId));
      }
    } catch (err) {
      console.error('Error loading wishlist', err);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!userId) {
      showError('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    setAddingToCartId(productId);
    try {
      const response = await addToCart(userId, productId, 1);
      if (response.resultCd === 0) {
        showNotice('Đã thêm vào giỏ hàng!', 'Thành công');
      } else {
        showError(response.message || 'Không thể thêm vào giỏ hàng');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      showError('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setAddingToCartId(null);
    }
  };

  const handleToggleWishlist = async (productId: number, isFavorite: boolean) => {
    if (!userId) {
      showError('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }
    if (isFavorite) {
      setWishlistIds(prev => prev.filter(id => id !== productId));
      await removeFromWishlist(userId, productId).catch(() => setWishlistIds(prev => [...prev, productId]));
    } else {
      setWishlistIds(prev => [...prev, productId]);
      await addToWishlist(userId, productId).catch(() => setWishlistIds(prev => prev.filter(id => id !== productId)));
    }
  };

  return (
    <ShopDetailView 
      shop={shop} 
      products={products} 
      loading={loading} 
      error={error}
      wishlistIds={wishlistIds}
      addingToCartId={addingToCartId}
      onAddToCart={handleAddToCart}
      onToggleWishlist={handleToggleWishlist}
      userRole={user?.role}
    />
  );
}
