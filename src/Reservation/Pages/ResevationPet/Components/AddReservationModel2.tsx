import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IUser } from "../../../../Interfaces/IUser";
import type { IService } from "../../../../Interfaces/IService";
import type { ReservationAddAdmin } from "../../../../Hooks/Reservation/useReservationMutations";
import { addReservationAdmin } from "../../../../Apis/ReservationApis";
import { baseURL } from "../../../../Apis/BaseUrl";

// Custom hooks
import { useAllPets } from "../../../../Hooks/Pets/UsePets";
import { useAvailableSlots } from "../../../../Hooks/Reservation/useReservation";
import { useAllDoctors } from "../../../../Hooks/Doctor/useDoctor";
import { useServices } from "../../../../Hooks/Services/UseServices";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (res: ReservationAddAdmin) => void;
}

const reservationSchema = z.object({
  userId: z.string().refine((val) => val !== "", { message: "Select a user" }),
  pet: z.string().refine((val) => val !== "", { message: "Select a pet" }),
  service: z
    .string()
    .refine((val) => val !== "", { message: "Select a service" }),
  doctor: z.string().optional(),
  date: z.string().refine((val) => val !== "", { message: "Select a date" }),
  timeSlot: z.string().optional(),
  status: z
    .enum(["pending", "confirmed", "completed", "cancelled"])
    .default("pending"),
  paymentStatus: z.enum(["unpaid", "paid"]).default("unpaid"),
  notes: z.string().optional(),
});

export default function AddReservationModal2({
  isOpen,
  onClose,
  onAdded,
}: Props) {
  const token = localStorage.getItem("accessToken");
  const queryClient = useQueryClient();

  // ===> selected user for admin to assign reservation
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // ===> 1. fetch all users
  const { data: allUsers } = useQuery<IUser[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/user/allUsers`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });

  //===> 2. Fetch ALL Pets
  const { data: allPets } = useAllPets();

  // ====>filter available pets based on selected user
  const userPets = useMemo(() => {
    if (!selectedUserId || !allPets) return [];
    return allPets.filter((pet: any) => {
      const ownerId =
        typeof pet.petOwner === "object" ? pet.petOwner._id : pet.petOwner;
      return ownerId === selectedUserId;
    });
  }, [allPets, selectedUserId]);

  // 3. Fetch Doctors
  const { data: doctorsData } = useAllDoctors();

  // 4. Fetch Services
  const { data: servicesDataResponse } = useServices(1, 100);
  const servicesData: IService[] = servicesDataResponse?.data || [];

  const addMutation = useMutation({
    mutationFn: addReservationAdmin,
    onSuccess: (data) => {
      Swal.fire("Added!", "Reservation added successfully", "success");
      onAdded?.(data);
      queryClient.invalidateQueries({ queryKey: ["allReservations"] });
      reset();
      onClose();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "Failed to create reservation";
      Swal.fire("Error", msg, "error");
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ReservationAddAdmin>({
    resolver: zodResolver(reservationSchema) as any,
    defaultValues: {
      userId: "",
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

  const selectedDoctor = watch("doctor");
  const selectedDate = watch("date");
  const watchedUserId = watch("userId");

  // ===> sync state for pets query
  if (watchedUserId && watchedUserId !== selectedUserId) {
    setSelectedUserId(watchedUserId);
  }

  // ===> 5. Available Slots
  const { data: availableSlotsData } = useAvailableSlots(
    selectedDoctor || "",
    selectedDate || ""
  );

  const timeslotOptions = useMemo(() => {
    if (!selectedDate) return [];

    const allSlots = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ];

    if (selectedDoctor) {
      if (availableSlotsData) {
        // ==> Note here robustness check for structure
        const slotsFromApi =
          availableSlotsData?.availableSlots || availableSlotsData || [];
        if (Array.isArray(slotsFromApi)) return slotsFromApi;
      }
      return [];
    }

    return allSlots;
  }, [selectedDoctor, selectedDate, availableSlotsData]);

  const onSubmit = (data: ReservationAddAdmin) => {
    addMutation.mutate(data);
  };

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
            Add Reservation (Admin)
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
          {/* User select */}
          <div>
            <label className="text-sm text-[#86654F]">User</label>
            <select
              {...register("userId")}
              className="w-full mt-2 px-4 py-2 rounded-xl border border-[#ECE7E2]  focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none"
            >
              <option value="">Select user</option>
              {allUsers?.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.userName} ({u.email})
                </option>
              ))}
            </select>
            {errors.userId && (
              <div className="text-red-500 text-xs">
                {errors.userId.message}
              </div>
            )}
          </div>

          {/* Pet select */}
          <div>
            <label className="text-sm text-[#86654F]">Pet</label>
            <select
              {...register("pet")}
              className="w-full mt-2 px-4 py-2 rounded-xl border border-[#ECE7E2]  focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none"
            >
              <option value="">Select pet</option>
              {userPets?.map((p: any) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.pet && (
              <div className="text-red-500 text-xs">{errors.pet.message}</div>
            )}
          </div>

          {/* Service select */}
          <div>
            <label className="text-sm text-[#86654F]">Service</label>
            <select
              {...register("service")}
              className="w-full mt-2 px-4 py-2 rounded-xl border border-[#ECE7E2]  focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none"
            >
              <option value="">Select service</option>
              {servicesData?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>
            {errors.service && (
              <div className="text-red-500 text-xs">
                {errors.service.message}
              </div>
            )}
          </div>

          {/* Doctor select */}
          <div>
            <label className="text-sm text-[#86654F]">Doctor (Optional)</label>
            <select
              {...register("doctor")}
              className="w-full mt-2 px-4 py-2 rounded-xl border border-[#ECE7E2]  focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none"
            >
              <option value="">Any doctor</option>
              {doctorsData?.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.userName}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-[#86654F]">Date</label>
            <input
              {...register("date")}
              type="date"
              className="w-full mt-2 px-4 py-2 rounded-xl border border-[#ECE7E2]  focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none"
            />
            {errors.date && (
              <div className="text-red-500 text-xs">{errors.date.message}</div>
            )}
          </div>

          {/* Time slot */}
          <div>
            <label className="text-sm text-[#86654F]">Time Slot</label>
            <select
              {...register("timeSlot")}
              className="w-full mt-2 px-4 py-2 rounded-xl border border-[#ECE7E2]  focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none"
            >
              <option value="">Select time</option>
              {timeslotOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.timeSlot && (
              <div className="text-red-500 text-xs">
                {errors.timeSlot.message}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-[#86654F]">Notes</label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full mt-2 px-4 py-2 rounded-xl border border-[#ECE7E2]  focus:ring-2 focus:ring-[#A98770] focus:border-transparent outline-none"
            />
          </div>

          {/* Buttons */}
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
