import PaginationView from './PaginationView'

type Props = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** how many page numbers to show around current (optional) */
  siblingCount?: number
}

function range(start: number, end: number) {
  const res: number[] = []
  for (let i = start; i <= end; i++) res.push(i)
  return res
}

export default function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }: Props) {
  if (totalPages <= 1) return null

  const totalNumbers = siblingCount * 2 + 5 // first, last, current, two dots
  const pages: (number | '...')[] = []

  if (totalPages <= totalNumbers) {
    pages.push(...range(1, totalPages))
  } else {
    const left = Math.max(2, currentPage - siblingCount)
    const right = Math.min(totalPages - 1, currentPage + siblingCount)

    pages.push(1)

    if (left > 2) pages.push('...')

    pages.push(...range(left, right))

    if (right < totalPages - 1) pages.push('...')

    pages.push(totalPages)
  }

  return <PaginationView pages={pages} currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
}
