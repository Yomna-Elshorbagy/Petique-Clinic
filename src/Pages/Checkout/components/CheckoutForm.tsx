import React from "react";
import { motion } from "framer-motion";
import { FaPaw, FaHeart, FaCheckCircle } from "react-icons/fa";

const CheckoutForm = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent outline-none transition-all"
              placeholder="John"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent outline-none transition-all"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent outline-none transition-all"
              placeholder="john@example.com"
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
              type="tel"
              id="phone"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="petName"
            className="block text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2"
          >
            <span className="flex items-center gap-2">
              <FaHeart className="text-red-400" /> Pet's Name
            </span>
          </label>
          <input
            type="text"
            id="petName"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent outline-none transition-all"
            placeholder="What's your pet's name?"
          />
        </div>

        <div className="flex justify-end pt-6">
          <button
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
