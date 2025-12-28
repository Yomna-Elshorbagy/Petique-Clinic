import React from "react";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock3,
} from "lucide-react";

interface Reservation {
  _id: string;
  petOwner: {
    _id: string;
    userName: string;
    email: string;
    image?: { secure_url: string };
  };
  pet: {
    _id: string;
    name: string;
    type?: string;
    image?: { secure_url: string };
  };
  service: {
    title: string;
    priceRange?: string;
  };
  doctor?: {
    userName: string;
  };
  date: string;
  timeSlot?: string;
  status: string;
}

interface ReservationsTableProps {
  data: Reservation[];
  loading: boolean;
  onEdit: (reservation: Reservation) => void;
  title: string;
  pagination?: React.ReactNode;
}

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  data,
  loading,
  onEdit,
  title,
  pagination,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle size={12} /> Completed
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <CheckCircle size={12} /> Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle size={12} /> Cancelled
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <AlertCircle size={12} /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <Clock3 size={12} /> {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-extra-3)]/40 p-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Table Container */}
      <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-xl shadow-sm border border-[var(--color-extra-3)]/40 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-extra-3)]/40 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <h2 className="font-bold text-lg text-[var(--color-text-primary)]">
            {title}
          </h2>
          <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-extra-5)] px-2 py-1 rounded-md">
            {data.length} Records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-extra-3)]/40 text-xs uppercase tracking-wider text-[var(--color-text-muted)] bg-gray-50/30 dark:bg-white/5">
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Pet</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Doctor</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-extra-3)]/40 text-sm">
              {data.length > 0 ? (
                data.map((res) => (
                  <tr
                    key={res._id}
                    className="group hover:bg-[var(--color-extra-5)]/30 transition-colors"
                  >
                    {/* Client */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm ring-2 ring-white overflow-hidden">
                          {res.petOwner?.image?.secure_url ? (
                            <img
                              src={res.petOwner.image.secure_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            res.petOwner?.userName?.charAt(0).toUpperCase() || (
                              <User size={16} />
                            )
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)]">
                            {res.petOwner?.userName || "Has no Owner"}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {res.petOwner?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Pet */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[var(--color-extra-5)] text-[var(--color-text-muted)]">
                          {res.pet?.image?.secure_url ? (
                            <img
                              src={res.pet.image.secure_url}
                              alt=""
                              className="w-6 h-6 object-cover rounded"
                            />
                          ) : (
                            <span className="text-xs font-bold">🐾</span>
                          )}
                        </div>
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {res.pet?.name || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                        <Stethoscope
                          size={16}
                          className="text-[var(--color-light-accent)]"
                        />
                        <span>{res.service?.title || "General Checkup"}</span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                          Dr
                        </div>
                        <span className="text-[var(--color-text-muted)] font-medium">
                          {res.doctor?.userName || "Not Assigned"}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-medium">
                          <Calendar
                            size={14}
                            className="text-[var(--color-light-accent)]"
                          />
                          <span>
                            {new Date(res.date).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {res.timeSlot && (
                          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                            <Clock size={12} />
                            <span>{res.timeSlot}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(res.status)}</td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onEdit(res)}
                        className="p-2 rounded-lg hover:bg-[var(--color-extra-3)] text-[var(--color-text-muted)] transition-all active:scale-95"
                        title="Edit Reservation"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-[var(--color-text-muted)]">
                      <div className="w-16 h-16 bg-[var(--color-extra-5)] rounded-full flex items-center justify-center">
                        <Calendar size={32} strokeWidth={1.5} />
                      </div>
                      <p className="font-medium">
                        No reservations found for this view.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && <div className="flex justify-center">{pagination}</div>}
    </div>
  );
};

export default ReservationsTable;
