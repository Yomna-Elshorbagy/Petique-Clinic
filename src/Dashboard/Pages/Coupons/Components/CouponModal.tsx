import React from "react";
import { FaEye,FaTimes, FaPlusCircle, FaEdit } from "react-icons/fa";
import CouponForm from "./CouponForm";
import type { ICoupon, ICouponCreate } from "../../../../Interfaces/ICoupon";

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
  coupon?: ICoupon | null;
  onSubmit: (data: ICouponCreate) => void;
  loading?: boolean;
  viewMode?: boolean;
}



const CouponModal: React.FC<CouponModalProps> = ({
  open,
  onClose,
  coupon,
  onSubmit,
  loading = false,
  viewMode = false
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
            {viewMode ? <FaEye /> : coupon ? <FaEdit /> : <FaPlusCircle />}
            {viewMode
              ? "View Coupon"
              : coupon
              ? "Edit Coupon"
              : "Add New Coupon"}
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
          {viewMode ? (
            <CouponView coupon={coupon} />
          ) : (
            <CouponForm
              coupon={coupon}
              onSubmit={onSubmit}
              onCancel={onClose}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponModal;

const CouponView = ({ coupon }: { coupon?: ICoupon | null }) => {
  if (!coupon) return null;
  return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      {[
        {
          label: "Coupon Code",
          content: (
            <p className="text-lg font-semibold tracking-widest">
              {coupon.code}
            </p>
          ),
        },
        {
          label: "Type",
          content: (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                ${
                  coupon.type === "percentage"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
            >
              {coupon.type === "percentage" ? "Percentage" : "Fixed Amount"}
            </span>
          ),
        },
        {
          label: "Discount",
          content: (
            <p className="text-lg font-bold">
              {coupon.type === "percentage"
                ? `${coupon.discount}%`
                : `${coupon.discount} EGP`}
            </p>
          ),
        },
        {
          label: "Used Users",
          content: (
            <p className="text-lg font-bold">
              {coupon.assignedUser.length}
            </p>
          ),
        },
      ].map(({ label, content }, i) => (
        <div
          key={i}
          className="
            group p-4 rounded-xl
            bg-[var(--color-extra-5)]
            border border-[var(--color-light-secondary)]/30
            transition-all duration-300
            hover:-translate-y-1
            hover:border-[var(--color-primary)]/40
            hover:shadow-lg hover:shadow-black/10
          "
        >
          <p className="text-xs text-[var(--color-text-muted)] mb-1">
            {label}
          </p>
          <div className="group-hover:scale-[1.02] transition-transform">
            {content}
          </div>
        </div>
      ))}

      {/* Valid Period */}
      <div
        className="
          p-4 rounded-xl col-span-1 sm:col-span-2
          bg-[var(--color-extra-5)]
          border border-[var(--color-light-secondary)]/30
          transition-all duration-300
          hover:border-[var(--color-primary)]/40
          hover:shadow-lg
        "
      >
        <p className="text-xs text-[var(--color-text-muted)] mb-1">
          Valid Period
        </p>
        <p className="font-medium">
          {coupon.fromDate.split("T")[0]} → {coupon.expire.split("T")[0]}
        </p>
      </div>

      {/* Status */}
      <div
        className="
          p-4 rounded-xl
          bg-[var(--color-extra-5)]
          border border-[var(--color-light-secondary)]/30
          transition-all duration-300
          hover:shadow-lg
        "
      >
        <p className="text-xs text-[var(--color-text-muted)] mb-1">
          Status
        </p>

        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
            ${
              new Date(coupon.expire) < new Date()
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
        >
          <span
            className={`w-2 h-2 rounded-full
              ${
                new Date(coupon.expire) < new Date()
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
          />
          {new Date(coupon.expire) < new Date() ? "Expired" : "Active"}
        </span>
      </div>
    </div>


      );
    };

    const Detail = ({
      label,
      value,
    }: {
      label: string;
      value: React.ReactNode;
    }) => (
      <div className="flex justify-between border-b pb-2">
        <span className="font-medium">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
    );


