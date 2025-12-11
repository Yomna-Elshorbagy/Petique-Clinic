import { useState, useMemo } from "react";

export function useLocalPagination<T>(items: T[], limit = 5) {
  const [page, setPage] = useState(1);

  const total = items.length;
  const totalPages = Math.ceil(total / limit);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * limit;
    return items.slice(start, start + limit);
  }, [items, page, limit]);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return {
    page,
    limit,
    total,
    totalPages,
    paginatedItems,
    goToPage,
  };
}
