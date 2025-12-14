import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useUpdateReservation } from "../../../../Hooks/Reservation/useReservationMutations";
import toast from "react-hot-toast";
import { useAllPets } from "../../../../Hooks/Pets/UsePets";
import { useAllDoctors } from "../../../../Hooks/Doctor/useDoctor";
import { useServices } from "../../../../Hooks/Services/UseServices";
import { useAvailableSlots } from "../../../../Hooks/Reservation/useReservation";

interface ReservationEdit {
  _id: string;
  pet?: any;
  petOwner?: any;
  doctor?: any;
  service?: any;
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
  onUpdated?: (res: any) => void;
}

export default function EditReservationModal({
  isOpen,
  onClose,
  reservation,
  onUpdated,
}: Props) {
  const { data: petsData } = useAllPets();
  const { data: doctorsData } = useAllDoctors();
  const { data: servicesData } = useServices();

  // normalize data shapes (support array or { data: [] })
  const pets = useMemo(() => petsData?.data ?? petsData ?? [], [petsData]);
  const doctors = useMemo(() => doctorsData ?? [], [doctorsData]);
  const services = useMemo(
    () => servicesData?.data ?? servicesData ?? [],
    [servicesData]
  );

  const [form, setForm] = useState({
    pet: "",
    service: "",
    doctor: "",
    date: "",
    timeSlot: "",
    status: "pending",
    paymentStatus: "unpaid",
    notes: "",
  });

  const [fetchSlotsKey, setFetchSlotsKey] = useState<{
    doctor: string;
    date: string;
  } | null>(null);

  const { data: availableSlotsData } = useAvailableSlots(
    fetchSlotsKey?.doctor ?? "",
    fetchSlotsKey?.date ?? ""
  );

  const availableSlots = useMemo(
    () => availableSlotsData?.availableSlots ?? availableSlotsData ?? [],
    [availableSlotsData]
  );

  const updateMutation = useUpdateReservation();

  useEffect(() => {
    if (reservation) {
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

      setForm({
        pet: petId ?? "",
        service: serviceId ?? "",
        doctor: doctorId ?? "",
        date: reservation.date
          ? new Date(reservation.date).toISOString().split("T")[0]
          : "",
        timeSlot: reservation.timeSlot ?? "",
        status: reservation.status ?? "pending",
        paymentStatus: reservation.paymentStatus ?? "unpaid",
        notes: reservation.notes ?? "",
      });

      // set slot fetch when modal opens
      const dt = reservation.date
        ? new Date(reservation.date).toISOString().split("T")[0]
        : "";

      if (doctorId && dt) {
        setFetchSlotsKey({ doctor: doctorId, date: dt });
      }
    }
  }, [reservation]);

  useEffect(() => {
    if (form.doctor && form.date) {
      setFetchSlotsKey({ doctor: form.doctor, date: form.date });
    } else {
      setFetchSlotsKey(null);
    }
  }, [form.doctor, form.date]);

  if (!isOpen || !reservation) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // prepare payload
    const payload: any = {
      pet: form.pet,
      service: form.service,
      doctor: form.doctor || null,
      date: form.date,
      timeSlot: form.timeSlot,
      status: form.status,
      paymentStatus: form.paymentStatus,
      notes: form.notes,
    };

    updateMutation.mutate(
      { id: reservation._id, data: payload },
      {
        onSuccess(data) {
          toast.success("Reservation updated");
          onUpdated?.(data.data);
          onClose();
        },
        onError(err: any) {
          toast.error(err?.response?.data?.message || "Failed to update");
        },
      }
    );
  };

  let timeslotOptions = [...availableSlots];

  const currentDoctorId =
    typeof reservation.doctor === "object"
      ? reservation.doctor?._id
      : reservation.doctor;
  const currentDateStr = reservation.date
    ? new Date(reservation.date).toISOString().split("T")[0]
    : "";

  if (
    form.doctor === currentDoctorId &&
    form.date === currentDateStr &&
    reservation.timeSlot
  ) {
    if (!timeslotOptions.includes(reservation.timeSlot)) {
      timeslotOptions.push(reservation.timeSlot);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.form
        onSubmit={handleSubmit}
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
            {/* Pet */}
            <div>
              <label className="text-sm text-[#86654F]">Pet</label>
              <select
                name="pet"
                value={form.pet}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] outline-none text-[#4A3F35]"
              >
                <option value="">Select pet</option>
                {pets.map((p: any) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="text-sm text-[#86654F]">Service</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] outline-none text-[#4A3F35]"
              >
                <option value="">Select service</option>
                {services.map((s: any) => (
                  <option key={s._id} value={s._id}>
                    {s.name ?? s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="text-sm text-[#86654F]">
                Doctor (optional)
              </label>
              <select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] outline-none text-[#4A3F35]"
              >
                <option value="">Any doctor</option>
                {doctors.map((d: any) => (
                  <option key={d._id} value={d._id}>
                    {d.userName ?? d.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-sm text-[#86654F]">Date</label>
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="date"
                required
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] outline-none text-[#4A3F35]"
              />
            </div>
          </div>

          {/* Time slot */}
          <div>
            <label className="text-sm text-[#86654F]">Time Slot</label>
            <select
              name="timeSlot"
              value={form.timeSlot}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] outline-none text-[#4A3F35]"
            >
              <option value="">Select time</option>
              {timeslotOptions.map((t: string) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {availableSlots.length > 0 && (
              <div className="text-xs text-[#8C827A] mt-2">
                Showing available slots for selected doctor & date.
              </div>
            )}
            {availableSlots.length === 0 && form.doctor && form.date && (
              <div className="text-xs text-red-500 mt-2">
                No available slots for this date/doctor
              </div>
            )}
          </div>

          {/* status / payment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#86654F]">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] outline-none text-[#4A3F35]"
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
                name="paymentStatus"
                value={form.paymentStatus}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] outline-none text-[#4A3F35]"
              >
                <option value="unpaid">unpaid</option>
                <option value="paid">paid</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-[#86654F]">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#ECE7E2] outline-none text-[#4A3F35]"
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
