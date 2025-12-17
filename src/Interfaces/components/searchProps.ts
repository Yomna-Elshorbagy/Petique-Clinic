import type { IVaccination } from "../IVacination";

export interface SearchField {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}

export interface SharedSearchProps {
  searches: SearchField[];
  filterValue?: string;
  onFilterChange?: (v: string) => void;
  filters?: {
    value: string;
    onChange: (v: string) => void;
    options: { label: string; value: string }[];
  }[];
  onReset?: () => void;
}

export interface UseVaccinationFiltersReturn {
  filteredVaccines: IVaccination[];
  nameSearch: string;
  idSearch : string;
  setIdSearch: (v: string) => void;
  setNameSearch: (v: string) => void;
  createdBySearch: string;
  setCreatedBySearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  doses: string;
  setDoses: (v: string) => void;
  categoryOptions: { label: string; value: string }[];
  dosesOptions: { label: string; value: string }[];
}