import HomeView from './HomeView'
import { useMemo, useState, useEffect } from 'react'
import { 
  getProducts, 
  getNewArrivals, 
  getTrendingProducts,
  addToCart,
  getErrorMessage 
} from '../../services/productService'
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

export default function Home() {
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [trending, setTrending] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 25
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'popularity',
    sortOrder: 'desc'
  })

  // Load products on mount and when filters/page change
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
        setError(getErrorMessage(response.message || 'Failed to load products'))
        setProducts([])
      }
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Network error. Please try again.')
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
   * Handle search query change
   */
  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }))
    setPage(1) // Reset to first page on new search
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
    try {
      const response = await addToCart({ productId, quantity: 1 })
      
      if (response.resultCd === 0) {
        alert('Đã thêm vào giỏ hàng!')
      } else {
        alert(getErrorMessage(response.message || 'Failed to add to cart'))
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('Có lỗi xảy ra. Vui lòng thử lại!')
    }
  }

  // Memoized displayed products (already filtered by API, no need to filter again)
  const displayedProducts = useMemo(() => products, [products])

  return (
    <HomeView
      query={filters.search}
      onQueryChange={handleSearchChange}
      products={products}
      displayed={displayedProducts}
      newArrivals={newArrivals}
      trending={trending}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onAddToCart={handleAddToCart}
      loading={loading}
      error={error}
    />
  )
}
