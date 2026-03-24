import HomeView from './HomeView'
import { useMemo, useState, useEffect } from 'react'
import {
  getProducts,
  getNewArrivals,
  getTrendingProducts,
  getErrorMessage
} from '../../services/productService'
import { addToCart } from '../../services/cartService'
import type {
  Product,
  FilterState,
  mapProductToUI,
  mapProductSummaryToUI
} from './Home.types'

// Import mapper functions
import {
  mapProductToUI as mapProduct,
  mapProductSummaryToUI as mapSummary
} from './Home.types'

import { usePopup } from '../common/popup'

export default function Home() {
  const { showNotice, showError } = usePopup()
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [trending, setTrending] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null)

  // Mock userId (use auth context if available)
  const userId = 3

  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 25

  // Filter state (applied filters that trigger API calls)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  })

  // Temporary search input state (does NOT trigger API until submitted)
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    loadProducts()
  }, [page, filters])

  // Load new arrivals and trending on mount
  useEffect(() => {
    loadNewArrivals()
    loadTrending()
  }, [])

  /**
   * Load main product list with current filters
   */
  const loadProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getProducts({
        page,
        pageSize,
        search: filters.search || undefined,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        origin: filters.origin,
        organic: filters.organic,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })

      if (response.resultCd === 0 && response.data) {
        // Map API products to UI format
        const uiProducts = response.data.products.map(mapProduct)
        setProducts(uiProducts)
        setTotalPages(response.data.pagination.totalPages)
      } else {
        setError(getErrorMessage(response.message || 'Không thể tải sản phẩm'))
        setProducts([])
      }
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Lỗi kết nối. Vui lòng thử lại.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load new arrivals section
   */
  const loadNewArrivals = async () => {
    try {
      const response = await getNewArrivals(10)

      if (response.resultCd === 0 && response.data) {
        const uiProducts = response.data.map(mapSummary)
        setNewArrivals(uiProducts)
      }
    } catch (err) {
      console.error('Error loading new arrivals:', err)
    }
  }

  /**
   * Load trending products section
   */
  const loadTrending = async () => {
    try {
      const response = await getTrendingProducts(10)

      if (response.resultCd === 0 && response.data) {
        const uiProducts = response.data.map(mapSummary)
        setTrending(uiProducts)
      }
    } catch (err) {
      console.error('Error loading trending products:', err)
    }
  }

  /**
   * Handle search query change - only updates input, does NOT call API
   */
  const handleSearchChange = (query: string) => {
    setSearchInput(query)
  }

  /**
   * Submit search - applies the search query and calls API
   */
  const handleSearchSubmit = () => {
    setFilters(prev => ({ ...prev, search: searchInput }))
    setPage(1)
  }

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /**
   * Handle add to cart
   */
  const handleAddToCart = async (productId: number) => {
    setAddingToCartId(productId)
    try {
      const response = await addToCart(userId, productId, 1)

      if (response.resultCd === 0) {
        showNotice('Đã thêm vào giỏ hàng!', 'Thành công')
      } else {
        showError(getErrorMessage(response.message || 'Không thể thêm vào giỏ hàng'))
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
      showError('Có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setAddingToCartId(null)
    }
  }

  /**
   * Handle category filter change - applies immediately
   */
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: category || undefined }))
    setPage(1)
  }

  /**
   * Handle price range change - applies immediately
   */
  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice }))
    setPage(1)
  }

  /**
   * Handle origin filter change - applies immediately
   */
  const handleOriginChange = (origin: string | undefined) => {
    setFilters(prev => ({ ...prev, origin }))
    setPage(1)
  }

  /**
   * Handle organic filter change - applies immediately
   */
  const handleOrganicChange = (organic: boolean | undefined) => {
    setFilters(prev => ({ ...prev, organic }))
    setPage(1)
  }

  /**
   * Handle sort change
   */
  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }))
    setPage(1)
  }

  // Memoized displayed products (already filtered by API, no need to filter again)
  const displayedProducts = useMemo(() => products, [products])

  return (
    <HomeView
      query={searchInput}
      onQueryChange={handleSearchChange}
      onSearchSubmit={handleSearchSubmit}
      products={products}
      displayed={displayedProducts}
      newArrivals={newArrivals}
      trending={trending}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onAddToCart={handleAddToCart}
      addingToCartId={addingToCartId}
      loading={loading}
      error={error}
      // Filter props
      category={filters.category}
      minPrice={filters.minPrice}
      maxPrice={filters.maxPrice}
      origin={filters.origin}
      organic={filters.organic}
      sortBy={filters.sortBy}
      sortOrder={filters.sortOrder}
      // Filter handlers
      onCategoryChange={handleCategoryChange}
      onPriceChange={handlePriceChange}
      onOriginChange={handleOriginChange}
      onOrganicChange={handleOrganicChange}
      onSortChange={handleSortChange}
    />
  )
}
