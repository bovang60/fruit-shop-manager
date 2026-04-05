import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistView from './WishlistView';
import { getUserWishlist, removeFromWishlist } from '../../services/wishlistService';
import { addToCart } from '../../services/cartService';
import { getUserFromStorage } from '../../services/authService';
import { usePopup } from '../common/popup';

export default function Wishlist() {
  const navigate = useNavigate();
  const { showNotice, showError } = usePopup();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = getUserFromStorage();
  const userId = user?.userId || 0;

  useEffect(() => {
    if (!userId) {
      showError('Vui lòng đăng nhập để xem danh sách yêu thích');
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [userId]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const resp = await getUserWishlist(userId);
      if (resp.resultCd === 0 && resp.data) setItems(resp.data);
    } catch (err) {} finally { setLoading(false); }
  };

  const handleRemove = async (productId: number) => {
    try {
      const resp = await removeFromWishlist(userId, productId);
      if (resp.resultCd === 0) {
        setItems(prev => prev.filter(item => item.productId !== productId));
        showNotice('Đã xóa khỏi wishlist');
      }
    } catch (err) {}
  };

  const handleAddToCart = async (productId: number) => {
    try {
      const resp = await addToCart(userId, productId, 1);
      if (resp.resultCd === 0) showNotice('Đã thêm vào giỏ hàng');
    } catch (err) {}
  };

  return (
    <WishlistView 
      items={items}
      loading={loading}
      onRemove={handleRemove}
      onAddToCart={handleAddToCart}
      onBack={() => navigate(-1)}
    />
  );
}
