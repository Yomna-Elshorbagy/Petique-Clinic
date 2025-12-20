import { FaSearch } from "react-icons/fa";
import type { SharedSearchProps } from "../../Interfaces/components/searchProps";

export default function SharedSearch({
  searches,
//   filterValue,
//   onFilterChange,
  filters = [],
}: SharedSearchProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
      
      {/* SEARCH INPUTS */}
      {searches.map((search, index) => (
        <div
          key={index}
          className="shared-search-wrapper w-full md:w-[200px]"
        >
          <FaSearch className="shared-search-icon" />
          <input
            type="text"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder}
            required={search.required}
            className="shared-search-input w-full"
          />
        </div>
      ))}

      {/* GENERAL FILTER */}
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="shared-filter-select w-[200px]"
        >
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

    </div>
  );
}
