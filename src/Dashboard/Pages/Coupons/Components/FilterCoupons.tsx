interface FilterProps {
  searchCode: string;
  setSearchCode: (v: string) => void;

  filterType: string;
  setFilterType: (v: string) => void;

  filterStatus: string;
  setFilterStatus: (v: string) => void;

  onReset: () => void;
}

export default function FilterCoupons({
  searchCode,
  setSearchCode,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  onReset,
}: FilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Search by Code */}
      <input
        type="text"
        placeholder="Search by code..."
        className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200"
        value={searchCode}
        onChange={(e) => setSearchCode(e.target.value)}
      />

      {/* Type Filter */}
      <select
        className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200 appearance-none cursor-pointer"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="fixedAmount">Fixed Amount</option>
        <option value="percentage">Percentage</option>
      </select>

      {/* Status Filter */}
      <select
        className="w-full px-4 py-2.5 border border-[var(--color-border-medium)] rounded-xl bg-[var(--color-bg-cream)] text-[var(--color-light-dark)] focus:border-[#b89c86] focus:bg-white focus:ring-1 focus:ring-black/10 outline-none transition-all duration-200 appearance-none cursor-pointer"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
        {/* <option value="unactive">Unactive </option> */}
      </select>

      {/* Reset */}
      <button
        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
        onClick={onReset}
      >
        Reset Filters
      </button>
    </div>
  );
}
