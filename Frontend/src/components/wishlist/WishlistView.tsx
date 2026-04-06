import { useNavigate } from "react-router-dom";
import type { WishlistResponseDto } from "../../services/wishlistService";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import "./Wishlist.css";

export interface Props {
  items: WishlistResponseDto[];
  loading: boolean;
  onRemove: (productId: number) => void;
  onAddToCart: (productId: number) => void;
  onBack: () => void;
}

export default function WishlistView({ items, loading, onRemove, onAddToCart, onBack }: Props) {
  const navigate = useNavigate();
  return (
    <div className="wishlist-root">
      <Header />
      <div className="wishlist-title-bar">
        <div className="wishlist-container wishlist-header-flex" style={{ justifyContent: 'space-between' }}>
           <div className="wishlist-header-flex">
              <button onClick={onBack} className="wishlist-back-btn">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <h1 className="wishlist-title">Danh sách yêu thích</h1>
                <p className="wishlist-subtitle">{items.length} sản phẩm</p>
              </div>
           </div>
        </div>
      </div>
      <main className="wishlist-main">
        {loading ? <p className="wishlist-loading">Đang tải dữ liệu...</p> : items.length === 0 ? (
           <div className="wishlist-empty-state">
             <div className="wishlist-empty-icon-wrap">
               <span className="material-symbols-outlined wishlist-empty-icon">heart_broken</span>
             </div>
             <h2 className="wishlist-empty-title">Danh sách yêu thích trống</h2>
             <p className="wishlist-empty-text">Bạn chưa lưu sản phẩm nào. Hãy khám phá các trái cây tươi ngon của chúng tôi và thả tim nhé!</p>
             <button onClick={onBack} className="wishlist-btn">
                Trở về cửa hàng
             </button>
           </div>
        ) : (
             <div className="wishlist-grid">
               {items.map((it) => (
                 <div 
                   key={it.productId} 
                   className="wishlist-card"
                   onClick={() => navigate(`/product/${it.productId}`)}
                   style={{ cursor: 'pointer' }}
                 >
                    <div className="wishlist-card-media">
                        <img src={it.imageUrl} className="wishlist-card-img" alt={it.productName} />
                        <button 
                          onClick={(e) => { e.stopPropagation(); onRemove(it.productId); }} 
                          className="wishlist-remove-btn" 
                          title="Xóa khỏi yêu thích"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>delete</span>
                        </button>
                    </div>
                    <div className="wishlist-card-info">
                      <div className="wishlist-card-details">
                        <div>
                          <p className="wishlist-card-name">{it.productName}</p>
                          <p className="wishlist-card-desc">Sản phẩm yêu thích</p>
                        </div>
                        <p className="wishlist-card-price">₫{it.price.toLocaleString("vi-VN")}</p>
                      </div>
                      <button
                        className="wishlist-add-to-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(it.productId);
                        }}
                      >
                        🛒 Thêm vào giỏ
                      </button>
                    </div>
                 </div>
               ))}
             </div>
        )}
      </main>
      <div className="wishlist-footer-wrap">
         <Footer />
      </div>
    </div>
  );
}
