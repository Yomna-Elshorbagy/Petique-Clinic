import { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaPaw,
  FaStethoscope,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import { useMyPastReservations } from "../../../Hooks/Reservation/useReservation";
import type { Reservation } from "../../../Interfaces/IReservations";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (timeString: string) => {
  return timeString;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed:
      "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    cancelled: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
    confirmed:
      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
  };
  return (
    colors[status.toLowerCase()] ||
    "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20"
  );
};

export default function PastReservations() {
  const {
    data: reservations = [],
    isLoading,
    isError,
  } = useMyPastReservations();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoaderPage />
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-12">
        <div className="inline-block p-4 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
          <FaCalendarAlt className="text-red-500 text-2xl" />
        </div>
        <p className="text-red-600 dark:text-red-400 font-medium">
          Failed to load past reservations
        </p>
      </div>
    );

  if (!reservations || reservations.length === 0)
    return (
      <div className="text-center py-16">
        <div className="inline-block p-6 rounded-full bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-elevated)] mb-4">
          <FaCalendarAlt className="text-4xl text-[var(--color-light-accent)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          No Past Appointments
        </h3>
        <p className="text-[var(--color-text-muted)]">
          You don't have any past appointments yet.
        </p>
      </div>
    );

  // Sort by date (most recent first)
  const sortedReservations = [...reservations].sort(
    (a: Reservation, b: Reservation) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group by month
  const groupedByMonth = sortedReservations.reduce(
    (acc: Record<string, Reservation[]>, reservation: Reservation) => {
      const date = new Date(reservation.date);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(reservation);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-[var(--color-bg-cream)] to-[var(--color-bg-warm)] dark:from-[var(--color-dark-bg-elevated)] dark:to-[var(--color-dark-bg-deep)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              Total Past Appointments
            </h3>
            <p className="text-3xl font-bold text-[var(--color-light-accent)]">
              {reservations.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-light-accent)]/10 dark:bg-[var(--color-dark-accent)]/20">
            <FaCheckCircle className="text-3xl text-[var(--color-light-accent)]" />
          </div>
        </div>
      </div>

      {/* Grouped Reservations */}
      {(Object.entries(groupedByMonth) as [string, Reservation[]][]).map(
        ([month, monthReservations]) => (
          <div key={month} className="space-y-4">
            {/* month Header */}
            <div className="sticky top-0 z-10 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] py-3 px-4 rounded-xl border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] shadow-sm">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                {month}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {monthReservations.length} appointment
                {monthReservations.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Reservations List */}
            <div className="space-y-3">
              {monthReservations.map((reservation: Reservation) => {
                const isExpanded = expandedId === reservation._id;
                return (
                  <div
                    key={reservation._id}
                    className="bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] overflow-hidden hover:shadow-lg hover:border-[var(--color-light-accent)]/30 dark:hover:border-[var(--color-dark-accent)]/30 transition-all duration-300"
                  >
                    {/* Compact Header */}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : reservation._id)
                      }
                      className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-[var(--color-bg-cream)] dark:hover:bg-[var(--color-dark-bg-hover)] transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Date Badge */}
                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
                          <FaCalendarAlt className="text-[var(--color-light-accent)] text-lg mb-1" />
                          <span className="text-xs font-bold text-[var(--color-text-primary)]">
                            {new Date(reservation.date).getDate()}
                          </span>
                        </div>

                        {/* Main Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-base font-bold text-[var(--color-text-primary)] truncate">
                              {reservation.pet?.name || "N/A"}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${getStatusColor(
                                reservation.status
                              )}`}
                            >
                              {reservation.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                            <span className="flex items-center gap-1">
                              <FaStethoscope className="text-xs" />
                              {reservation.service?.name || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-xs" />
                              {formatTime(reservation.time)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expand/Collapse Icon */}
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <FaChevronUp className="text-[var(--color-light-accent)]" />
                        ) : (
                          <FaChevronDown className="text-[var(--color-text-muted)]" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
                        <div className="pt-4 space-y-4">
                          {/* Pet Details */}
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                            <FaPaw className="text-[var(--color-light-accent)] flex-shrink-0" />
                            <div>
                              <p className="text-xs text-[var(--color-text-muted)] mb-0.5">
                                Pet Information
                              </p>
                              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                {reservation.pet?.name || "N/A"} •{" "}
                                {reservation.pet?.type || "N/A"} • Age:{" "}
                                {reservation.pet?.age || "N/A"} years
                              </p>
                            </div>
                          </div>

                          {/* Service Details */}
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                            <FaStethoscope className="text-[var(--color-light-accent)] flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs text-[var(--color-text-muted)] mb-0.5">
                                Service
                              </p>
                              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                {reservation.service?.name || "N/A"}
                              </p>
                              {reservation.service?.price && (
                                <p className="text-xs text-[var(--color-light-accent)] mt-0.5">
                                  {reservation.service.price} EGP
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Doctor Details */}
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                            <FaUserMd className="text-[var(--color-light-accent)] flex-shrink-0" />
                            <div>
                              <p className="text-xs text-[var(--color-text-muted)] mb-0.5">
                                Doctor
                              </p>
                              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                Dr. {reservation.doctor?.userName || "N/A"}
                              </p>
                              {reservation.doctor?.email && (
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                  {reservation.doctor.email}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Date & Time */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                              <p className="text-xs text-[var(--color-text-muted)] mb-1">
                                Date
                              </p>
                              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                {formatDate(reservation.date)}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                              <p className="text-xs text-[var(--color-text-muted)] mb-1">
                                Time
                              </p>
                              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                {formatTime(reservation.time)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
