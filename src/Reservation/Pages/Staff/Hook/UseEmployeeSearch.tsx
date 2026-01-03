import { useState, useMemo } from "react";
import type { IUser } from "../../../../Interfaces/IUser";

export function useEmployeeSearch(employees: IUser[]) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return employees;

    const lowerSearch = search.toLowerCase();
    return employees.filter((emp) =>
      emp.userName.toLowerCase().includes(lowerSearch) ||
      emp.email.toLowerCase().includes(lowerSearch) ||
      emp._id.toLowerCase().includes(lowerSearch) ||
      emp.gender.toLowerCase().includes(lowerSearch) ||
      (emp.mobileNumber?.toLowerCase().includes(lowerSearch) ?? false)
    );
  }, [employees, search]);

  return { search, setSearch, filtered };
}
