import React, { useEffect, useState } from "react";
import { FaTag, FaCalendarAlt, FaPercent, FaDollarSign } from "react-icons/fa";
import type { ICoupon, ICouponCreate } from "../../../../Interfaces/ICoupon";

interface CouponFormProps {
  coupon?: ICoupon | null;
  onSubmit: (data: ICouponCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({
  coupon,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ICouponCreate>({
    code: "",
    type: "fixedAmount",
    fromDate: "",
    expire: "",
    discount: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        type: coupon.type,
        fromDate: coupon.fromDate.split("T")[0],
        expire: coupon.expire.split("T")[0],
        discount: coupon.discount,
      });
    }
  }, [coupon]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }

    if (!formData.fromDate) {
      newErrors.fromDate = "Start date is required";
    }

    if (!formData.expire) {
      newErrors.expire = "Expiry date is required";
    }

    if (formData.fromDate && formData.expire) {
      const fromDate = new Date(formData.fromDate);
      const expireDate = new Date(formData.expire);
      if (expireDate <= fromDate) {
        newErrors.expire = "Expiry date must be after start date";
      }
    }

    if (formData.discount <= 0) {
      newErrors.discount = "Discount must be greater than 0";
    }

    if (formData.type === "percentage" && formData.discount > 100) {
      newErrors.discount = "Percentage discount cannot exceed 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        fromDate: new Date(formData.fromDate).toISOString(),
        expire: new Date(formData.expire).toISOString(),
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "discount" ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Code */}
      <div>
        <label className="block font-medium mb-1 flex items-center gap-2">
          <FaTag /> Coupon Code
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className={`w-full border ${
            errors.code
              ? "border-red-500"
              : "border-[var(--color-light-secondary)]/40"
          } p-2 rounded-xl bg-[var(--color-extra-5)] focus:ring-2 focus:ring-[var(--color-light-accent)] outline-none transition`}
          placeholder="e.g., DISCOUNT25"
        />
        {errors.code && (
          <p className="text-red-500 text-sm mt-1">{errors.code}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="block font-medium mb-1">Discount Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border border-[var(--color-light-secondary)]/40 p-2 rounded-xl bg-[var(--color-extra-5)] focus:ring-2 focus:ring-[var(--color-light-accent)] outline-none transition"
        >
          <option value="fixedAmount">Fixed Amount</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>

      {/* Discount */}
      <div>
        <label className="block font-medium mb-1 flex items-center gap-2">
          {formData.type === "percentage" ? <FaPercent /> : <FaDollarSign />}
          Discount {formData.type === "percentage" ? "(%)" : "(Amount)"}
        </label>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          min="0"
          max={formData.type === "percentage" ? "100" : undefined}
          className={`w-full border ${
            errors.discount
              ? "border-red-500"
              : "border-[var(--color-light-secondary)]/40"
          } p-2 rounded-xl bg-[var(--color-extra-5)] focus:ring-2 focus:ring-[var(--color-light-accent)] outline-none transition`}
          placeholder="Enter discount value"
        />
        {errors.discount && (
          <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <FaCalendarAlt /> Start Date
          </label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className={`w-full border ${
              errors.fromDate
                ? "border-red-500"
                : "border-[var(--color-light-secondary)]/40"
            } p-2 rounded-xl bg-[var(--color-extra-5)] focus:ring-2 focus:ring-[var(--color-light-accent)] outline-none transition`}
          />
          {errors.fromDate && (
            <p className="text-red-500 text-sm mt-1">{errors.fromDate}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <FaCalendarAlt /> Expiry Date
          </label>
          <input
            type="date"
            name="expire"
            value={formData.expire}
            onChange={handleChange}
            min={formData.fromDate}
            className={`w-full border ${
              errors.expire
                ? "border-red-500"
                : "border-[var(--color-light-secondary)]/40"
            } p-2 rounded-xl bg-[var(--color-extra-5)] focus:ring-2 focus:ring-[var(--color-light-accent)] outline-none transition`}
          />
          {errors.expire && (
            <p className="text-red-500 text-sm mt-1">{errors.expire}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-light-secondary)]/40">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-[var(--color-extra-3)] hover:bg-[var(--color-extra-2)] transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-[var(--color-light-accent)] text-white hover:bg-[var(--color-light-secondary)] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
        </button>
      </div>
    </form>
  );
};

export default CouponForm;
