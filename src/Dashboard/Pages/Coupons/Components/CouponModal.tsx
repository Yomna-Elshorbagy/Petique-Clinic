import React from "react";
import { FaTimes, FaPlusCircle, FaEdit } from "react-icons/fa";
import CouponForm from "./CouponForm";
import type { ICoupon, ICouponCreate } from "../../../../Interfaces/ICoupon";

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
  coupon?: ICoupon | null;
  onSubmit: (data: ICouponCreate) => void;
  loading?: boolean;
}

const CouponModal: React.FC<CouponModalProps> = ({
  open,
  onClose,
  coupon,
  onSubmit,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="
          relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
          bg-[var(--color-light-background)] 
          border border-[var(--color-light-secondary)]/40
          rounded-2xl shadow-xl animate-fadeIn
        "
      >
        {/* Header */}
        <div
          className="
            flex justify-between items-center px-6 py-4
            bg-[var(--color-light-primary)] text-[var(--color-light-dark)]
            rounded-t-2xl border-b border-[var(--color-light-secondary)]/40
          "
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {coupon ? <FaEdit /> : <FaPlusCircle />}
            {coupon ? "Edit Coupon" : "Add New Coupon"}
          </h2>
          <button
            onClick={onClose}
            className="hover:text-[var(--color-light-accent)] transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 text-[var(--color-light-dark)]">
          <CouponForm
            coupon={coupon}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CouponModal;

