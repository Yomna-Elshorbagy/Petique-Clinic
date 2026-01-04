import React, { useState } from "react";
import { Syringe } from "lucide-react";
import { useUpdatePetVaccinationStaff } from "../../../../Hooks/Staff/useStaff";
import Swal from "sweetalert2";

interface VaccinationCardProps {
    record: any;
}

const VaccinationCard: React.FC<VaccinationCardProps> = ({ record }) => {
    const { mutate: updateStatus, isPending } = useUpdatePetVaccinationStaff();
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [newDate, setNewDate] = useState(
        record.date ? new Date(record.date).toISOString().split("T")[0] : ""
    );

    const handleComplete = () => {
        updateStatus(
            {
                petId: record.petId,
                vaccinationHistoryId: record.vaccinationHistoryId || record._id,
                updates: { status: "completed" },
            },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Vaccination marked as complete!",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                },
                onError: (error: any) => {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: error?.response?.data?.message || "Failed to update status",
                    });
                },
            }
        );
    };

    const handleReschedule = () => {
        if (isRescheduling && newDate) {
            updateStatus(
                {
                    petId: record.petId,
                    vaccinationHistoryId: record.vaccinationHistoryId || record._id,
                    updates: { date: newDate, status: "scheduled" },
                },
                {
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Rescheduled",
                            text: "Vaccination rescheduled successfully!",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        setIsRescheduling(false);
                    },
                    onError: (error: any) => {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: error?.response?.data?.message || "Failed to reschedule",
                        });
                    },
                }
            );
        } else {
            setIsRescheduling(true);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-700";
            case "overdue":
                return "bg-red-100 text-red-700";
            case "due today":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getIconColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-600";
            case "overdue":
                return "bg-red-100 text-red-600";
            case "due today":
                return "bg-blue-100 text-blue-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="bg-white dark:bg-[var(--color-dark-card)] p-4 rounded-xl shadow-sm border border-[var(--color-extra-3)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconColor(
                        record.status
                    )}`}
                >
                    <Syringe size={20} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[var(--color-text-primary)]">
                            {record.vaccineName}
                        </h3>
                        <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusColor(
                                record.status
                            )}`}
                        >
                            {record.status}
                        </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        {record.petName} • {record.ownerName}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                <div className="text-right">
                    <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                        Due Date
                    </p>
                    {isRescheduling ? (
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="text-sm border rounded px-2 py-1 outline-none focus:border-[var(--color-light-accent)]"
                        />
                    ) : (
                        <p
                            className={`font-medium ${record.status === "overdue"
                                    ? "text-red-500"
                                    : "text-[var(--color-light-accent)]"
                                }`}
                        >
                            {record.date
                                ? new Date(record.date).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                : "N/A"}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                        onClick={handleReschedule}
                        disabled={isPending || record.status === "completed"}
                        className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border border-[var(--color-extra-3)] rounded-lg transition-colors text-[var(--color-text-primary)] 
            ${record.status === "completed"
                                ? "opacity-50 cursor-not-allowed bg-gray-100"
                                : "hover:bg-[var(--color-extra-5)]"
                            }`}
                    >
                        {isRescheduling ? (isPending ? "Saving..." : "Save") : "Reschedule"}
                    </button>

                    {record.status !== "completed" && (
                        <button
                            onClick={handleComplete}
                            disabled={isPending}
                            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium bg-green-100  text-green-800 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm hover:shadow-md"
                        >
                            {isPending ? "Updating..." : "Complete"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VaccinationCard;
