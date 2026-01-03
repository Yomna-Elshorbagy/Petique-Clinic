import { useMemo, useState } from "react";

export const useSearch = (records: any[]) => {
  const [vaccineName, setVaccineName] = useState("");
  const [status, setStatus] = useState("all");

  const filteredRecords = useMemo(() => {
    return records.filter((record: any) => {
      const nameMatch = record.vaccineName
        ?.toLowerCase()
        .includes(vaccineName.toLowerCase());

      const statusMatch =
        status === "all" || record.status?.toLowerCase() === status;

      return nameMatch && statusMatch;
    });
  }, [records, vaccineName, status]);

  return {
    vaccineName,
    setVaccineName,
    status,
    setStatus,
    filteredRecords,
  };
};
