import React from "react";
import { useTrackReservations } from "../../Hooks/Reservation/useTrackReservations";
import type { ITrackedReservation } from "../../Interfaces/IReservations";
import {
  FaPaw,
  FaUserMd,
  FaNotesMedical,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaHourglassHalf,
} from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";

import SharedPagination from "../../Components/UserProfile/components/SharedPagination";

const ReservationTracker = () => {
  const {
    data: reservations,
    isLoading,
    error,
    refetch,
  } = useTrackReservations();
  const [selectedPet, setSelectedPet] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4;

  React.useEffect(() => {
    console.log("Tracked Reservations Data:", reservations);
    console.log("Tracked Reservations Error:", error);
  }, [reservations, error]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedPet]);

  if (isLoading) return <LoaderPage />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        <div className="text-center text-red-500">
          Error loading tracker data.
        </div>
        <button
          onClick={() => refetch()}
          className="text-[var(--color-light-accent)] hover:underline"
        >
          Try Again
        </button>
      </div>
    );

  const hasReservations = reservations && reservations.length > 0;

  if (!hasReservations)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 bg-[var(--color-bg-light)]/50">
        <div className="text-[var(--color-text-muted)] text-6xl">
          <FaPaw />
        </div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          No Tracked Reservations Found
        </h2>
        <p className="text-[var(--color-text-muted)] max-w-md">
          You don't have any upcoming or past reservations to track yet. Once
          you book an appointment, it will appear here.
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-[var(--color-light-accent)] text-white rounded-full hover:bg-[var(--color-accent-dark)] transition-colors shadow-sm"
        >
          Refresh Data
        </button>
      </div>
    );

  // Extract unique pets
  const uniquePets = Array.from(
    new Set(reservations.map((r: ITrackedReservation) => r.pet?._id))
  )
    .map(
      (id) =>
        reservations.find((r: ITrackedReservation) => r.pet?._id === id)?.pet
    )
    .filter(Boolean);

  const filteredReservations =
    selectedPet === "all"
      ? reservations
      : reservations.filter(
          (r: ITrackedReservation) => r.pet?._id === selectedPet
        );

  // Pagination logic
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = filteredReservations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll to top on change
  };

  // Determine container classes based on context
  // If used inside profile, we might want less padding or no background
  return (
    <div className="p-4 md:p-6 bg-[var(--color-bg-light)]/50 rounded-xl min-h-[500px]">
      <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 self-start xl:self-center">
          <FaPaw className="text-[var(--color-light-accent)]" />
          Reservation Tracker
        </h2>

        <div className="flex flex-wrap items-center gap-4 self-end xl:self-center">
          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-light-accent)] transition-colors bg-[var(--color-bg-lighter)] rounded-full shadow-sm hover:shadow-md"
            title="Refresh"
          >
            <FaClock />
          </button>

          {/* Pet Filter */}
          <div className="flex items-center gap-2 bg-[var(--color-bg-lighter)] p-2 rounded-lg shadow-sm border border-[var(--color-border-light)]">
            <span className="text-sm font-medium text-[var(--color-text-muted)] whitespace-nowrap">
              Filter by Pet:
            </span>
            <select
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="outline-none text-sm font-semibold text-[var(--color-text-primary)] bg-transparent cursor-pointer min-w-[100px]"
            >
              <option value="all">All Pets</option>
              {uniquePets.map((pet) => (
                <option key={pet?._id} value={pet?._id}>
                  {pet?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedReservations.map((reservation) => (
          <TrackerCard key={reservation._id} reservation={reservation} />
        ))}
        {filteredReservations.length === 0 && (
          <div className="col-span-full text-center text-[var(--color-text-muted)] py-12">
            No reservations found for this pet.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredReservations.length > itemsPerPage && (
        <SharedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

const TrackerCard = ({ reservation }: { reservation: ITrackedReservation }) => {
  const { trackerStatus, pet, doctor, service, date } = reservation;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
      case "confirmed":
        return {
          color: "text-green-600",
          bg: "bg-green-100",
          border: "border-green-200",
          icon: <FaCheckCircle />,
        };
      case "waiting":
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          border: "border-yellow-200",
          icon: <FaHourglassHalf />,
        };
      case "scheduled":
        return {
          color: "text-[var(--color-light-accent)]",
          bg: "bg-[var(--color-light-accent)]/10",
          border: "border-[var(--color-light-accent)]/20",
          icon: <FaClock />,
        };
      case "cancelled":
      case "no_show":
        return {
          color: "text-red-600",
          bg: "bg-red-100",
          border: "border-red-200",
          icon: <FaTimesCircle />,
        };
      default:
        return {
          color: "text-[var(--color-text-muted)]",
          bg: "bg-[var(--color-bg-cream)]",
          border: "border-[var(--color-border-light)]",
          icon: <FaClock />,
        };
    }
  };

  const statusConfig = getStatusConfig(trackerStatus);

  const steps = [
    { id: "scheduled", label: "Scheduled", icon: <FaClock /> },
    { id: "confirmed", label: "Confirmed", icon: <FaCheckCircle /> },
    { id: "waiting", label: "Waiting", icon: <FaHourglassHalf /> },
    { id: "completed", label: "Completed", icon: <FaNotesMedical /> },
  ];

  // Determine active step index
  let activeStepIndex = -1;
  if (trackerStatus === "scheduled") activeStepIndex = 0;
  if (trackerStatus === "confirmed") activeStepIndex = 1;
  if (trackerStatus === "waiting") activeStepIndex = 2;
  if (trackerStatus === "completed") activeStepIndex = 3;

  const isFailedState =
    trackerStatus === "cancelled" || trackerStatus === "no_show";

  return (
    <div className="bg-[var(--color-bg-lighter)] rounded-2xl shadow-sm border border-[var(--color-border-light)] overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div
        className={`px-5 py-4 border-b flex justify-between items-center ${statusConfig.bg} ${statusConfig.border} bg-opacity-20`}
      >
        <div className={`flex items-center gap-2 ${statusConfig.color}`}>
          <span className="text-xl">{statusConfig.icon}</span>
          <span className="font-semibold capitalize">
            {trackerStatus.replace("_", " ")}
          </span>
        </div>
        <div className="text-xs font-medium opacity-80 bg-[var(--color-bg-lighter)] px-2 py-1 rounded-full text-[var(--color-text-muted)]">
          {new Date(date).toLocaleDateString()}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Pet Info */}
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-light)]">
          <div className="w-10 h-10 rounded-full bg-[var(--color-bg-cream)] flex items-center justify-center text-[var(--color-light-accent)]">
            <FaPaw />
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Pet</p>
            <p className="font-bold text-[var(--color-text-primary)]">
              {pet?.name || "Unknown Pet"}{" "}
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                ({pet?.category.name || "N/A"})
              </span>
            </p>
          </div>
        </div>

        {/* Service & Doctor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1 flex items-center gap-1">
              <FaNotesMedical /> Service
            </p>
            <p
              className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-1"
              title={service?.title}
            >
              {service?.title || "Unknown Service"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1 flex items-center gap-1">
              <FaUserMd /> Doctor
            </p>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              Dr. {doctor?.userName || "Unknown"}
            </p>
          </div>
        </div>

        {/* Timeline Visualization */}
        {!isFailedState && (
          <div className="relative pt-6 pb-2">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--color-bg-cream)] -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-[var(--color-light-accent)] -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${(activeStepIndex / (steps.length - 1)) * 100}%`,
              }}
            ></div>

            <div className="relative z-10 flex justify-between">
              {steps.map((step, index) => {
                const isActive = index <= activeStepIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 transition-colors duration-300 ${
                        isActive
                          ? "bg-[var(--color-light-accent)] border-[var(--color-light-accent)] text-white"
                          : "bg-[var(--color-bg-lighter)] border-[var(--color-border-medium)] text-[var(--color-text-muted)]"
                      }`}
                    >
                      {isActive ? (
                        <FaCheckCircle size={10} />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-medium)]"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-[var(--color-text-muted)] font-medium px-1">
              <span>Booked</span>
              <span>Confirmed</span>
              <span>In-Clinic</span>
              <span>Done</span>
            </div>
          </div>
        )}

        {isFailedState && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
            <p className="text-red-600 text-sm font-medium flex items-center justify-center gap-2">
              <FaTimesCircle />
              Waitlist / Cancelled
            </p>
            <p className="text-xs text-red-400 mt-1">
              This appointment was {trackerStatus.replace("_", " ")}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationTracker;
