/**
 * Home Component Type Definitions
 * 
 * Types and interfaces specific to Home page component
 */

import type { ProductDto, ProductSummaryDto } from '../../services/productService'

// ============= UI State Types =============

/**
 * Product for display in UI
 * Maps from ProductDto with optional UI-specific fields
 */
export interface Product {
  id: number
  name: string
  price: string        // Formatted price (e.g., "₫45,000")
  img?: string
  desc?: string
  tag?: string
  rating?: number
  discount?: number
  originalPrice?: string
}

/**
 * Filter state for product list
 */
export interface FilterState {
  search: string
  category?: string
  minPrice?: number
  maxPrice?: number
  origin?: string
  organic?: boolean
  sortBy: string
  sortOrder: string
}

/**
 * UI State for Home component
 */
export interface HomeState {
  products: Product[]
  newArrivals: Product[]
  trending: Product[]
  loading: boolean
  error: string
  page: number
  totalPages: number
  filters: FilterState
}

// ============= Mapper Functions =============

/**
 * Map ProductDto from API to UI Product format
 */
export function mapProductToUI(dto: ProductDto): Product {
  return {
    id: dto.productId,
    name: dto.name,
    price: `₫${dto.price.toLocaleString('vi-VN')}`,
    img: dto.imageUrl || undefined,
    desc: dto.description || undefined,
    tag: dto.tags.length > 0 ? dto.tags[0] : undefined,
    rating: dto.rating,
    discount: dto.discount > 0 ? dto.discount : undefined,
    originalPrice: dto.originalPrice 
      ? `₫${dto.originalPrice.toLocaleString('vi-VN')}` 
      : undefined
  }
}

/**
 * Map ProductSummaryDto from API to UI Product format
 */
export function mapProductSummaryToUI(dto: ProductSummaryDto): Product {
  return {
    id: dto.productId,
    name: dto.name,
    price: `₫${dto.price.toLocaleString('vi-VN')}`,
    img: dto.imageUrl || undefined,
    tag: dto.tags.length > 0 ? dto.tags[0] : undefined,
    rating: dto.rating
  }
}
