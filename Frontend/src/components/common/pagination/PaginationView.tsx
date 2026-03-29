// Import removed to avoid unused variable error
import './Pagination.css'

type Props = {
  pages: (number | '...')[]
  currentPage: number
  totalPages: number
  onPageChange: (p: number) => void
}

export default function PaginationView({ pages, currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="page-btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        ‹ Prev
      </button>

      <ul className="page-list">
        {pages.map((p, idx) => (
          <li key={String(p) + idx}>
            {p === '...' ? (
              <span className="dots">…</span>
            ) : (
              <button
                className={`page-number ${p === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(Number(p))}
                aria-current={p === currentPage ? 'page' : undefined}
              >
                {p}
              </button>
            )}
          </li>
        ))}
      </ul>

      <button className="page-btn" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next ›
      </button>
    </nav>
  )
}
