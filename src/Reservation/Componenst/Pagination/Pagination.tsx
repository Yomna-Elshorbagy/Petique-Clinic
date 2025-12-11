import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold shadow-sm">
        {page} / {totalPages || 1}
      </div>

      <button
        disabled={page === totalPages || totalPages === 0}
        onClick={() => onPageChange(page + 1)}
        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};


export default Pagination;
