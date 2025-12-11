import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Clock, Eye, Edit } from "lucide-react";
import { FaArchive, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

import { useTodayReservations } from "../../../../Hooks/Reservation/useReservation";
import { useLocalPagination } from "../../../Componenst/Pagination/UsePagination";
import Pagination from "../../../Componenst/Pagination/Pagination";
import {
  useHardDeleteReservation,
  useSoftDeleteReservation,
} from "../../../../Hooks/Reservation/useReservationMutations";

import ViewReservationModal from "./ViewReservationModal";
import EditReservationModal from "./EditReservationModal";

const TodayReservationsList: React.FC = () => {
  const { data: allReservations = [], isLoading } = useTodayReservations();
  const { mutate: softDelete } = useSoftDeleteReservation();
  const { mutate: hardDelete } = useHardDeleteReservation();

  const reservations = useMemo(
    () => allReservations?.data ?? allReservations ?? [],
    [allReservations]
  );

  const { page, totalPages, paginatedItems, goToPage } = useLocalPagination(
    reservations,
    5
  );

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeReservation, setActiveReservation] = useState<any | null>(null);

  const openView = (r: any) => {
    setActiveReservation(r);
    setViewOpen(true);
  };

  const openEdit = (r: any) => {
    setActiveReservation(r);
    setEditOpen(true);
  };

  const handleSoftDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Archive reservation?",
      text: "This will soft-delete (archive) the reservation.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, archive",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#F9BE91",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Archiving...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    softDelete(
      { id },
      {
        onSuccess: () => {
          Swal.close();
          Swal.fire({
            title: "Archived",
            text: "Reservation archived successfully",
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
          });
        },
        onError: (err: any) => {
          Swal.close();
          Swal.fire({
            title: "Error",
            text:
              err?.response?.data?.message || "Failed to archive reservation",
            icon: "error",
          });
        },
      }
    );
  };

  const handleHardDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete permanently?",
      text: "This cannot be undone.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Deleting...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    hardDelete(
      { id },
      {
        onSuccess: () => {
          Swal.close();
          Swal.fire({
            title: "Deleted",
            text: "Reservation deleted successfully",
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
          });
        },
        onError: (err: any) => {
          Swal.close();
          Swal.fire({
            title: "Error",
            text:
              err?.response?.data?.message || "Failed to delete reservation",
            icon: "error",
          });
        },
      }
    );
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <ViewReservationModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        reservation={activeReservation}
      />
      <EditReservationModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        reservation={activeReservation}
        onUpdated={() => {
          setEditOpen(false);
        }}
      />

      <div className="mt-6 flex flex-col gap-4">
        {paginatedItems.map((res: any, i: number) => (
          <motion.div
            key={res._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="bg-white rounded-3xl px-6 py-5 shadow-sm border border-[#F3EDE6] flex items-center justify-between hover:shadow-md transition-all duration-300"
          >
            <div className="flex gap-4 items-start">
              <div className="p-4 rounded-2xl bg-[#F6EFE7] flex items-center justify-center shadow-sm">
                <PawPrint size={24} color="#A27A55" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-[18px] font-semibold text-[#4A3F35]">
                    {res.pet?.name}
                  </h2>

                  <span
                    className={`px-3 py-[4px] rounded-full text-xs capitalize font-medium
                      ${
                        res.status === "completed" &&
                        "bg-green-100 text-green-700"
                      }
                      ${
                        res.status === "pending" &&
                        "bg-orange-100 text-orange-700"
                      }
                      ${res.status === "cancelled" && "bg-red-100 text-red-700"}
                      ${
                        res.status === "confirmed" &&
                        "bg-blue-100 text-blue-700"
                      }
                    `}
                  >
                    {res.status}
                  </span>
                </div>

                <p className="text-sm text-[#8C827A]">
                  {res.petOwner?.fullName ?? res.petOwner?.userName}
                </p>

                <div className="flex items-center gap-3 mt-1 text-sm">
                  <Clock size={15} className="text-[#A39A90]" />
                  <span className="font-medium text-[#4A3F35]">
                    {res.timeSlot}
                  </span>
                  <span className="text-[#D29A84] font-medium">
                    {res.service?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openView(res)}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <Eye size={18} className="text-[#6F665F]" />
              </button>

              <button
                onClick={() => openEdit(res)}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <Edit size={18} className="text-amber-600" />
              </button>

              <button
                className="p-1 rounded-full hover:bg-gray-100 transition"
                onClick={() => handleSoftDelete(res._id)}
              >
                <FaArchive size={18} className="text-gray-600" />
              </button>

              <button
                className="p-1 rounded-full hover:bg-gray-100 transition"
                onClick={() => handleHardDelete(res._id)}
              >
                <FaTrash size={18} className="text-red-700" />
              </button>
            </div>
          </motion.div>
        ))}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </>
  );
};

export default TodayReservationsList;
