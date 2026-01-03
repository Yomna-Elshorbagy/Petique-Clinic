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
import { TIME_SLOTS } from "../../../Constants/timeSlots";
import StaffStatsOverview from "../../Components/StaffStatsOverview";
import { useReservationSearch } from "../../Components/ReservationsTable/Hook/useReservationSearch";
import SharedSearch from "../../../Shared/SharedSearch/SharedSearch";

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
  const [timeSlot, setTimeSlot] = useState(reservation?.timeSlot || "");

  // Fetch taken slots for this doctor on this day
  const { data: doctorReservations } = useStaffReservations({
    doctor: reservation?.doctor?._id,
    date: date, // Ensuring date format matches what API expects for filtering
    isDeleted: false,
  });

  // Calculate unavailable slots
  const unavailableSlots = React.useMemo(() => {
    if (!Array.isArray(doctorReservations)) return [];
    return doctorReservations
      .filter((res: any) => res._id !== reservation?._id)
      .map((res: any) => res.timeSlot);
  }, [doctorReservations, reservation]);

  // Update local state when reservation changes
  React.useEffect(() => {
    if (isOpen && reservation) {
      setStatus(reservation.status || "pending");
      setDate(
        reservation.date
          ? new Date(reservation.date).toISOString().split("T")[0]
          : ""
      );
      setTimeSlot(reservation.timeSlot || "");
    }
  }, [isOpen, reservation]);

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
              disabled={reservation?.status === "completed"}
              className="w-full p-2 border border-[var(--color-extra-3)] rounded-lg outline-none focus:border-[var(--color-light-accent)] bg-transparent dark:text-white disabled:opacity-50 disabled:bg-gray-100"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-muted)]">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-2 border border-[var(--color-extra-3)] rounded-lg outline-none focus:border-[var(--color-light-accent)] bg-transparent dark:text-white"
              >
                <option value="">Select Time</option>
                {TIME_SLOTS.map((slot) => {
                  const isTaken = unavailableSlots.includes(slot);
                  return (
                    <option
                      key={slot}
                      value={slot}
                      disabled={isTaken}
                      className={isTaken ? "text-gray-400 bg-gray-100" : ""}
                    >
                      {slot} {isTaken ? "(Taken)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-[var(--color-extra-5)] rounded-lg hover:bg-[var(--color-extra-3)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(status, date, timeSlot)}
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
  const {
  filteredRecords,
  emailSearch,
  setEmailSearch,
  petSearch,
  setPetSearch,
  doctor,
  setDoctor,
  service,
  setService,
  doctorOptions,
  serviceOptions,
} = useReservationSearch(allRecords);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
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

  const handleSave = (status: string, date: string, timeSlot: string) => {
    if (selectedRes) {
      updateReservation(
        {
          id: selectedRes._id,
          updates: { status, date, timeSlot },
        },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Reservation updated successfully",
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "all"
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "today"
              ? "bg-white dark:bg-[var(--color-dark-card)] text-[var(--color-primary)] shadow-sm"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
          >
            <Calendar size={16} /> Today Only
          </button>
        </div>
      </div>

      <StaffStatsOverview />

      <SharedSearch
        searches={[
          {
            placeholder: "Search by Email",
            value: emailSearch,
            onChange: setEmailSearch,
          },
          {
            placeholder: "Search by Pet Name",
            value: petSearch,
            onChange: setPetSearch,
          },
        ]}
        filters={[
          {
            value: doctor,
            onChange: setDoctor,
            options: doctorOptions,
          },
          {
            value: service,
            onChange: setService,
            options: serviceOptions,
          },
        ]}
      />

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
