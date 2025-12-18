import { FaChevronLeft, FaChevronRight, FaEllipsisH } from "react-icons/fa";

interface SharedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export default function SharedPagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
}: SharedPaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)] hover:bg-[var(--color-light-accent)]/10 dark:hover:bg-[var(--color-dark-accent)]/20 hover:border-[var(--color-light-accent)]/50 dark:hover:border-[var(--color-dark-accent)]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-bg-cream)] dark:disabled:hover:bg-[var(--color-dark-bg-hover)] transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FaChevronLeft className="text-sm group-hover:-translate-x-0.5 transition-transform duration-200" />
        <span className="hidden sm:inline text-sm font-medium">Previous</span>
      </button>

      {/* First Page */}
      {showFirstLast && visiblePages[0] > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="px-4 py-3 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)] hover:bg-[var(--color-light-accent)]/10 dark:hover:bg-[var(--color-dark-accent)]/20 hover:border-[var(--color-light-accent)]/50 dark:hover:border-[var(--color-dark-accent)]/50 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
        >
          1
        </button>
      )}

      {/* Start Ellipsis */}
      {showStartEllipsis && (
        <div className="px-2 py-3 text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-muted)]">
          <FaEllipsisH className="text-sm" />
        </div>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-3 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium ${
            currentPage === page
              ? "bg-[var(--color-light-accent)] border-[var(--color-light-accent)] text-white shadow-lg scale-105"
              : "bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)] border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)] hover:bg-[var(--color-light-accent)]/10 dark:hover:bg-[var(--color-dark-accent)]/20 hover:border-[var(--color-light-accent)]/50 dark:hover:border-[var(--color-dark-accent)]/50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* End Ellipsis */}
      {showEndEllipsis && (
        <div className="px-2 py-3 text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-muted)]">
          <FaEllipsisH className="text-sm" />
        </div>
      )}

      {/* Last Page */}
      {showFirstLast && visiblePages[visiblePages.length - 1] < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="px-4 py-3 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)] hover:bg-[var(--color-light-accent)]/10 dark:hover:bg-[var(--color-dark-accent)]/20 hover:border-[var(--color-light-accent)]/50 dark:hover:border-[var(--color-dark-accent)]/50 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
        >
          {totalPages}
        </button>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)] hover:bg-[var(--color-light-accent)]/10 dark:hover:bg-[var(--color-dark-accent)]/20 hover:border-[var(--color-light-accent)]/50 dark:hover:border-[var(--color-dark-accent)]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-bg-cream)] dark:disabled:hover:bg-[var(--color-dark-bg-hover)] transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <span className="hidden sm:inline text-sm font-medium">Next</span>
        <FaChevronRight className="text-sm group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
}
