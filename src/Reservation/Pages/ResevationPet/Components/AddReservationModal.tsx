import { motion } from "framer-motion";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { useAllDoctors } from "../../../../Hooks/Doctor/useDoctor";
import { useServices } from "../../../../Hooks/Services/UseServices";
import { useAvailableSlots } from "../../../../Hooks/Reservation/useReservation";
import type { IUser } from "../../../../Interfaces/IUser";
import type { IService } from "../../../../Interfaces/IService";
import type { IPet } from "../../../../Interfaces/Ipet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddReservation } from "../../../../Hooks/Reservation/useReservationMutations";
import { useMemo } from "react";
import { useUserPets } from "../../../../Hooks/UserProfile/useUserPets";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL } from "../../../../Apis/BaseUrl";

interface ReservationAdd {
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
  onAdded?: (res: ReservationAdd) => void;
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
    .refine((val) => val !== "", { message: "Please select a date." })
    .refine((val) => val > new Date().toISOString().split("T")[0], {
      message: "Select a day in the future",
    }),

  timeSlot: z.string().optional(),
  status: z
    .enum(["pending", "confirmed", "completed", "cancelled"])
    .default("pending"),
  paymentStatus: z.enum(["unpaid", "paid"]).default("unpaid"),
  notes: z.string().optional(),
});

export default function AddReservationModal({
  isOpen,
  onClose,
  onAdded,
}: Props) {
  const { data: petsData } = useUserPets();
  const { data: doctorsData } = useAllDoctors();
  const { data: servicesData } = useServices();

  const pets = petsData ?? [];
  const doctors = doctorsData ?? [];
  const services = servicesData?.data ?? [];
  const token = localStorage.getItem("accessToken");

  const addMutation = useAddReservation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReservationAdd>({
    resolver: zodResolver(reservationSchema) as any,
    defaultValues: {
      pet: "",
      doctor: "",
      service: "",
      date: "",
      timeSlot: "",
      status: "pending",
      paymentStatus: "unpaid",
      notes: "",
    },
  });

  const { data: allReservations = [], refetch } = useQuery<ReservationAdd[]>({
    queryKey: ["allReservations"],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/reserve`, {
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

  const onSubmit = (data: ReservationAdd) => {
    addMutation.mutate(data, {
      onSuccess: (res) => {
        reset();
        Swal.fire("Added!", "Reservation added successfully", "success");
        onAdded?.(res);
        onClose();
        refetch();
      },
      onError() {
        Swal.fire("Error", "Failed to creat reservation", "error");
      },
    });
  };

  const timeslotOptions = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return [];

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
          rDate === selectedDate && rDoctorId === selectedDoctor && r.timeSlot
        );
      })
      .map((r) => r.timeSlot!)
      .filter(Boolean);

    const filtered = availableSlotsRaw.filter(
      (slot) => !!slot && !bookedTimes.includes(slot)
    );

    return filtered.sort();
  }, [availableSlotsRaw, allReservations, selectedDoctor, selectedDate]);

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
            Add Reservation
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
              <option value="">Keep current time</option>
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
              disabled={addMutation.isPending}
              className="px-6 py-3 rounded-xl bg-[#86654F] text-white hover:bg-[#6d5240]"
            >
              {addMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
