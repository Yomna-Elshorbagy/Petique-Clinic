import { useState, useMemo } from "react";
import type { IVaccination } from "../../Interfaces/IVacination";
import type { UseVaccinationFiltersReturn } from "../../Interfaces/components/searchProps";


export const useAllVaccinationsFilter = (vaccines: IVaccination[]): UseVaccinationFiltersReturn => {
  const [nameSearch, setNameSearch] = useState("");
  const [idSearch, setIdSearch] = useState("");
  const [createdBySearch, setCreatedBySearch] = useState("");
  const [category, setCategory] = useState("all");
  const [doses, setDoses] = useState("all");

  const categoryOptions = useMemo(() => {
    const cats = Array.from(
      new Set(
        vaccines.flatMap((v) =>
          Array.isArray(v.categories)
            ? v.categories.map((c) => (typeof c === "string" ? c : c.name))
            : []
        )
      )
    );
    return [{ label: "All Categories", value: "all" }, ...cats.map((c) => ({ label: c, value: c }))];
  }, [vaccines]);

  const dosesOptions = [
    { label: "All Doses", value: "all" },
    { label: "Single Dose", value: "single" },
    { label: "Multiple Doses", value: "multiple" },
  ];

  const filteredVaccines = useMemo(() => {
    return vaccines.filter((v) => {
      const matchesId = idSearch === "" || v._id.toLowerCase().includes(idSearch.toLowerCase());
      const matchesName = v.name.toLowerCase().includes(nameSearch.toLowerCase());
      const matchesCreatedBy =
        createdBySearch === "" ||
        (v.createdBy &&
          typeof v.createdBy !== "string" &&
          v.createdBy.userName.toLowerCase().includes(createdBySearch.toLowerCase()));

      const matchesCategory =
        category === "all" ||
        (Array.isArray(v.categories) &&
          v.categories.some((c) =>
            typeof c === "string" ? c === category : c.name === category
          ));

      const matchesDoses =
        doses === "all" ||
        (doses === "single" && v.doses.length === 1) ||
        (doses === "multiple" && v.doses.length > 1);

      return matchesId && matchesName && matchesCreatedBy && matchesCategory && matchesDoses;
    });
  }, [vaccines,idSearch ,  nameSearch, createdBySearch, category, doses]);

  return {
    filteredVaccines,
    nameSearch,
    idSearch,
    setIdSearch, 
    setNameSearch,
    createdBySearch,
    setCreatedBySearch,
    category,
    setCategory,
    doses,
    setDoses,
    categoryOptions,
    dosesOptions,
  };
};
