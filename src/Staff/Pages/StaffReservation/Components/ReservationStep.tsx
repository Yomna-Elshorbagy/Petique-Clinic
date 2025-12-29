import React from "react";
import { Stethoscope, Briefcase, Clock, AlertCircle } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { type FullReservationFormData } from "../../../../Utils/Schema/fullReservationSchema";
import { TIME_SLOTS } from "../../../../Constants/timeSlots";
import type { IService } from "../../../../Interfaces/IService";
import type { IUser } from "../../../../Interfaces/IUser";

interface ReservationStepProps {
  register: UseFormRegister<FullReservationFormData>;
  errors: FieldErrors<FullReservationFormData>;
  formData: FullReservationFormData;
  services: any[];
  doctors: any[];
  unavailableSlots: string[];
}

const ReservationStep: React.FC<ReservationStepProps> = ({
  register,
  errors,
  formData,
  services,
  doctors,
  unavailableSlots,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3 text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        <div className="p-2 bg-[var(--color-extra-5)] rounded-lg text-[var(--color-extra-2)]">
          <Stethoscope size={24} />
        </div>
        <h3>Reservation Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
            Service Type
          </label>
          <select
            {...register("reservation.service")}
            className={`w-full p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium appearance-none ${
              errors.reservation?.service
                ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
            }`}
          >
            <option value="">Select a Service</option>
            {services.map((s: IService) => (
              <option key={s._id} value={s._id}>
                {s.title}
              </option>
            ))}
          </select>
          {errors.reservation?.service && (
            <p className="text-red-500 text-xs ml-1">
              {errors.reservation.service.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
            Consulting Doctor
          </label>
          <div className="relative group">
            <Briefcase
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-extra-2)] transition-colors ${
                errors.reservation?.doctor ? "text-red-500" : ""
              }`}
              size={18}
            />
            <select
              {...register("reservation.doctor")}
              className={`w-full pl-12 p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium appearance-none ${
                errors.reservation?.doctor
                  ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                  : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
              }`}
            >
              <option value="">Select a Doctor</option>
              {doctors?.map((d: IUser) => (
                <option key={d._id} value={d._id}>
                  {d.userName}
                </option>
              ))}
            </select>
          </div>
          {errors.reservation?.doctor && (
            <p className="text-red-500 text-xs ml-1">
              {errors.reservation.doctor.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
            Appointment Date
          </label>
          <input
            {...register("reservation.date")}
            type="date"
            min={today}
            className={`w-full p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium ${
              errors.reservation?.date
                ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
            }`}
          />
          {errors.reservation?.date && (
            <p className="text-red-500 text-xs ml-1">
              {errors.reservation.date.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
            Preferred Time Slot
          </label>
          <div className="relative group">
            <Clock
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-extra-2)] transition-colors ${
                errors.reservation?.timeSlot ? "text-red-500" : ""
              }`}
              size={18}
            />
            <select
              {...register("reservation.timeSlot")}
              disabled={
                !formData.reservation.date || !formData.reservation.doctor
              }
              className={`w-full pl-12 p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 font-medium appearance-none disabled:bg-gray-100 disabled:text-gray-400 ${
                errors.reservation?.timeSlot
                  ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                  : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
              }`}
            >
              <option value="">Choose a Time</option>
              {TIME_SLOTS.map((slot) => {
                const isTaken = unavailableSlots.includes(slot);
                return (
                  <option key={slot} value={slot} disabled={isTaken}>
                    {slot} {isTaken ? " (Booked)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
          {errors.reservation?.timeSlot && (
            <p className="text-red-500 text-xs ml-1">
              {errors.reservation.timeSlot.message}
            </p>
          )}
          {!formData.reservation.date || !formData.reservation.doctor ? (
            <p className="text-xs text-[var(--color-light-accent)] mt-2 flex items-center gap-1.5 font-medium italic">
              <AlertCircle size={14} /> Please select a doctor and date first.
            </p>
          ) : null}
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
            Appointment Notes
          </label>
          <textarea
            {...register("reservation.notes")}
            placeholder="Enter any specific concerns or requests..."
            className="w-full p-4 bg-[var(--color-bg-light)] border border-[var(--color-extra-3)] rounded-2xl focus:ring-4 focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)] outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium min-h-[120px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationStep;
