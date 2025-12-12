import type { userFilterProps } from "../../../../Interfaces/components/userProps";
import "./../Styles/Users.css";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function UsersFilter({
  searchId,
  setSearchId,
  searchName,
  setSearchName,
  searchEmail,
  setSearchEmail,
  searchPhone,
  setSearchPhone,
  statusFilter,
  setStatusFilter,
  resetFilters,
}: userFilterProps) {
  return (
    <div className="users-filter-bar flex flex-wrap items-center gap-4 mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" size={18} />
        </div>
        <input
          placeholder="Search by ID"
          className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" size={18} />
        </div>
        <input
          placeholder="Search by Name"
          className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" size={18} />
        </div>
        <input
          placeholder="Search by Email"
          className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" size={18} />
        </div>
        <input
          placeholder="Search by Phone"
          className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaFilter className="text-gray-400" size={14} />
        </div>
        <select
          className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200 appearance-none cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
        </select>
      </div>

      <button
        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
        onClick={resetFilters}
      >
        Reset
      </button>
    </div>
  );
}
