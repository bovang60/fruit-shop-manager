import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFeedbackByProduct, type FeedbackDto } from "../../services/feedbackService";
import { getProductDetail, type ProductDetailDto } from "../../services/productService";
import SellerProductDetailView from "./SellerProductDetailView";

export default function SellerProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      if (!productId) {
        setError("Không tìm thấy sản phẩm");
        setLoading(false);
        return;
      }

      const id = parseInt(productId, 10);
      if (Number.isNaN(id)) {
        setError("Không tìm thấy sản phẩm");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const [detailRes, feedbackRes] = await Promise.all([
          getProductDetail(id),
          getFeedbackByProduct(id),
        ]);

        if (detailRes.resultCd === 0 && detailRes.data) {
          setProduct(detailRes.data);
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

    void loadData();
  }, [productId]);

  return (
    <SellerProductDetailView
      product={product}
      feedbacks={feedbacks}
      loading={loading}
      error={error}
      onBack={() => navigate("/seller/fruits")}
    />
  );
}
