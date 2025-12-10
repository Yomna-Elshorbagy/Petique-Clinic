import React from "react";

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
        className="border p-2 rounded-lg focus:outline-none focus:border-[#8A7A67] focus:ring-2 focus:ring-[#8A7A67]"
        value={searchCode}
        onChange={(e) => setSearchCode(e.target.value)}
      />

      {/* Type Filter */}
      <select
        className="border p-2 rounded-lg focus:outline-none focus:border-[#8A7A67] focus:ring-2 focus:ring-[#8A7A67]"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="fixedAmount">Fixed Amount</option>
        <option value="percentage">Percentage</option>
      </select>

      {/* Status Filter */}
      <select
        className="border p-2 rounded-lg focus:outline-none focus:border-[#8A7A67] focus:ring-2 focus:ring-[#8A7A67]"
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
        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
        onClick={onReset}
      >
        Reset Filters
      </button>
    </div>
  );
}
