import type { userFilterProps } from "../../../../Interfaces/components/userProps";
import "./../Styles/Users.css";
import { FaSearch , FaFilter } from "react-icons/fa";

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
        className="input-box users-input"
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
        className="input-box users-input"
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
        className="input-box users-input"
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
        className="input-box users-input"
        value={searchPhone}
        onChange={(e) => setSearchPhone(e.target.value)}
      />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" size={18} />
        </div>
      <select
        className="input-box users-input"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="verified">Verified</option>
      </select>
      </div>

      <button className="action-btn button" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
}
