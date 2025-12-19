import React, { useState, type FormEvent } from "react";
import {
  FaDog,
  FaPaw,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaUndo,
} from "react-icons/fa";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useOrderTracking } from "../../Hooks/Orders/useOrderTracking";
import SEO from "../SEO/SEO";

export const orderStatus = {
  PLACED: "placed",
  SHIPPING: "shipping",
  COMPLETED: "completed",
  CANCELED: "canceled",
  REFUNDED: "refund",
};

const PetOrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [searchId, setSearchId] = useState("");
  const { data: order, isLoading, isError } = useOrderTracking(searchId);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderId.trim()) setSearchId(orderId.trim());
  };

  // ===== Timeline Steps 🐾 =====
  const steps = [
    { key: orderStatus.PLACED, label: "Order Placed", icon: <FaPaw /> },
    { key: orderStatus.SHIPPING, label: "On The Way", icon: <FaTruck /> },
    { key: orderStatus.COMPLETED, label: "Delivered", icon: <FaCheckCircle /> },
    { key: orderStatus.CANCELED, label: "Canceled", icon: <FaTimesCircle /> },
    { key: orderStatus.REFUNDED, label: "Refunded", icon: <FaUndo /> },
  ];

  const stepIndex = order
    ? steps.findIndex((s) => s.key === order.status.toLowerCase())
    : -1;

  const getColor = (index: number) => {
    if (!order) return "bg-gray-300 dark:bg-gray-600";
    const status = order.status;

    if (status === orderStatus.CANCELED) return "bg-red-500 dark:bg-red-600";
    if (status === orderStatus.REFUNDED)
      return "bg-yellow-500 dark:bg-yellow-600";

    return index <= stepIndex
      ? "bg-[#8B5E35] dark:bg-[var(--color-dark-accent)]"
      : "bg-gray-300 dark:bg-gray-600";
  };

  const progressWidth =
    stepIndex >= 0 ? ((stepIndex + 1) / steps.length) * 100 : 0;

  return (
    <>
      <SEO
        title="Order History | Pet Clinic"
        description="Manage your personal info, pets, and appointments."
      />
      <div className="max-w-4xl mx-auto mt-12 p-8 rounded-3xl bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] shadow-xl border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-[#8B5E35] dark:text-[var(--color-dark-text)] mb-8 flex items-center justify-center gap-3">
          <FaDog className="text-[#e9a66f] dark:text-[var(--color-dark-accent)]" />{" "}
          Track Your Order
        </h2>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Enter Order ID (e.g., A12X45)…"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border border-[var(--color-border-medium)] dark:border-[var(--color-dark-border-light)] rounded-xl px-4 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] focus:ring-2 focus:ring-[#8B5E35] dark:focus:ring-[var(--color-dark-accent)] transition text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="bg-[#8B5E35] dark:bg-[var(--color-dark-accent)] text-white px-6 py-2 rounded-xl hover:bg-[#734E2F] dark:hover:bg-[var(--color-dark-accent)]/80 transition shadow-md"
          >
            Search
          </button>
        </form>

        {isLoading && <LoaderPage />}
        {isError && (
          <p className="text-center text-red-500 dark:text-red-400 text-lg font-semibold">
            Order not found. Please check your ID.
          </p>
        )}

        {order && (
          <>
            {/* Timeline */}
            <div className="relative mb-14 mt-6">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 dark:bg-gray-600 -z-10" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#8B5E35] dark:bg-[var(--color-dark-accent)] transition-all duration-500 -z-10"
                style={{ width: `${progressWidth}%` }}
              />

              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    className="flex flex-col items-center w-1/5"
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ${getColor(
                        index
                      )}`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`mt-3 text-sm font-semibold ${
                        index <= stepIndex
                          ? "text-[#8B5E35] dark:text-[var(--color-dark-accent)]"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Info Card */}
            <div className="bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-background)] backdrop-blur-lg shadow-lg rounded-2xl border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] p-6">
              <h3 className="text-xl font-bold text-[#8B5E35] dark:text-[var(--color-dark-accent)] mb-3">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>

              <div className="space-y-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                <p>
                  <span className="font-semibold text-[#8B5E35] dark:text-[var(--color-dark-accent)] mr-1">
                    Status:
                  </span>
                  {order.status.toUpperCase()}
                </p>

                <p>
                  <span className="font-semibold text-[#8B5E35] dark:text-[var(--color-dark-accent)] mr-1">
                    Placed On:
                  </span>
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <p>
                  <span className="font-semibold text-[#8B5E35] dark:text-[var(--color-dark-accent)] mr-1">
                    Address:
                  </span>
                  {order.address}
                </p>

                <p>
                  <span className="font-semibold text-[#8B5E35] dark:text-[var(--color-dark-accent)] mr-1">
                    Phone:
                  </span>
                  {order.phone}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PetOrderTracking;
