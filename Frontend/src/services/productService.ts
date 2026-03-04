/**
 * Product Service
 * 
 * Handles API calls for product management and shopping cart
 * Following the API Client Guide pattern
 */

import { get, post } from '../utils/apiClient'
import type { ApiResponse } from '../utils/apiClient'

// ============= Types =============

export interface ProductDto {
  productId: number
  name: string
  description: string
  price: number
  originalPrice?: number
  imageUrl: string
  category: string
  origin: string
  isOrganic: boolean
  stock: number
  unit: string
  rating: number
  reviewCount: number
  discount: number
  tags: string[]
  isFavorite: boolean
}

export interface ProductSummaryDto {
  productId: number
  name: string
  price: number
  imageUrl: string
  tags: string[]
  rating: number
  soldCount?: number
  viewCount?: number
  createdAt?: string
}

export interface PaginationDto {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ProductListResponse {
  products: ProductDto[]
  pagination: PaginationDto
  appliedFilters: {
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    origin?: string
    organic?: boolean
    sortBy: string
    sortOrder: string
  }
}

export interface ProductListParams {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  origin?: string
  organic?: boolean
  sortBy?: string
  sortOrder?: string
}

export interface AddToCartRequest {
  productId: number
  quantity: number
}

export interface CartItemDto {
  cartItemId: number
  productId: number
  productName: string
  price: number
  quantity: number
  subtotal: number
  imageUrl: string
}

export interface CartDto {
  cartId: number
  userId: number
  totalItems: number
  totalPrice: number
  items: CartItemDto[]
}

// ============= API Functions =============

/**
 * Get products list with pagination, search, filter, and sort
 * 
 * Endpoint: GET /api/products
 * 
 * @param params - Query parameters for filtering, searching, sorting
 * @returns Product list with pagination
 * 
 * @example
 * const response = await getProducts({ 
 *   page: 1, 
 *   pageSize: 25, 
 *   search: 'táo',
 *   category: 'seasonal',
 *   sortBy: 'price',
 *   sortOrder: 'asc'
 * })
 */
export async function getProducts(
  params: ProductListParams = {}
): Promise<ApiResponse<ProductListResponse>> {
  try {
    // Build query params object
    const queryParams: Record<string, string | number | boolean> = {}
    
    if (params.page !== undefined) queryParams.page = params.page
    if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
    if (params.search) queryParams.search = params.search
    if (params.category) queryParams.category = params.category
    if (params.minPrice !== undefined) queryParams.minPrice = params.minPrice
    if (params.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice
    if (params.origin) queryParams.origin = params.origin
    if (params.organic !== undefined) queryParams.organic = params.organic
    if (params.sortBy) queryParams.sortBy = params.sortBy
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder
    
    return await get<ApiResponse<ProductListResponse>>(
      '/api/products',
      queryParams
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      resultCd: 1,
      message: 'Failed to fetch products. Please try again.',
      data: null
    }
  }
}

/**
 * Get new arrivals products
 * 
 * Endpoint: GET /api/products/new-arrivals
 * 
 * @param limit - Number of products to return (default: 10)
 * @returns List of newest products
 * 
 * @example
 * const response = await getNewArrivals(10)
 */
export async function getNewArrivals(
  limit: number = 10
): Promise<ApiResponse<ProductSummaryDto[]>> {
  try {
    return await get<ApiResponse<ProductSummaryDto[]>>(
      '/api/products/new-arrivals',
      { limit }
    )
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
    return {
      resultCd: 1,
      message: 'Failed to fetch new arrivals.',
      data: null
    }
  }
}

/**
 * Get trending products
 * 
 * Endpoint: GET /api/products/trending
 * 
 * @param limit - Number of products to return (default: 10)
 * @returns List of trending products
 * 
 * @example
 * const response = await getTrendingProducts(10)
 */
export async function getTrendingProducts(
  limit: number = 10
): Promise<ApiResponse<ProductSummaryDto[]>> {
  try {
    return await get<ApiResponse<ProductSummaryDto[]>>(
      '/api/products/trending',
      { limit }
    )
  } catch (error) {
    console.error('Error fetching trending products:', error)
    return {
      resultCd: 1,
      message: 'Failed to fetch trending products.',
      data: null
    }
  }
}

/**
 * Add product to shopping cart
 * 
 * Endpoint: POST /api/cart/add
 * 
 * @param data - Product ID and quantity
 * @returns Updated cart information
 * 
 * @example
 * const response = await addToCart({ productId: 12, quantity: 2 })
 */
export async function addToCart(
  data: AddToCartRequest
): Promise<ApiResponse<CartDto>> {
  try {
    return await post<ApiResponse<CartDto>>(
      '/api/cart/add',
      data
    )
  } catch (error) {
    console.error('Error adding to cart:', error)
    return {
      resultCd: 1,
      message: 'Failed to add to cart. Please try again.',
      data: null
    }
  }
}

// ============= Helper Functions =============

/**
 * Get Vietnamese error messages
 */
export function getErrorMessage(message: string): string {
  const ERROR_MESSAGES: Record<string, string> = {
    "Product not found": "Không tìm thấy sản phẩm",
    "Invalid page number": "Số trang không hợp lệ",
    "Invalid data": "Dữ liệu không hợp lệ",
    "Product out of stock": "Sản phẩm đã hết hàng",
    "Quantity must be greater than 0": "Số lượng phải lớn hơn 0",
    "Authentication required": "Vui lòng đăng nhập để tiếp tục",
    "Failed to fetch products": "Không thể tải danh sách sản phẩm",
    "Failed to add to cart": "Không thể thêm vào giỏ hàng"
  }
  
  return ERROR_MESSAGES[message] || message
}

/**
 * Format price to Vietnamese currency
 */
export function formatPrice(price: number): string {
  return `₫${price.toLocaleString('vi-VN')}`
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
