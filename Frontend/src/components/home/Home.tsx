import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoadingModal } from '../common/loading';
import HomeView from './HomeView.tsx';
import {
  getProducts,
  getTrendingProducts,
  getNewArrivals,
} from '../../services/productService';
import { getCategoryFilterList } from '../../services/categoryService';
import { addToCart } from '../../services/cartService';
import { getActiveSliders, type SliderDto } from '../../services/sliderService';
import { getUserWishlist, addToWishlist, removeFromWishlist } from '../../services/wishlistService.ts';
import type {
  Product,
  FilterState,
  HomeCategory
} from './Home.types.ts';

import { usePopup } from '../common/popup';
import { getUserFromStorage } from '../../services/authService';

export default function Home() {
  const { showNotice, showError } = usePopup();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shopIdParam = searchParams.get('shopId');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [sliders, setSliders] = useState<SliderDto[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const user = getUserFromStorage();
  const userId = user?.userId || 0;

  const [filters] = useState<FilterState>({
    search: '',
    sortBy: 'popularity',
    sortOrder: 'desc',
    shopId: shopIdParam ? parseInt(shopIdParam, 10) : undefined
  });

  // Mapping function inside to access current scope if needed
  const mapToProductItem = (apiP: any): Product => {
    let computedTag = undefined;
    if (apiP.tags && Array.isArray(apiP.tags) && apiP.tags.length > 0) {
      computedTag = apiP.tags[0]; // Take the first tag (e.g. "NEW", "HOT", "ORGANIC")
    } else {
      computedTag = apiP.isOrganic ? 'ORGANIC' : (apiP.discount > 0 ? 'SALE' : undefined);
    }

    return {
      id: apiP.productId || apiP.id,
      name: apiP.name,
      price: (apiP.price || 0).toLocaleString('vi-VN') + '₫',
      img: apiP.imageUrl || apiP.img || 'https://via.placeholder.com/400',
      desc: apiP.description || apiP.desc,
      tag: computedTag,
      isFavorite: false
    };
  };

  useEffect(() => { loadProducts(); }, [filters]);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([
        loadTrending(),
        loadNewArrivals(),
        loadCategories(),
        loadSliders(),
        userId ? loadWishlist() : Promise.resolve()
      ]);
      setLoading(false);
    };
    fetchInitialData();
  }, [userId]);

  const [newArrivalsIndex, setNewArrivalsIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0);

  const loadProducts = async () => {
    try {
      const response = await getProducts({
        page: 1, 
        pageSize: 12, 
        search: filters.search || undefined,
        category: filters.category, 
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder, 
        shopId: filters.shopId
      });
      if (response.resultCd === 0 && response.data) {
        setProducts(response.data.products.map(mapToProductItem));
      }
    } catch (err) {
      console.error("Home: Error loading products", err);
    }
  };

  const loadTrending = async () => {
    try {
      const response = await getTrendingProducts(15);
      if (response.resultCd === 0 && response.data) {
        setTrending(response.data.map(mapToProductItem));
      }
    } catch (err) {}
  };

  const loadNewArrivals = async () => {
    try {
      const response = await getNewArrivals(15);
      if (response.resultCd === 0 && response.data) {
        setNewArrivals(response.data.map(mapToProductItem));
      }
    } catch (err) {}
  };

  const loadCategories = async () => {
    try {
      const response = await getCategoryFilterList();
      if (response.resultCd === 0 && response.data) {
        setCategories(response.data.map(c => ({ id: String(c.categoryId), name: c.categoryName })));
      }
    } catch (err) {}
  };

  const loadSliders = async () => {
    try {
      const response = await getActiveSliders();
      if (response.resultCd === 0 && response.data) {
        setSliders(response.data);
      }
    } catch (err) {}
  };

  const loadWishlist = async () => {
    try {
      const resp = await getUserWishlist(userId);
      if (resp.resultCd === 0 && resp.data) {
        setWishlistIds(resp.data.map((item: any) => item.productId));
      }
    } catch (err) {}
  };

  const handleAddToCart = async (productId: number) => {
    if (!userId) { 
      showError('Vui lòng đăng nhập để thực hiện thao tác này'); 
      return; 
    }
    setAddingToCartId(productId);
    try {
      const response = await addToCart(userId, productId, 1);
      if (response.resultCd === 0) {
        showNotice('Đã thêm sản phẩm vào giỏ hàng thành công');
      }
    } catch (err) {
      showError('Không thể thêm sản phẩm vào giỏ hàng');
    } finally { 
      setAddingToCartId(null); 
    }
  };

  const handleToggleWishlist = async (productId: number, isFavorite: boolean) => {
    if (!userId) {
      showError('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }
    // Optimistic UI update
    if (isFavorite) {
       setWishlistIds(prev => prev.filter(id => id !== productId));
       await removeFromWishlist(userId, productId).catch(() => setWishlistIds(prev => [...prev, productId]));
    } else {
       setWishlistIds(prev => [...prev, productId]);
       await addToWishlist(userId, productId).catch(() => setWishlistIds(prev => prev.filter(id => id !== productId)));
    }
  };

  const trendingWithFavs = useMemo(() => 
    trending.map(p => ({ ...p, isFavorite: wishlistIds.includes(p.id) })), 
  [trending, wishlistIds]);

  const newArrivalsWithFavs = useMemo(() => 
    newArrivals.map(p => ({ ...p, isFavorite: wishlistIds.includes(p.id) })), 
  [newArrivals, wishlistIds]);

  return (
    <>
      <HomeView
        products={products}
        trending={trendingWithFavs}
        newArrivals={newArrivalsWithFavs}
        newArrivalsIndex={newArrivalsIndex}
        onNewArrivalsNext={() => setNewArrivalsIndex(i => Math.min(i + 5, Math.max(0, newArrivals.length - 5)))}
        onNewArrivalsPrev={() => setNewArrivalsIndex(i => Math.max(0, i - 5))}
        trendingIndex={trendingIndex}
        onTrendingNext={() => setTrendingIndex(i => Math.min(i + 5, Math.max(0, trending.length - 5)))}
        onTrendingPrev={() => setTrendingIndex(i => Math.max(0, i - 5))}
        categories={categories}
        sliders={sliders}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        addingToCartId={addingToCartId}
        error={""}
        onNavigateToProducts={() => navigate('/products')}
        onNavigateToHome={() => navigate('/home')}
      />
      <LoadingModal
        isOpen={loading}
        message="Đang tải thông tin..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </>
  );
}
