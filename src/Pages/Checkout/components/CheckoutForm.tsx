import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPaw, FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../Store/store";
import { addOrder } from "../../../Store/Slices/OrderSlice";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export const useAppDispatch = () => useDispatch<AppDispatch>();

// validation
const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters and spaces"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(
      /^(\+?20)?01[0125][0-9]{8}$/,
      "Please enter a valid Egyptian phone number (e.g., 01012345678)"
    ),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters"),
  note: z.string(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutForm = () => {
  const dispatch = useAppDispatch();
  const Navigate = useNavigate();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof CheckoutFormData, boolean>>
  >({});

  const validateField = (field: keyof CheckoutFormData, value: string) => {
    try {
      checkoutSchema.pick({ [field]: true }).parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  const handleBlur = (field: keyof CheckoutFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field] || "");
  };

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleGoToDetails = async () => {
    // Validate all fields
    try {
      checkoutSchema.parse(formData);

      const result = await dispatch(addOrder(formData));

      if (addOrder.rejected.match(result)) {
        console.error("Failed to add order:", result.payload);
        return;
      }

      Navigate("/OrderDetails", { state: { order: result.payload } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as keyof CheckoutFormData] = issue.message;
          }
        });
        setErrors(newErrors);
        setTouched({
          fullName: true,
          phone: true,
          address: true,
          note: true,
        });
      }
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-8 bg-white dark:bg-[var(--color-dark-card)] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] flex items-center justify-center text-[var(--color-light-accent)]">
          <FaPaw className="text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
            Pet & Contact Information
          </h2>
          <p className="text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
            Tell us about you and your furry friend
          </p>
        </div>
      </div>

      <form className="space-y-6">
        {/* FULL NAME — FULL WIDTH */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            value={formData.fullName}
            type="text"
            id="fullName"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.fullName && touched.fullName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 dark:border-gray-700 focus:ring-[var(--color-light-accent)]"
            } bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:border-transparent outline-none transition-all`}
            placeholder="John Doe"
          />
          {errors.fullName && touched.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handleChange("address", e.target.value)}
              onBlur={() => handleBlur("address")}
              value={formData.address}
              type="text"
              id="address"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.address && touched.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:ring-[var(--color-light-accent)]"
              } bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:border-transparent outline-none transition-all`}
              placeholder="123 Main St, City, Country"
            />
            {errors.address && touched.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              value={formData.phone}
              type="tel"
              id="phone"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.phone && touched.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:ring-[var(--color-light-accent)]"
              } bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:border-transparent outline-none transition-all`}
              placeholder="+20 1X XXX XXXX"
            />
            {errors.phone && touched.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* NOTE */}
        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
          >
            Note (Optional)
          </label>
          <textarea
            onChange={(e) => handleChange("note", e.target.value)}
            value={formData.note}
            id="note"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent outline-none transition-all resize-none"
            placeholder="Any special requests or information we should know..."
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleGoToDetails}
            type="button"
            className="px-8 py-3 bg-[var(--color-light-accent)] hover:bg-[#d69560] text-white font-semibold rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition-all transform hover:scale-105 flex items-center gap-2"
          >
            Continue <FaCheckCircle />
          </button>
        </div>
      </form>
    </motion.section>
  );
};

export default CheckoutForm;
