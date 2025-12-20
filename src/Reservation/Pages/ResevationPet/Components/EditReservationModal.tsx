import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useUpdateReservation } from "../../../../Hooks/Reservation/useReservationMutations";
import Swal from "sweetalert2";
import { useAllPets } from "../../../../Hooks/Pets/UsePets";
import { useAllDoctors } from "../../../../Hooks/Doctor/useDoctor";
import { useServices } from "../../../../Hooks/Services/UseServices";
import { useAvailableSlots } from "../../../../Hooks/Reservation/useReservation";
import type { IUser } from "../../../../Interfaces/IUser";
import type { IService } from "../../../../Interfaces/IService";
import type { IPet } from "../../../../Interfaces/Ipet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface ReservationEdit {
  _id?: string;
  pet?: IPet | string;
  petOwner?: IUser;
  doctor?: string | IUser | null;
  service?: IService | string;
  date?: string;
  timeSlot?: string;
  status?: string;
  paymentStatus?: string;
  notes?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationEdit | null;
  onUpdated?: (res: ReservationEdit) => void;
}

const reservationSchema = z.object({
  pet: z
    .string()
    .refine((val) => val !== "", { message: "Please select a pet." }),
  service: z
    .string()
    .refine((val) => val !== "", { message: "Please select a service." }),
  doctor: z
    .string()
    .refine((val) => val !== "", { message: "Please select a doctor." }),
  date: z
    .string()
    .refine((val) => val !== "", { message: "Please select a date." }),
  // .refine((val) => val >= new Date().toISOString().split("T")[0], {
  //   message: "Select a day in the future",

  timeSlot: z.string().optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  paymentStatus: z.enum(["unpaid", "paid"]),
  notes: z.string().optional(),
});

