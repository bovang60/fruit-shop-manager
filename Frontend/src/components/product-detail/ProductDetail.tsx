import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetailView from './ProductDetailView.tsx';
import { 
  getProductDetail, 
  getRelatedProducts 
} from '../../services/productService';
import { addToCart } from '../../services/cartService';
import { getUserFromStorage } from '../../services/authService';
import type { 
  ProductDetailDto, 
  ProductSummaryDto
} from '../../services/productService';
import { getFeedbackByProduct, type FeedbackDto } from '../../services/feedbackService';
import { usePopup } from '../common/popup';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const popup = usePopup();

  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummaryDto[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      if (!productId) {
        setError("Không tìm thấy sản phẩm");
        setLoading(false);
        return;
      }

      const id = parseInt(productId, 10);
      if (isNaN(id)) {
        setError("Không tìm thấy sản phẩm");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setProduct(null); // Clear previous product
      setQuantity(1);   // Reset qty

      try {
        const [detailRes, relatedRes, feedbackRes] = await Promise.all([
          getProductDetail(id),
          getRelatedProducts(id, 8),
          getFeedbackByProduct(id)
        ]);

        if (detailRes.resultCd === 0 && detailRes.data) {
          setProduct(detailRes.data);
          
          if (relatedRes.resultCd === 0 && relatedRes.data) {
            setRelatedProducts(relatedRes.data);
          } else {
            setRelatedProducts([]);
          }

          if (feedbackRes.resultCd === 0 && feedbackRes.data) {
            setFeedbacks(feedbackRes.data);
          } else {
            setFeedbacks([]);
          }
        } else {
          setError(detailRes.message || "Không tìm thấy sản phẩm");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    const user = getUserFromStorage();
    const userId = user?.userId || 0;
    if (!userId) {
      popup.showWarning("Vui lòng đăng nhập để thêm vào giỏ hàng", "Yêu cầu đăng nhập");
      navigate('/login');
      return;
    }
    
    setAddingToCart(true);
    try {
      const response = await addToCart(userId, product.productId, quantity);
      if (response.resultCd === 0) {
        popup.showSuccess("Đã thêm sản phẩm vào giỏ hàng", "Thành công");
      } else {
        popup.showError(response.message || "Không thể thêm vào giỏ hàng", "Lỗi");
      }
    } catch (err) {
      popup.showError("Đã xảy ra sự cố khi thêm vào giỏ hàng.", "Lỗi");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <ProductDetailView 
      product={product}
      relatedProducts={relatedProducts}
      feedbacks={feedbacks}
      loading={loading}
      error={error}
      quantity={quantity}
      onQuantityChange={setQuantity}
      onAddToCart={handleAddToCart}
      addingToCart={addingToCart}
    />
  );
}
