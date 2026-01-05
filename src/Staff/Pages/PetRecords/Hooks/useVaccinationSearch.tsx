import { useMemo, useState } from "react";

export const useVaccinationSearch = (records: any[]) => {
  const [search, setSearch] = useState("");

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;

    const lower = search.toLowerCase();

    return records.filter((row: any) => {
      const ownerName = row.ownerName?.toLowerCase() || "";
      const ownerEmail = row.ownerEmail?.toLowerCase() || "";
      const petName = row.petName?.toLowerCase() || "";
      const age = String(row.age || "");

      return (
        ownerName.includes(lower) ||
        ownerEmail.includes(lower) ||
        petName.includes(lower) ||
        age.includes(lower)
      );
    });
  }, [records, search]);

  return {
    search,
    setSearch,
    filteredRecords,
  };
};
