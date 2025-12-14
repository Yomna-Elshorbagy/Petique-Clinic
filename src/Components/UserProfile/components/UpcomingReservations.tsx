import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaPaw,
  FaStethoscope,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import LoaderPage from "../../../Shared/LoaderPage/LoaderPage";
import { useMyUpcomingReservations } from "../../../Hooks/Reservation/useReservation";
import type { Reservation } from "../../../Interfaces/IReservations";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }
};

const formatTime = (timeString: string) => {
  return timeString;
};

const getDaysUntil = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function UpcomingReservations() {
  const {
    data: reservations = [],
    isLoading,
    isError,
  } = useMyUpcomingReservations();

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
          <FaClock className="text-red-500 text-2xl" />
        </div>
        <p className="text-red-600 dark:text-red-400 font-medium">
          Failed to load upcoming reservations
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
          No Upcoming Appointments
        </h3>
        <p className="text-[var(--color-text-muted)]">
          You don't have any upcoming appointments scheduled.
        </p>
      </div>
    );

  // Sort by date
  const sortedReservations = [...reservations].sort(
    (a: Reservation, b: Reservation) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="relative">
      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-light-accent)] via-[var(--color-accent-light)] to-transparent dark:from-[var(--color-dark-accent)] dark:via-[var(--color-dark-accent-dark)] opacity-30 hidden md:block" />

        {/* Reservations Timeline */}
        <div className="space-y-8">
          {sortedReservations.map((reservation: Reservation, index: number) => {
            const daysUntil = getDaysUntil(reservation.date);
            const isToday = daysUntil === 0;
            const isTomorrow = daysUntil === 1;

            return (
              <div
                key={reservation._id}
                className="relative flex gap-6 group"
              >
                {/* Timeline Dot */}
                <div className="relative z-10 flex-shrink-0 hidden md:flex">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg transition-transform group-hover:scale-110 ${
                      isToday
                        ? "bg-[var(--color-light-accent)] border-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-accent)] dark:border-[var(--color-dark-card)] animate-pulse"
                        : "bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] border-[var(--color-light-accent)] dark:border-[var(--color-dark-accent)]"
                    }`}
                  >
                    <FaPaw
                      className={`text-lg ${
                        isToday
                          ? "text-white"
                          : "text-[var(--color-light-accent)] dark:text-[var(--color-dark-accent)]"
                      }`}
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] hover:shadow-2xl hover:border-[var(--color-light-accent)]/50 dark:hover:border-[var(--color-dark-accent)]/50 transition-all duration-300 overflow-hidden relative">
                  {/* Urgency Badge */}
                  {isToday && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[var(--color-light-accent)] to-[var(--color-accent-dark)] text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                      TODAY
                    </div>
                  )}
                  {isTomorrow && !isToday && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[var(--color-accent-light)] to-[var(--color-light-accent)] text-white text-xs font-bold rounded-full shadow-lg">
                      TOMORROW
                    </div>
                  )}

                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-light-accent)]/10 to-transparent rounded-bl-full" />

                  <div className="relative">
                    {/* Header with Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                            <FaCalendarAlt className="text-[var(--color-light-accent)]" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                              {formatDate(reservation.date)}
                            </h3>
                            {daysUntil > 1 && (
                              <p className="text-sm text-[var(--color-text-muted)]">
                                In {daysUntil} days
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)]">
                        <FaClock className="text-[var(--color-light-accent)]" />
                        <span className="text-lg font-semibold text-[var(--color-text-primary)]">
                          {formatTime(reservation.time)}
                        </span>
                      </div>
                    </div>

                    {/* Pet & Service Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
                        <div className="p-3 rounded-lg bg-[var(--color-light-accent)]/20 dark:bg-[var(--color-dark-accent)]/20">
                          <FaPaw className="text-2xl text-[var(--color-light-accent)]" />
                        </div>
                        <div>
                          <p className="text-xs text-[var(--color-text-muted)] mb-1">
                            Pet
                          </p>
                          <p className="text-lg font-bold text-[var(--color-text-primary)]">
                            {reservation.pet?.name || "N/A"}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {reservation.pet?.type} • {reservation.pet?.age} years
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-hover)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
                        <div className="p-3 rounded-lg bg-[var(--color-light-accent)]/20 dark:bg-[var(--color-dark-accent)]/20">
                          <FaStethoscope className="text-2xl text-[var(--color-light-accent)]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-[var(--color-text-muted)] mb-1">
                            Service
                          </p>
                          <p className="text-lg font-bold text-[var(--color-text-primary)]">
                            {reservation.service?.name || "N/A"}
                          </p>
                          {reservation.service?.price && (
                            <p className="text-sm text-[var(--color-light-accent)] font-semibold">
                              {reservation.service.price} EGP
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[var(--color-bg-cream)] to-[var(--color-bg-warm)] dark:from-[var(--color-dark-bg-hover)] dark:to-[var(--color-dark-bg-elevated)] border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[var(--color-light-accent)]/20 dark:bg-[var(--color-dark-accent)]/20">
                          <FaUserMd className="text-xl text-[var(--color-light-accent)]" />
                        </div>
                        <div>
                          <p className="text-xs text-[var(--color-text-muted)] mb-0.5">
                            Assigned Doctor
                          </p>
                          <p className="text-base font-semibold text-[var(--color-text-primary)]">
                            Dr. {reservation.doctor?.userName || "N/A"}
                          </p>
                        </div>
                      </div>
                      <FaArrowRight className="text-[var(--color-light-accent)] opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

