import { useMemo } from "react";
import DataTableComponent from "../../../../Shared/Table/TableComponent";
import { useStaffVaccinationOverview } from "../../../../Hooks/Staff/useStaff";
import { Phone, MoreHorizontal, Edit2 } from "lucide-react";
import { useVaccinationSearch } from "../Hooks/useVaccinationSearch";
import { FaSearch } from "react-icons/fa";

const VaccinationRecordsTable = () => {
  const { data: records, isLoading } = useStaffVaccinationOverview();

  const columns = useMemo(
    () => [
      {
        name: "Pet",
        selector: (row: any) => row.petName,
        sortable: true,
        minWidth: "250px",
        cell: (row: any) => (
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-extra-5)] flex items-center justify-center text-xl overflow-hidden shrink-0 border border-[var(--color-extra-3)]">
              {row.petImage ? (
                <img
                  src={row.petImage}
                  alt={row.petName}
                  className="w-full h-full object-cover"
                />
              ) : (
                "🐾"
              )}
            </div>
            <div>
              <div className="font-bold text-[var(--color-text-primary)] text-sm">
                {row.petName}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {row.category}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {row.weight}
              </div>
            </div>
          </div>
        ),
      },
      {
        name: "Owner",
        selector: (row: any) => row.ownerName,
        sortable: true,
        minWidth: "200px",
        cell: (row: any) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-[var(--color-text-primary)] text-sm">
              {row.ownerName || "Unknown"}
            </span>
            <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <Phone size={10} className="text-[var(--color-light-accent)]" />
              {row.ownerMobile || "No Phone"}
            </div>
          </div>
        ),
      },
      {
        name: "Age",
        selector: (row: any) => row.age,
        sortable: true,
        width: "100px",
        cell: (row: any) => (
          <span className="text-[var(--color-text-muted)] text-sm">
            {row.age}{" "}
          </span>
        ),
      },
      {
        name: "Last Visit",
        selector: (row: any) => row.date,
        sortable: true,
        cell: (row: any) => (
          <div className="text-[var(--color-text-muted)] text-sm">
            {new Date(row.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        ),
      },
      {
        name: "Next Vaccination",
        selector: (row: any) => row.nextDose,
        sortable: true,
        minWidth: "180px",
        cell: (row: any) => (
          <div className="flex items-center gap-2">
            {row.nextDose ? (
              <>
                <Edit2
                  size={12}
                  className="text-[var(--color-light-accent)] opacity-70"
                />
                <span className="text-[var(--color-text-primary)] text-sm font-medium">
                  {new Date(row.nextDose).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            ) : (
              <span className="text-[var(--color-text-muted)] text-sm">
                Up to date
              </span>
            )}
          </div>
        ),
      },
      {
        name: "Status",
        selector: (row: any) => row.status,
        sortable: true,
        cell: (row: any) => {
          let statusStyles = "";
          let label = row.status;

          switch (row.status) {
            case "completed":
            case "healthy": 
              statusStyles = "bg-green-100 text-green-700 border-green-200";
              label = "Completed";
              break;
            case "scheduled":
              statusStyles = "bg-blue-100 text-blue-700 border-blue-200";
              label = "Scheduled";
              break;
            case "overdue":
            case "critical":
              statusStyles = "bg-red-100 text-red-700 border-red-200";
              label = "Critical";
              break;
            default:
              statusStyles = "bg-gray-100 text-gray-700 border-gray-200";
              label = row.status || "Unknown";
          }

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles}`}
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </span>
          );
        },
      },
      {
        name: "Actions",
        cell: (_row: any) => (
          <button className="p-1.5 hover:bg-[var(--color-extra-5)] rounded-full text-[var(--color-text-muted)] transition-colors">
            <MoreHorizontal size={16} />
          </button>
        ),
        width: "80px",
        center: true,
      },
    ],
    []
  );

  const searchVaccinations = Array.isArray(records) ? records : [];
  const {
  search,
  setSearch,
  filteredRecords,
} = useVaccinationSearch(searchVaccinations);

  return (
    <>
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98770]" />
        <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Owner, Pet Name, or Age..."
        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FCF9F4] border-none focus:ring-2 focus:ring-[#A98770]/50 text-[#86654F] placeholder-[#A98770]/70 shadow-sm"
      />
      </div>
    </div>
    <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-2xl shadow-sm border border-[var(--color-extra-3)]/30 overflow-hidden">
      <DataTableComponent
        columns={columns}
        data={filteredRecords}
        loading={isLoading}
        pagination
        title="Pet History"
      />
    </div>
    </>
    
  );
};

export default VaccinationRecordsTable;
