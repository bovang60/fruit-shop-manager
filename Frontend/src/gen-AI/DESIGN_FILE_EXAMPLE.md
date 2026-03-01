# Design File Example - Product Detail Page

> File này là ví dụ về format của design file mà bạn cung cấp cho AI generator.
> Copy file này vào `src/components/{{screen-name}}/design.md` và chỉnh sửa theo design của bạn.

## Layout Structure

```
┌─────────────────────────────────────────┐
│           Sticky Header                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │              │  │  Product Name   │ │
│  │   Product    │  │  $99.99         │ │
│  │   Images     │  │                 │ │
│  │  (Carousel)  │  │  Description    │ │
│  │              │  │                 │ │
│  └──────────────┘  │  [Add to Cart]  │ │
│                    └─────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│             Footer                      │
└─────────────────────────────────────────┘
```

**Mobile (< 768px):**
- Stack vertically: Images → Info
- Full width carousel
- Fixed bottom CTA button

**Desktop (≥ 1024px):**
- 2-column: 60% images, 40% info
- Sticky info panel on scroll

## HTML Markup

```html
<div class="product-detail-root">
  <!-- Sticky Header -->
  <header class="product-header">
    <!-- Header component here -->
  </header>

  <!-- Main Content -->
  <main class="product-main">
    <!-- Left: Product Images Carousel -->
    <section class="product-images-section">
      <div class="main-image-container">
        <img src="product-image-1.jpg" alt="Product Main Image" class="main-image" />
        <div class="image-navigation">
          <button class="nav-btn prev">‹</button>
          <button class="nav-btn next">›</button>
        </div>
      </div>
      
      <!-- Thumbnail Navigation -->
      <div class="thumbnails">
        <div class="thumbnail active">
          <img src="thumb-1.jpg" alt="Thumbnail 1" />
        </div>
        <div class="thumbnail">
          <img src="thumb-2.jpg" alt="Thumbnail 2" />
        </div>
        <div class="thumbnail">
          <img src="thumb-3.jpg" alt="Thumbnail 3" />
        </div>
      </div>
    </section>

    <!-- Right: Product Info -->
    <section class="product-info-section">
      <div class="product-info-sticky">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a href="/home">Home</a> / 
          <a href="/products">Products</a> / 
          <span>Product Name</span>
        </nav>

        <!-- Product Title -->
        <h1 class="product-title">Fresh Organic Oranges</h1>
        
        <!-- Rating -->
        <div class="product-rating">
          <div class="stars">★★★★☆</div>
          <span class="rating-text">(4.5 / 128 reviews)</span>
        </div>

        <!-- Price -->
        <div class="product-pricing">
          <span class="current-price">$12.99</span>
          <span class="original-price">$15.99</span>
          <span class="discount-badge">20% OFF</span>
        </div>

        <!-- Short Description -->
        <p class="product-description">
          Fresh, juicy oranges handpicked from organic orchards. 
          Rich in Vitamin C and perfect for your daily nutrition.
        </p>

        <!-- Options -->
        <div class="product-options">
          <div class="option-group">
            <label>Size:</label>
            <div class="size-buttons">
              <button class="size-btn active">1kg</button>
              <button class="size-btn">2kg</button>
              <button class="size-btn">5kg</button>
            </div>
          </div>

          <div class="option-group">
            <label>Quantity:</label>
            <div class="quantity-selector">
              <button class="qty-btn minus">−</button>
              <input type="number" value="1" min="1" class="qty-input" />
              <button class="qty-btn plus">+</button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="product-actions">
          <button class="btn-add-to-cart primary">
            Add to Cart - $12.99
          </button>
          <button class="btn-wishlist secondary">
            ❤ Add to Wishlist
          </button>
        </div>

        <!-- Additional Info -->
        <div class="product-meta">
          <div class="meta-item">
            <span class="meta-label">Category:</span>
            <span class="meta-value">Citrus Fruits</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Origin:</span>
            <span class="meta-value">California, USA</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Stock:</span>
            <span class="meta-value in-stock">In Stock (125 units)</span>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Product Details Tabs -->
  <section class="product-details-section">
    <div class="tabs-container">
      <div class="tabs-header">
        <button class="tab-btn active">Description</button>
        <button class="tab-btn">Nutrition Facts</button>
        <button class="tab-btn">Reviews (128)</button>
      </div>
      
      <div class="tab-content active">
        <h2>Product Description</h2>
        <p>Detailed product description here...</p>
      </div>
    </div>
  </section>

  <!-- Related Products -->
  <section class="related-products-section">
    <h2 class="section-title">You May Also Like</h2>
    <div class="products-grid">
      <!-- Product cards -->
    </div>
  </section>

  <!-- Footer -->
  <footer class="product-footer">
    <!-- Footer component here -->
  </footer>
</div>
```

## CSS Styles

