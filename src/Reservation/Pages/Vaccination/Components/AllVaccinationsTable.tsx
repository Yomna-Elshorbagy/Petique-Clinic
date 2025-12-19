import { Trash2, Edit, Info } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Pagination from "../../../Componenst/Pagination/Pagination";
import { useLocalPagination } from "../../../Componenst/Pagination/UsePagination";
import {
  useVaccinations,
  useSoftDeleteVaccination,
  useDeleteVaccination,
} from "../../../../Hooks/Vaccinations/useVaccinations";
import type { IVaccination, IDose } from "../../../../Interfaces/IVacination";
import { useAllVaccinationsFilter } from "../../../../Hooks/SharedSearch/useAllVaccinationsFilter";
import SharedSearch from "../../../../Shared/SharedSearch/SharedSearch";

export default function AllVaccinationsTable() {
  const { data: vaccines = [], isLoading } = useVaccinations();
  const softDelete = useSoftDeleteVaccination();
  const hardDelete = useDeleteVaccination();

  const {
    filteredVaccines,
    nameSearch,
    setNameSearch,
    idSearch,
    setIdSearch,
    createdBySearch,
    setCreatedBySearch,
    category,
    setCategory,
    doses,
    setDoses,
    categoryOptions,
    dosesOptions,
  } = useAllVaccinationsFilter(vaccines);

  const { page, totalPages, paginatedItems, goToPage } =
    useLocalPagination<IVaccination>(filteredVaccines, 5);

  const handleSoftDelete = (id: string) => {
    Swal.fire({
      title: "Disable vaccine?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#86654F",
    }).then((res) => {
      if (res.isConfirmed) softDelete.mutate(id);
    });
  };

  const handleHardDelete = (id: string) => {
    Swal.fire({
      title: "Permanent delete?",
      text: "This cannot be undone",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    }).then((res) => {
      if (res.isConfirmed) hardDelete.mutate(id);
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <SharedSearch
        searches={[
          {
            placeholder: "Search by ID",
            value: idSearch,
            onChange: setIdSearch,
          },
          {
            placeholder: "Search by Name",
            value: nameSearch,
            onChange: setNameSearch,
          },
          {
            placeholder: "Search by Created By",
            value: createdBySearch,
            onChange: setCreatedBySearch,
          },
        ]}
        filters={[
          { value: category, onChange: setCategory, options: categoryOptions },
          { value: doses, onChange: setDoses, options: dosesOptions },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl overflow-hidden bg-[#FBF9F6] shadow-md"
      >
        <table className="w-full table-auto">
          <thead className="bg-[#D0C6BE]">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="p-4 w-[80px]">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4 w-[220px]">Description</th>
              <th className="p-4">Categories</th>
              <th className="p-4">Doses</th>
              <th className="p-4">Created By</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginatedItems.map((v: IVaccination, index: number) => (
              <motion.tr
                key={v._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 240,
                  damping: 22,
                }}
                whileHover={{ scale: 1.01 }}
                className="bg-transparent"
              >
                <td className="p-4 font-medium">#{v._id.slice(-5)}</td>
                <td className="p-4 font-medium max-w-[100px]">{v.name}</td>
                <td
                  className="p-4 text-gray-600 max-w-[100px]"
                  title={v.description}
                >
                  {v.description.length > 60
                    ? v.description.slice(0, 50) + "..."
                    : v.description}
                </td>
                <td className="p-4 text-gray-700">
                  {Array.isArray(v.categories)
                    ? v.categories
                        .map((c) => (typeof c === "string" ? c : c.name))
                        .join(", ")
                    : v.categories || "—"}
                </td>
                <td className="p-4 text-gray-700 space-y-1">
                  {v.doses.map((dose: IDose) => (
                    <div
                      key={dose.doseNumber}
                      className="flex items-center gap-2 text-sm bg-[#EDE7DF] px-2 py-1 rounded-full"
                    >
                      <Info size={14} className="text-[#86654F]" />
                      <span>
                        Dose {dose.doseNumber} - {dose.ageInWeeks} wks
                        {dose.recurring ? " (Recurring)" : ""}
                        {dose.repeatAfterDays
                          ? `, +${dose.repeatAfterDays}d`
                          : ""}
                      </span>
                    </div>
                  ))}
                </td>
                <td className="p-4 text-gray-700">
                  {v.createdBy && typeof v.createdBy !== "string"
                    ? v.createdBy.userName
                    : "—"}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-2 text-[#86654F] hover:bg-[#FCF9F4] rounded-lg transition-colors"
                      title="Edit vaccine"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleSoftDelete(v._id)}
                      className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Soft delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => handleHardDelete(v._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hard delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}

            {vaccines.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-10 text-gray-500">
                  No vaccinations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </>
  );
}
