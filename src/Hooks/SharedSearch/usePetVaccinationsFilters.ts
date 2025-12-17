import { useMemo, useState } from "react";

export type VaccinationStatus = "all" | "completed" | "scheduled" | "overdue";

export const usePetVaccinationFilters = (records: any[]) => {
  const [petSearch, setPetSearch] = useState("");
  const [vaccineSearch, setVaccineSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<VaccinationStatus>("all");

  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(records.map((r: any) => r.category))).filter(Boolean);
    return [
      { label: "All Categories", value: "all" },
      ...cats.map((c: any) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
    ];
  }, [records]);

  const statusOptions = useMemo(() => [
    { label: "All Status", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Overdue", value: "overdue" },
  ], []);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesPet = !petSearch || r.petName?.toLowerCase().includes(petSearch.toLowerCase());
      const matchesVaccine = !vaccineSearch || r.vaccineName?.toLowerCase().includes(vaccineSearch.toLowerCase());
      const matchesCategory = category === "all" || r.category === category;
      const matchesStatus = status === "all" || r.status === status;

      return matchesPet && matchesVaccine && matchesCategory && matchesStatus;
    });
  }, [records, petSearch, vaccineSearch, category, status]);

  return {
    filteredRecords,
    petSearch,
    setPetSearch,
    vaccineSearch,
    setVaccineSearch,
    category,
    setCategory,
    status,
    setStatus,
    categoryOptions,
    statusOptions,
  };
};
