import React from "react";
import { useState } from "react";
import {
  useStaffReservations,
  useStaffTodayReservations,
  useUpdateReservationStatusStaff,
} from "../../../Hooks/Staff/useStaff";
import { Calendar, Filter } from "lucide-react";
import Swal from "sweetalert2";
import ReservationsTable from "../../Components/ReservationsTable/ReservationsTable";
import Pagination from "../../Components/Pagination/Pagination";

const EditReservationModal = ({
  isOpen,
  onClose,
  reservation,
  onSave,
  isPending,
}: any) => {
  const [status, setStatus] = useState(reservation?.status || "");
  const [date, setDate] = useState(
    reservation?.date
      ? new Date(reservation.date).toISOString().split("T")[0]
      : ""
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">
          Edit Reservation
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text-muted)]">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-[var(--color-extra-3)] rounded-lg outline-none focus:border-[var(--color-light-accent)] bg-transparent dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text-muted)]">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-[var(--color-extra-3)] rounded-lg outline-none focus:border-[var(--color-light-accent)] bg-transparent dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-[var(--color-extra-5)] rounded-lg hover:bg-[var(--color-extra-3)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(status, date)}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StaffAppointments() {
  const [viewMode, setViewMode] = useState<"all" | "today">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetching Data
  const { data: allReservations, isLoading: isAllLoading } =
    useStaffReservations();
  const { data: todayReservations, isLoading: isTodayLoading } =
    useStaffTodayReservations();
  const { mutate: updateReservation, isPending: isUpdating } =
    useUpdateReservationStatusStaff();

  // Selected Data
  const reservations =
    viewMode === "today" ? todayReservations : allReservations;
  const isLoading = viewMode === "today" ? isTodayLoading : isAllLoading;

  // Pagination Logic
  const allRecords = Array.isArray(reservations) ? reservations : [];
  const totalPages = Math.ceil(allRecords.length / itemsPerPage);
  const currentRecords = allRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Edit Logic
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<any>(null);

  const handleEditClick = (res: any) => {
    setSelectedRes(res);
    setIsEditModalOpen(true);
  };

  const handleSave = (status: string, date: string) => {
    if (selectedRes) {
      updateReservation(
        { id: selectedRes._id, status },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Reservation status updated successfully",
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: (err: any) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: err?.response?.data?.message || "Failed to update",
            });
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
            Appointments
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            {viewMode === "today"
              ? "Manage today's scheduled visits."
              : "Overview of all reservation history."}
          </p>
        </div>

        <div className="bg-[var(--color-extra-5)] p-1 rounded-xl inline-flex">
          <button
            onClick={() => {
              setViewMode("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === "all"
                ? "bg-white dark:bg-[var(--color-dark-card)] text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Filter size={16} /> All Reservations
          </button>
          <button
            onClick={() => {
              setViewMode("today");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === "today"
                ? "bg-white dark:bg-[var(--color-dark-card)] text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Calendar size={16} /> Today Only
          </button>
        </div>
      </div>

      {/* Table */}
      <ReservationsTable
        data={currentRecords}
        loading={isLoading}
        onEdit={handleEditClick}
        title={viewMode === "today" ? "Today's Schedule" : "All Reservations"}
        pagination={
          allRecords.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )
        }
      />

      {/* Edit Modal */}
      <EditReservationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reservation={selectedRes}
        onSave={handleSave}
        isPending={isUpdating}
      />
    </div>
  );
}
