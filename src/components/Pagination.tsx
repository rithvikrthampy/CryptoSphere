import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  perPage: number
  onPerPageChange: (perPage: number) => void
  totalItems?: number
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  onPerPageChange,
  totalItems,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-fg-muted">
        <span>Show</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="px-2 py-1 rounded-md border border-border-light bg-white/60 dark:bg-bg-soft dark:border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {PER_PAGE_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>entries</span>
        {totalItems && (
          <span className="ml-2">
            ({((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, totalItems)} of {totalItems})
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-white/60 text-gray-700 transition-all duration-200 hover:bg-white/80 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-bg-soft dark:text-fg dark:border-border dark:hover:bg-bg-hover"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {renderPageNumbers().map((page, index) => (
            page === '...' ? (
              <div key={index} className="flex items-center justify-center w-8 h-8">
                <MoreHorizontal size={16} className="text-gray-400 dark:text-fg-muted" />
              </div>
            ) : (
              <button
                key={index}
                onClick={() => onPageChange(page as number)}
                className={`w-8 h-8 rounded-lg font-medium transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-accent text-white shadow-glow'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80 hover:shadow-sm dark:bg-bg-soft dark:text-fg dark:hover:bg-bg-hover'
                } border border-border-light dark:border-border`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-white/60 text-gray-700 transition-all duration-200 hover:bg-white/80 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-bg-soft dark:text-fg dark:border-border dark:hover:bg-bg-hover"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}