import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ReservationView {
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
  createdAt?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationView | null;
}

export default function ViewReservationModal({ isOpen, onClose, reservation }: Props) {
  if (!isOpen || !reservation) return null;

  const dateStr = reservation.date ? new Date(reservation.date).toLocaleDateString() : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="w-full max-w-2xl bg-[#FCF9F4] rounded-2xl shadow-xl border border-[#ECE7E2] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#ECE7E2]">
          <h3 className="text-xl font-semibold text-[#4A3F35]">Reservation Details</h3>
          <button onClick={onClose} className="text-[#A98770] hover:text-[#86654F]">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-[#ECE7E2] flex items-center justify-center text-[#A27A55] font-semibold text-lg">
              {reservation.pet?.name?.[0] ?? "P"}
            </div>
            <div>
              <div className="text-lg font-semibold text-[#4A3F35]">{reservation.pet?.name ?? "—"}</div>
              <div className="text-sm text-[#8C827A]">{ reservation.petOwner?.userName ?? "—"}</div>
            </div>
            <div className="ml-auto text-sm text-[#8C827A]">{reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : ""}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#ECE7E2]">
              <div className="text-xs text-[#8C827A]">Service</div>
              <div className="font-medium text-[#4A3F35]">{reservation.service?.title ?? "—"}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#ECE7E2]">
              <div className="text-xs text-[#8C827A]">Doctor</div>
              <div className="font-medium text-[#4A3F35]">{reservation.doctor?.userName ?? "—"}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#ECE7E2]">
              <div className="text-xs text-[#8C827A]">Date</div>
              <div className="font-medium text-[#4A3F35]">{dateStr}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#ECE7E2]">
              <div className="text-xs text-[#8C827A]">Time</div>
              <div className="font-medium text-[#4A3F35]">{reservation.timeSlot ?? "—"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white border border-[#ECE7E2]">
              <div className="text-xs text-[#8C827A]">Status</div>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border
                  ${reservation.status === "completed" ? "text-green-600 border-green-200" : ""}
                  ${reservation.status === "pending" ? "text-orange-500 border-orange-200" : ""}
                  ${reservation.status === "cancelled" ? "text-red-500 border-red-200" : ""}
                  ${reservation.status === "confirmed" ? "text-blue-600 border-blue-200" : ""}
                `}>
                  {reservation.status ?? "—"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#ECE7E2]">
              <div className="text-xs text-[#8C827A]">Payment</div>
              <div className="mt-2 font-medium text-[#4A3F35]">{reservation.paymentStatus ?? "unpaid"}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#ECE7E2]">
              <div className="text-xs text-[#8C827A]">Notes</div>
              <div className="mt-2 text-sm text-[#6F665F]">{reservation.notes ?? "—"}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-[#F3EEE8] text-[#4A3F35] hover:bg-[#EAE2DA]">Close</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
