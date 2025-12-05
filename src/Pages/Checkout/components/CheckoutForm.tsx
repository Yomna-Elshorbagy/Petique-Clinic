import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaw, FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../Store/store";
import { addOrder } from "../../../Store/Slices/OrderSlice";
import { useNavigate } from "react-router-dom";


export const useAppDispatch = () => useDispatch<AppDispatch>();


const CheckoutForm = () => {
 const dispatch = useAppDispatch();
  const Navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });
 const handleGoToDetails = async () => {
  const result = await dispatch(addOrder(formData));

  if (addOrder.rejected.match(result)) {
    console.error("Failed to add order:", result.payload);
    return;
  }
  
  Navigate("/OrderDetails", { state: { order: result.payload } }); 
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
            Full Name
          </label>
          <input
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            type="text"
            id="fullName"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
            >
              Address
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              type="text"
              id="address"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent outline-none transition-all"
              placeholder="123 Main St, City, Country"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
            >
              Phone Number
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              type="tel"
              id="phone"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent outline-none transition-all"
              placeholder="+20 1X XXX XXXX"
            />
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
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
