import HomeView from './HomeView'
import { useMemo, useState } from 'react'

type Product = { id: number; name: string; price: string; img?: string }

// generate 100 mock products so pagination can be demonstrated
const NAMES = ['Táo đỏ', 'Chuối', 'Cam', 'Xoài', 'Nho', 'Dưa hấu', 'Kiwi', 'Lựu', 'Xoài Đài', 'Mận']
const MOCK: Product[] = Array.from({ length: 100 }).map((_, i) => {
  const base = NAMES[i % NAMES.length]
  const id = i + 1
  const price = 15000 + ((i % 10) * 5000) // varying prices
  return { id, name: `${base} ${id}`, price: `₫${price.toLocaleString('vi-VN')}` }
})

export default function Home() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 25

  const products = useMemo(() => {
    if (!query) return MOCK
    return MOCK.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize))
  // clamp page
  if (page > totalPages) setPage(totalPages)

  const displayedProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return products.slice(start, start + pageSize)
  }, [products, page])

  return (
    <HomeView
      query={query}
      onQueryChange={setQuery}
      products={products}
      displayed={displayedProducts}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  )
}
