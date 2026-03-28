import './Pagination.css'

type Props = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function buildPages(currentPage: number, totalPages: number): Array<number | 'dots'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: Array<number | 'dots'> = [1]

  if (currentPage > 4) {
    pages.push('dots')
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  if (currentPage < totalPages - 3) {
    pages.push('dots')
  }

  pages.push(totalPages)
  return pages
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) {
    return null
  }

  const pages = buildPages(currentPage, totalPages)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Prev
      </button>

      {pages.map((page, index) =>
        page === 'dots' ? (
          <span key={`dots-${index}`} className="dots" aria-hidden="true">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={`page-number ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </nav>
  )
}