```css
/* Root Container */
.product-detail-root {
  font-family: 'Plus Jakarta Sans', Inter, system-ui;
  color: #121811;
  background: #f6f8f5;
  min-height: 100vh;
}

/* Header */
.product-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #dde6db;
}

/* Main Layout */
.product-main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  gap: 3rem;
}

/* Images Section (Left) */
.product-images-section {
  flex: 0 0 60%;
}

.main-image-container {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  margin-bottom: 1rem;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-navigation {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.main-image-container:hover .image-navigation {
  opacity: 1;
}

.nav-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: white;
  transform: scale(1.1);
}

/* Thumbnails */
.thumbnails {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
}

.thumbnail {
  flex: 0 0 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s;
}

.thumbnail.active {
  border-color: #33f20d;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info Section (Right) */
.product-info-section {
  flex: 1;
}

.product-info-sticky {
  position: sticky;
  top: 6rem;
}

/* Breadcrumb */
.breadcrumb {
  font-size: 0.875rem;
  color: #678a60;
  margin-bottom: 1rem;
}

.breadcrumb a {
  color: #678a60;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #33f20d;
}

/* Product Title */
.product-title {
  font-size: 2rem;
  font-weight: 900;
  margin: 0 0 0.75rem 0;
  line-height: 1.2;
}

/* Rating */
.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  color: #ffa500;
  font-size: 1.25rem;
}

.rating-text {
  color: #678a60;
  font-size: 0.875rem;
}

/* Pricing */
.product-pricing {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.current-price {
  font-size: 2rem;
  font-weight: 900;
  color: #33f20d;
}

.original-price {
  font-size: 1.25rem;
  color: #678a60;
  text-decoration: line-through;
}

.discount-badge {
  padding: 0.25rem 0.75rem;
  background: #ff4444;
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 700;
}

/* Description */
.product-description {
  line-height: 1.6;
  color: #678a60;
  margin-bottom: 1.5rem;
}

/* Options */
.product-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.option-group label {
  display: block;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.size-buttons {
  display: flex;
  gap: 0.5rem;
}

.size-btn {
  padding: 0.5rem 1.5rem;
  border: 2px solid #dde6db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.size-btn.active {
  border-color: #33f20d;
  background: #33f20d;
  color: #121811;
  font-weight: 700;
}

/* Quantity Selector */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #dde6db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.qty-btn:hover {
  border-color: #33f20d;
  color: #33f20d;
}

.qty-input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid #dde6db;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
}

/* Action Buttons */
.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-add-to-cart {
  width: 100%;
  height: 3.5rem;
  border: none;
  border-radius: 12px;
  background: #33f20d;
  color: #121811;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-to-cart:hover {
  background: #2dd60c;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(51, 242, 13, 0.3);
}

.btn-wishlist {
  width: 100%;
  height: 3rem;
  border: 2px solid #dde6db;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
}

.btn-wishlist:hover {
  border-color: #33f20d;
  color: #33f20d;
}

/* Product Meta */
.product-meta {
  border-top: 1px solid #dde6db;
  padding-top: 1.5rem;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.meta-label {
  color: #678a60;
  font-weight: 600;
}

.meta-value.in-stock {
  color: #33f20d;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 1023px) {
  .product-main {
    flex-direction: column;
  }
  
  .product-images-section {
    flex: 1;
  }
  
  .product-info-sticky {
    position: static;
  }
}

@media (max-width: 767px) {
  .product-main {
    padding: 1rem;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 1.5rem;
  }
}
```

## Design Notes

### Colors
- Primary: `#33f20d` (green accent for buttons, highlights)
- Text: `#121811` (dark)
- Muted: `#678a60` (secondary text)
- Background: `#f6f8f5` (light)
- Border: `#dde6db` (subtle borders)

### Typography
- Font: Plus Jakarta Sans
- Titles: 1.5rem - 2rem, font-weight 900
- Body: 1rem, line-height 1.6
- Small: 0.875rem

### Interactions
- Hover: Scale transform + shadow
- Active states: Green accent color
- Transitions: 0.2s ease

### Responsive Breakpoints
- Mobile: < 768px (stack vertically)
- Tablet: 768px - 1023px (adjust padding)
- Desktop: ≥ 1024px (2-column layout)

## API Integration Notes

**Endpoints needed:**
- `GET /api/products/:id` - Get product details
- `POST /api/cart/add` - Add to cart
- `POST /api/wishlist/add` - Add to wishlist
- `GET /api/products/:id/related` - Get related products

**Data structure:**
```typescript
type ProductDetail = {
  id: number
  name: string
  price: number
  originalPrice?: number
  discount?: number
  description: string
  images: string[]
  category: string
  origin: string
  stock: number
  rating: number
  reviewCount: number
  sizes: string[]
  inStock: boolean
}
```

## Accessibility Notes

- All images have `alt` text
- Buttons have descriptive labels
- Form inputs have labels
- Focus states visible on all interactive elements
- Keyboard navigation support
- ARIA labels for quantity controls

---

**End of Design File Example**
