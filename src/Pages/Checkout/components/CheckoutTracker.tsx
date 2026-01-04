import React from "react";
import { FaPaw, FaCalendarAlt, FaCreditCard } from "react-icons/fa";

const steps = [
  { id: 1, name: "Pet & Contact", icon: FaPaw, status: "current" },
  { id: 2, name: "Appointment", icon: FaCalendarAlt, status: "upcoming" },
  { id: 3, name: "Payment", icon: FaCreditCard, status: "upcoming" },
];

const CheckoutTracker = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center">
        {steps.map((step, stepIdx) => (
          <React.Fragment key={step.id}>
            <div className="relative flex flex-col items-center group">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10
                ${
                  step.status === "current"
                    ? "bg-[var(--color-light-accent)] text-white shadow-lg scale-110"
                    : step.status === "complete"
                    ? "bg-[var(--color-light-primary)] text-[var(--color-light-dark)]"
                    : "bg-white dark:bg-[var(--color-dark-card)] border-2 border-gray-200 dark:border-gray-700 text-gray-400"
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <span
                className={`mt-3 text-sm font-medium transition-colors duration-300
                ${
                  step.status === "current"
                    ? "text-[var(--color-light-accent)]"
                    : "text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]"
                }`}
              >
                {step.name}
              </span>
            </div>
            {stepIdx !== steps.length - 1 && (
              <div className="w-24 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4 -mt-6"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutTracker;
