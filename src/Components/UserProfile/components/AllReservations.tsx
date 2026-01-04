import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaPaw,
  FaStethoscope,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import { useMyReservations } from "../../../Hooks/Reservation/useReservation";
import type { Reservation } from "../../../Interfaces/IReservations";
import SharedPagination from "./SharedPagination";

const getStatusConfig = (status: string) => {
  const configs: Record<
    string,
    { icon: React.ReactNode; color: string; bg: string }
  > = {
    confirmed: {
      icon: <FaCheckCircle />,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    pending: {
      icon: <FaHourglassHalf />,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    cancelled: {
      icon: <FaTimesCircle />,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    completed: {
      icon: <FaCheckCircle />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
  };
  return (
    configs[status.toLowerCase()] || {
      icon: <FaHourglassHalf />,
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-50 dark:bg-gray-900/20",
    }
  );
};

const formatDate = (dateString: string, lng: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(lng, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeString: string) => {
  return timeString;
};

export default function AllReservations() {
  const { t, i18n } = useTranslation();
  const { data: reservations = [], isLoading, isError } = useMyReservations();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4;

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
          <FaTimesCircle className="text-red-500 text-2xl" />
        </div>
        <p className="text-red-600 dark:text-red-400 font-medium">
          {t("userProfile.appointments.error")}
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
          {t("userProfile.appointments.empty.title")}
        </h3>
        <p className="text-[var(--color-text-muted)]">
          {t("userProfile.appointments.empty.text")}
        </p>
      </div>
    );

  // Pagination logic
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = reservations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[var(--color-light-accent)]/10 to-[var(--color-accent-light)]/10 dark:from-[var(--color-dark-accent)]/20 dark:to-[var(--color-dark-accent)]/10 rounded-2xl p-5 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">
                {t("userProfile.appointments.stats.total")}
              </p>
              <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                {reservations.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--color-light-accent)]/20 dark:bg-[var(--color-dark-accent)]/20">
              <FaCalendarAlt className="text-2xl text-[var(--color-light-accent)]" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400 mb-1">
                {t("userProfile.appointments.status.confirmed")}
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {
                  reservations.filter(
                    (r: Reservation) => r.status?.toLowerCase() === "confirmed"
                  ).length
                }
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-5 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">
                {t("userProfile.appointments.status.pending")}
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {
                  reservations.filter(
                    (r: Reservation) => r.status?.toLowerCase() === "pending"
                  ).length
                }
              </p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
              <FaHourglassHalf className="text-2xl text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedReservations.map((reservation: Reservation) => {
          const statusConfig = getStatusConfig(reservation.status);
          return (
            <div
              key={reservation._id}
              className="group relative bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] hover:shadow-xl hover:border-[var(--color-light-accent)]/50 dark:hover:border-[var(--color-dark-accent)]/50 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-light-accent)]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Status Badge */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}
                >
                  {statusConfig.icon}
                  <span className="capitalize">{reservation.status}</span>
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  ID: {reservation._id.slice(-6)}
                </div>
              </div>

              {/* Pet Info */}
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                  <FaPaw className="text-2xl text-[var(--color-light-accent)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
                    {reservation.pet?.name || "N/A"}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {reservation.pet?.category.name || t("userProfile.common.petType")} •{" "}
                    {t("userProfile.personalInfo.age") || "Age"}:{" "}
                    {reservation.pet?.age || "N/A"}{" "}
                    {t("userProfile.common.years") || "years"}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                  <FaCalendarAlt className="text-[var(--color-light-accent)] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-0.5">
                      {t("userProfile.common.date")}
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {formatDate(reservation.date, i18n.language)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                  <FaClock className="text-[var(--color-light-accent)] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-0.5">
                      {t("userProfile.common.time")}
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {formatTime(reservation.timeSlot)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service & Doctor */}
              <div className="space-y-3 pt-4 border-t border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                    <FaStethoscope className="text-[var(--color-light-accent)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[var(--color-text-muted)] mb-0.5">
                      {t("userProfile.common.service")}
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {reservation.service?.title || "N/A"}
                    </p>
                    {reservation.service?.priceRange && (
                      <p className="text-xs text-[var(--color-light-accent)] mt-0.5">
                        {reservation.service.priceRange}{" "}
                        {t("userProfile.common.currency")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                    <FaUserMd className="text-[var(--color-light-accent)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[var(--color-text-muted)] mb-0.5">
                      {t("userProfile.common.doctor")}
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {t("userProfile.common.doctor")}.{" "}
                      {reservation.doctor?.userName || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <SharedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
