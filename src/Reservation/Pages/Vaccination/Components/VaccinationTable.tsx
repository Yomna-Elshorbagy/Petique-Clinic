import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "../../../Componenst/Pagination/Pagination";
import { useLocalPagination } from "../../../Componenst/Pagination/UsePagination";
import {
  useDeletePetVaccination,
  useVaccinationRecords,
} from "../../../../Hooks/Pets/UsePets";
import EditVaccinationModal from "./EditVaccinationModal";

interface VaccinationRecord {
  petId: string;
  vaccinationId: string; 
  _id?: string;
  category?: string;
  petName: string;
  petImage?: string;
  vaccineName?: string;
  vaccineId?: string; 
  date: string;
  nextDose?: string;
  status: "completed" | "scheduled" | "overdue";
  doseNumber?: number;
}

const statusConfig = {
  completed: {
    label: "Completed",
    text: "text-green-600",
    border: "border-green-200",
    icon: <CheckCircle size={14} />,
  },
  scheduled: {
    label: "Scheduled",
    text: "text-orange-500",
    border: "border-orange-200",
    icon: <Clock size={14} />,
  },
  overdue: {
    label: "Overdue",
    text: "text-red-500",
    border: "border-red-200",
    icon: <AlertCircle size={14} />,
  },
};

const VaccinationTable = () => {
  const { data: records = [], isLoading: loading } = useVaccinationRecords();
  const [editingRecord, setEditingRecord] = useState<VaccinationRecord | null>(
    null
  );
  const deleteMutation = useDeletePetVaccination();

  const { page, totalPages, paginatedItems, goToPage } =
    useLocalPagination<VaccinationRecord>(records, 5);

  const handleDelete = (record: VaccinationRecord) => {
    const vaccinationId = record.vaccinationId || record._id;

    if (!vaccinationId) {
      console.error("Vaccination record structure:", record);
      Swal.fire("Error", "Missing vaccination ID", "error");
      return;
    }

    if (!record.petId) {
      Swal.fire("Error", "Missing pet ID", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#86654F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(
          {
            petId: record.petId,
            vaccinationId: vaccinationId,
          },
          {
            onSuccess: () => {
              Swal.fire("Deleted!", "Vaccination has been deleted.", "success");
              // Data will auto-refresh via query invalidation in the hook
            },
            onError: (err: any) => {
              Swal.fire(
                "Error",
                err?.response?.data?.message || "Failed to delete vaccination",
                "error"
              );
            },
          }
        );
      }
    });
  };

  const handleEdit = (record: VaccinationRecord) => {
    const vaccinationId = record.vaccinationId || record._id;

    if (!vaccinationId) {
      console.error("Vaccination record structure:", record);
      Swal.fire(
        "Error",
        "Missing vaccination ID. Cannot edit this record.",
        "error"
      );
      return;
    }

    if (!record.petId) {
      Swal.fire("Error", "Missing pet ID. Cannot edit this record.", "error");
      return;
    }

    setEditingRecord(record);
  };

  return (
    <>
      {/* Edit Modal */}
      {editingRecord &&
        (() => {
          const vaccinationId =
            editingRecord.vaccinationId || editingRecord._id || "";
          const vaccineId = editingRecord.vaccineId || "";

          if (!vaccinationId) {
            console.error(
              "Cannot edit - missing vaccination ID:",
              editingRecord
            );
            return null;
          }

          return (
            <EditVaccinationModal
              isOpen={!!editingRecord}
              onClose={() => setEditingRecord(null)}
              petId={editingRecord.petId}
              vaccinationId={vaccinationId}
              currentVaccineId={vaccineId}
              currentDoseNumber={editingRecord.doseNumber || 1}
              currentDate={editingRecord.date}
              onSuccess={() => {
                setEditingRecord(null);
                // Data will auto-refresh via query invalidation in the hook
              }}
            />
          );
        })()}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "#FBF9F6" }}
      >
        <table className="w-full">
          <thead style={{ background: "#D0C6BE" }}>
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="p-5">Pet</th>
              <th className="p-5">Category</th>
              <th className="p-5">Vaccine</th>
              <th className="p-5">Date</th>
              <th className="p-5">Status</th>
              <th className="p-5">Next Due</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {!loading &&
              paginatedItems.map((record, index) => {
                const status =
                  statusConfig[record.status as keyof typeof statusConfig];

                return (
                  <motion.tr
                    key={`${record.petId}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.06,
                      type: "spring",
                      stiffness: 240,
                      damping: 22,
                    }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-transparent"
                  >
                    {/* ===> pet */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={record.petImage || "/pet-placeholder.png"}
                          alt={record.petName}
                          className="w-10 h-10 rounded-full object-cover bg-gray-200"
                        />
                        <span className="font-medium text-gray-900">
                          {record.petName}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 text-gray-700">
                      {record.category || "—"}
                    </td>
                    {/* ===> vaccine */}
                    <td className="p-5 text-gray-700">
                      {record.vaccineName || "—"}
                    </td>

                    {/* ===> date */}
                    <td className="p-5 text-gray-700">
                      {new Date(record.date).toLocaleDateString()}
                    </td>

                    {/* ===> status */}
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 
                      rounded-full text-sm border 
                      ${status.text} ${status.border}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </td>

                    {/* ===> next due */}
                    <td className="p-5 text-gray-700">
                      {record.nextDose
                        ? new Date(record.nextDose).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* ===> actions */}
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-[#86654F] hover:bg-[#FCF9F4] rounded-lg transition-colors"
                          title="Edit vaccination"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete vaccination"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}

            {/* ===> In case of no vaccinations*/}
            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-10 text-gray-500">
                  No vaccination records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
    </>
  );
};

export default VaccinationTable;
