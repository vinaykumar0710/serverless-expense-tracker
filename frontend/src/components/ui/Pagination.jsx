import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const paginationRange = usePagination({ totalPages, currentPage });

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {paginationRange.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="px-2 text-text-muted text-sm">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer
              ${page === currentPage
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
