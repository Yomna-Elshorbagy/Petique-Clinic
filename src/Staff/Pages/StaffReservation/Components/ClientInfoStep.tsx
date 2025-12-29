import React from "react";
import { ClipboardList, User, Mail, Phone } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { FullReservationFormData } from "../../../../Utils/Schema/fullReservationSchema";

interface ClientInfoStepProps {
  register: UseFormRegister<FullReservationFormData>;
  errors: FieldErrors<FullReservationFormData>;
}

const ClientInfoStep: React.FC<ClientInfoStepProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3 text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        <div className="p-2 bg-[var(--color-extra-5)] rounded-lg text-[var(--color-extra-2)]">
          <ClipboardList size={24} />
        </div>
        <h3>Client Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
            Full Name
          </label>
          <div className="relative group">
            <User
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-extra-2)] transition-colors ${
                errors.user?.userName ? "text-red-500" : ""
              }`}
              size={18}
            />
            <input
              {...register("user.userName")}
              type="text"
              placeholder="e.g. yomna mohamed"
              className={`w-full pl-12 p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium ${
                errors.user?.userName
                  ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                  : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
              }`}
            />
          </div>
          {errors.user?.userName && (
            <p className="text-red-500 text-xs ml-1">
              {errors.user.userName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-extra-2)] transition-colors ${
                errors.user?.email ? "text-red-500" : ""
              }`}
              size={18}
            />
            <input
              {...register("user.email")}
              type="email"
              placeholder="example@mail.com"
              className={`w-full pl-12 p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium ${
                errors.user?.email
                  ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                  : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
              }`}
            />
          </div>
          {errors.user?.email && (
            <p className="text-red-500 text-xs ml-1">
              {errors.user.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
            Phone Number
          </label>
          <div className="relative group">
            <Phone
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-extra-2)] transition-colors ${
                errors.user?.mobileNumber ? "text-red-500" : ""
              }`}
              size={18}
            />
            <input
              {...register("user.mobileNumber")}
              type="tel"
              placeholder="01xxxxxxxxx"
              className={`w-full pl-12 p-4 bg-[var(--color-bg-light)] border rounded-2xl focus:ring-4 outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium ${
                errors.user?.mobileNumber
                  ? "border-red-500 focus:ring-red-500/10 focus:border-red-500"
                  : "border-[var(--color-extra-3)] focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)]"
              }`}
            />
          </div>
          {errors.user?.mobileNumber && (
            <p className="text-red-500 text-xs ml-1">
              {errors.user.mobileNumber.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">
            Gender
          </label>
          <select
            {...register("user.gender")}
            className="w-full p-4 bg-[var(--color-bg-light)] border border-[var(--color-extra-3)] rounded-2xl focus:ring-4 focus:ring-[var(--color-extra-2)]/10 focus:border-[var(--color-extra-2)] outline-none transition-all dark:bg-zinc-800 text-[var(--color-text-primary)] font-medium appearance-none"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoStep;