export default function EditReservationModal({
  isOpen,
  onClose,
  reservation,
  onUpdated,
}: Props) {
  const { data: petsData } = useAllPets();
  const { data: doctorsData } = useAllDoctors();
  const { data: servicesData } = useServices();

  const pets = useMemo(() => petsData?.data ?? petsData ?? [], [petsData]);
  const doctors = useMemo(() => doctorsData ?? [], [doctorsData]);
  const services = useMemo(
    () => servicesData?.data ?? servicesData ?? [],
    [servicesData]
  );

  const token = localStorage.getItem("accessToken");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationEdit>({
    resolver: zodResolver(reservationSchema) as any,
    defaultValues: {
      pet: "",
      service: "",
      doctor: "",
      date: "",
      timeSlot: "",
      status: "pending",
      paymentStatus: "unpaid",
      notes: "",
    },
  });

  const { data: allReservations = [], refetch } = useQuery<ReservationEdit[]>({
    queryKey: ["allReservations"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/reserve", {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });

  const selectedDoctor = watch("doctor");
  const selectedDate = watch("date");

  const doctorId =
    typeof selectedDoctor === "string"
      ? selectedDoctor
      : selectedDoctor?._id ?? "";

  const { data: availableSlotsData } = useAvailableSlots(
    doctorId,
    selectedDate || ""
  );

  const availableSlotsRaw = useMemo<string[]>(
    () => availableSlotsData?.availableSlots ?? availableSlotsData ?? [],
    [availableSlotsData]
  );

  const updateMutation = useUpdateReservation();

  useEffect(() => {
    if (!reservation) return;

    const doctorId =
      typeof reservation.doctor === "object"
        ? reservation.doctor?._id
        : reservation.doctor;

    const petId =
      typeof reservation.pet === "object"
        ? reservation.pet?._id
        : reservation.pet;

    const serviceId =
      typeof reservation.service === "object"
        ? reservation.service?._id
        : reservation.service;

    let dateValue = "";
    if (reservation.date) {
      const d = new Date(reservation.date);
      if (!isNaN(d.getTime())) {
        dateValue = d.toISOString().split("T")[0];
      }
    }

    setValue("pet", petId ?? "");
    setValue("service", serviceId ?? "");
    setValue("doctor", doctorId ?? "");
    setValue("date", dateValue, { shouldDirty: true, shouldTouch: true });
    setValue("timeSlot", reservation.timeSlot ?? "");
    setValue("status", reservation.status ?? "pending");
    setValue("paymentStatus", reservation.paymentStatus ?? "unpaid");
    setValue("notes", reservation.notes ?? "");
  }, [reservation, setValue]);

  const onSubmit = async (data: ReservationEdit) => {
    const dateString = data.date ? new Date(data.date).toISOString() : "";

    const payload: ReservationEdit = {
      _id: reservation!._id,
      pet: data.pet,
      service: data.service,
      doctor: data.doctor || null,
      date: dateString,
      timeSlot: data.timeSlot || reservation?.timeSlot,
      status: data.status,
      paymentStatus: data.paymentStatus,
      notes: data.notes,
    };

    updateMutation.mutate(
      { id: reservation!._id!, data: payload },
      {
        onSuccess(res) {
          Swal.fire("Updated!", "Reservation updated successfully", "success");

          onUpdated?.(res.data);
          onClose();
          refetch();
        },
        onError() {
          Swal.fire("Error", "Failed to update reservation", "error");
        },
      }
    );
  };

  const timeslotOptions = useMemo(() => {
    if (!reservation) return [];

    // const currentSlot = reservation.timeSlot;

    const bookedTimes = allReservations
      ?.filter((r) => {
        const rDate = r.date
          ? new Date(r.date).toISOString().split("T")[0]
          : "";

        const rDoctorId =
          r.doctor && typeof r.doctor === "object"
            ? r.doctor._id
            : typeof r.doctor === "string"
            ? r.doctor
            : "";

        return (
          rDate === selectedDate &&
          rDoctorId === selectedDoctor &&
          r._id !== reservation._id &&
          r.timeSlot
        );
      })
      .map((r) => r.timeSlot!)
      .filter(Boolean);

    const filtered = availableSlotsRaw
      .filter((slot): slot is string => !!slot)
      .filter((slot) => !bookedTimes.includes(slot));

    // if (currentSlot && !filtered.includes(currentSlot)) {
    //   filtered.push(currentSlot);
    // }

    return filtered.sort();
  }, [
    availableSlotsRaw,
    allReservations,
    reservation,
    selectedDoctor,
    selectedDate,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#FCF9F4] rounded-2xl shadow-xl border border-[#ECE7E2] overflow-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#ECE7E2]">
          <h3 className="text-xl font-semibold text-[#4A3F35]">
            Edit Reservation
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#A98770] hover:text-[#86654F]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#86654F]">Pet</label>
              <select
                {...register("pet")}
                name="pet"
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]
                focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
              >
                <option value="">Select pet</option>
                {pets.map((p: IPet) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.pet && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.pet.message}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-[#86654F]">Service</label>
              <select
                {...register("service")}
                name="service"
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]
                focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
              >
                <option value="">Select service</option>
                {services.map((s: IService) => (
                  <option key={s._id} value={s._id}>
                    {s.title ?? s.title}
                  </option>
                ))}
              </select>
              {errors.service && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.service.message}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-[#86654F]">Doctor</label>
              <select
                {...register("doctor")}
                name="doctor"
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]
                focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
              >
                <option value="">Any doctor</option>
                {doctors.map((d: IUser) => (
                  <option key={d._id} value={d._id}>
                    {" "}
                    {d.userName ?? "Unknown Doctor"}
                  </option>
                ))}
              </select>
              {errors.doctor && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.doctor.message}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-[#86654F]">Date</label>
              <input
                {...register("date")}
                type="date"
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]
               focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
              />
              {errors.date && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.date.message}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-[#86654F]">
              Time Slot (optional)
            </label>
            <select
              {...register("timeSlot")}
              name="timeSlot"
              className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] 
              focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
            >
              <option value="">Select a time</option>
              {timeslotOptions.map((t: string) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.timeSlot && (
              <div className="text-red-500 text-xs mt-1">
                {errors.timeSlot.message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#86654F]">Status</label>
              <select
                {...register("status")}
                name="status"
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] 
                focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
              >
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[#86654F]">Payment</label>
              <select
                {...register("paymentStatus")}
                name="paymentStatus"
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]
                focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
              >
                <option value="unpaid">unpaid</option>
                <option value="paid">paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#86654F]">Notes</label>
            <textarea
              {...register("notes")}
              name="notes"
              rows={3}
              className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2]
              focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none text-[#86654F]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#F3EEE8] text-[#4A3F35] hover:bg-[#EAE2DA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-3 rounded-xl bg-[#86654F] text-white hover:bg-[#6d5240]"
            >
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
