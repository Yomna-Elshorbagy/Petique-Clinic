import React from "react";
import ReactDOM from "react-dom";
import {
  X,
  User,
  Mail,
  Phone,
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  CalendarDays,
} from "lucide-react";
import { useStaffPetOwnerDetails } from "../../../../Hooks/Staff/useStaff";

interface ClientDetailsModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const { data, isLoading } = useStaffPetOwnerDetails(userId || "");

  if (!isOpen || !userId) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[var(--color-dark-card)] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-extra-3)]/30 dark:border-gray-800 flex items-center justify-between bg-[var(--color-extra-5)]/30">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <User className="text-[var(--color-light-accent)]" /> Client Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-extra-3)]/50 rounded-full transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-light-accent)]"></div>
            </div>
          ) : data ? (
            <>
              {/* User Info Section */}
              <section className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full bg-[var(--color-extra-5)] flex items-center justify-center text-3xl font-bold text-[var(--color-light-accent)] border border-[var(--color-light-accent)]/20 shrink-0">
                  {data.user.image.secure_url ? (
                    <img
                      src={data.user.image.secure_url}
                      alt={data.user.userName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    data.user.userName?.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {data.user.userName}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                      ${data.user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {data.user.status || "Active"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                      <Mail
                        size={16}
                        className="text-[var(--color-light-accent)]"
                      />
                      <span>{data.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                      <Phone
                        size={16}
                        className="text-[var(--color-light-accent)]"
                      />
                      <span>
                        {data.user.mobileNumber || "No phone provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-[var(--color-extra-3)]/30" />

              {/* Pets Section */}
              <section>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <Heart
                    className="text-[var(--color-light-accent)]"
                    size={20}
                  />{" "}
                  Pets ({data.pets?.length || 0})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.pets?.map((pet: any) => (
                    <div
                      key={pet._id}
                      className="bg-[var(--color-extra-5)]/30 rounded-xl p-4 border border-[var(--color-extra-3)]/30 hover:border-[var(--color-light-accent)]/30 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl overflow-hidden shrink-0">
                          {pet.image ? (
                            <img
                              src={pet.image.secure_url}
                              alt={pet.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "🐾"
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-[var(--color-text-primary)]">
                              {pet.name}
                            </h4>
                            <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded text-[var(--color-text-muted)] border border-[var(--color-extra-3)]">
                              {pet.category?.name || "Pet"}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            {pet.breed} • {pet.gender} • {pet.age} yo
                          </p>
                        </div>
                      </div>

                      {/* Vaccination Status Summary */}
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                          Vaccinations
                        </p>
                        <div className="space-y-2">
                          {pet.vaccinationHistoryWithStatus?.length > 0 ? (
                            pet.vaccinationHistoryWithStatus.map(
                              (vac: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 p-2 rounded border border-[var(--color-extra-3)]/50"
                                >
                                  <span className="font-medium text-[var(--color-text-primary)]">
                                    {vac.vaccine?.name}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    {vac.status === "completed" && (
                                      <CheckCircle
                                        size={14}
                                        className="text-green-500"
                                      />
                                    )}
                                    {vac.status === "scheduled" && (
                                      <Clock
                                        size={14}
                                        className="text-blue-500"
                                      />
                                    )}
                                    {vac.status === "overdue" && (
                                      <AlertCircle
                                        size={14}
                                        className="text-red-500"
                                      />
                                    )}
                                    <span
                                      className={`text-xs font-medium
                                    ${vac.status === "completed"
                                          ? "text-green-600"
                                          : ""
                                        }
                                    ${vac.status === "scheduled"
                                          ? "text-blue-600"
                                          : ""
                                        }
                                    ${vac.status === "overdue"
                                          ? "text-red-600"
                                          : ""
                                        }
                                  `}
                                    >
                                      {vac.status.charAt(0).toUpperCase() +
                                        vac.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              )
                            )
                          ) : (
                            <p className="text-sm text-[var(--color-text-muted)] italic">
                              No vaccination records.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.pets?.length === 0 && (
                    <div className="col-span-full text-center py-8 text-[var(--color-text-muted)] bg-[var(--color-extra-5)]/10 rounded-xl border border-dashed border-[var(--color-extra-3)]">
                      No pets registered.
                    </div>
                  )}
                </div>
              </section>
              <hr className="border-[var(--color-extra-3)]/30" />

              {/* Reservations Section */}
              <section>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <CalendarDays className="text-[var(--color-light-accent)]" size={20} />
                  Reservations ({data.reservations?.length || 0})
                </h3>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-[var(--color-extra-3)]/50 overflow-hidden">
                  {data.reservations?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--color-extra-5)]/50 text-[var(--color-text-muted)] uppercase text-xs">
                          <tr>
                            <th className="px-4 py-3">Service</th>
                            <th className="px-4 py-3">Pet</th>
                            <th className="px-4 py-3">Doctor</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-extra-3)]/30">
                          {data.reservations.map((res: any, idx: number) => (
                            <tr key={idx} className="hover:bg-[var(--color-extra-5)]/20 transition-colors">
                              <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                                {res.service?.title || "Unknown Service"}
                              </td>
                              <td className="px-4 py-3 text-[var(--color-text-muted)]">
                                {res.pet?.name || "Unknown"}
                              </td>
                              <td className="px-4 py-3 text-[var(--color-text-muted)]">
                                {res.doctor?.userName || "Not Assigned"}
                              </td>
                              <td className="px-4 py-3 text-[var(--color-text-muted)]">
                                {new Date(res.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium 
                                    ${res.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                                    ${res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                    ${res.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${res.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                                   `}>
                                  {res.status ? res.status.charAt(0).toUpperCase() + res.status.slice(1) : "Unknown"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--color-text-muted)]">
                      No reservation history found.
                    </div>
                  )}
                </div>
              </section>

            </>
          ) : (
            <div className="text-center py-10 text-[var(--color-text-muted)]">
              Client not found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-extra-3)]/30 flex justify-end bg-[var(--color-extra-5)]/30">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white dark:bg-gray-800 border border-[var(--color-extra-3)] text-[var(--color-text-primary)] hover:bg-[var(--color-extra-5)] transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    , document.body);
};

export default ClientDetailsModal;
