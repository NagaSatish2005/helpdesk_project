import React from 'react'
import styles from './Pagination.module.css'

function getPageRange(currentPage, totalPages, siblingCount) {
  const range = []
  const totalNumbers = siblingCount * 2 + 5

  if (totalPages <= totalNumbers) {
    for (let page = 1; page <= totalPages; page += 1) {
      range.push(page)
    }
    return range
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 2)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < totalPages - 1

  range.push(1)

  if (showLeftEllipsis) {
    range.push('ellipsis-left')
  }

  for (let page = leftSiblingIndex; page <= rightSiblingIndex; page += 1) {
    range.push(page)
  }

  if (showRightEllipsis) {
    range.push('ellipsis-right')
  }

  range.push(totalPages)

  return range
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  showPageInfo = true,
  showFirstLast = true,
  siblingCount = 1,
  className = '',
}) {
  if (!totalPages || totalPages <= 1) return null

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages)
  const startItem = (safeCurrentPage - 1) * pageSize + 1
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems)
  const pageItems = getPageRange(safeCurrentPage, totalPages, siblingCount)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== safeCurrentPage) {
      onPageChange?.(page)
    }
  }

  return (
    <nav className={[styles.container, className].filter(Boolean).join(' ')} aria-label="Pagination">
      {showPageInfo ? (
        <div className={styles.info}>
          Showing {startItem}-{endItem} of {totalItems} records
        </div>
      ) : null}

      <div className={styles.controls}>
        {showFirstLast ? (
          <button
            type="button"
            className={styles.button}
            onClick={() => handlePageChange(1)}
            disabled={safeCurrentPage === 1}
            aria-label="Go to first page"
          >
            «
          </button>
        ) : null}

        <button
          type="button"
          className={styles.button}
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Go to previous page"
        >
          ‹
        </button>

        {pageItems.map((page, index) => {
          if (page === 'ellipsis-left' || page === 'ellipsis-right') {
            return (
              <span key={`${page}-${index}`} className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            )
          }

          const isActive = page === safeCurrentPage
          return (
            <button
              key={page}
              type="button"
              className={[styles.button, isActive ? styles.active : ''].filter(Boolean).join(' ')}
              onClick={() => handlePageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          )
        })}

        <button
          type="button"
          className={styles.button}
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          aria-label="Go to next page"
        >
          ›
        </button>

        {showFirstLast ? (
          <button
            type="button"
            className={styles.button}
            onClick={() => handlePageChange(totalPages)}
            disabled={safeCurrentPage === totalPages}
            aria-label="Go to last page"
          >
            »
          </button>
        ) : null}
      </div>
    </nav>
  )
}
