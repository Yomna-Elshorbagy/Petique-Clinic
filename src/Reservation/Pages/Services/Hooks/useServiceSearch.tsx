import { useState, useMemo } from "react";

export function useServiceSearch(services: any[]) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return services.filter((s) =>
      s.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, services]);

  return { search, setSearch, filtered };
}
