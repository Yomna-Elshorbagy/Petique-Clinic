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
import { useTranslation } from "react-i18next";

export const orderStatus = {
  PLACED: "placed",
  PENDING: "pending",
  SHIPPING: "shipping",
  COMPLETED: "completed",
  CANCELED: "canceled",
  REFUNDED: "refund",
};

const PetOrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [searchId, setSearchId] = useState("");
  const { t } = useTranslation();
  const { data: order, isLoading, isError } = useOrderTracking(searchId);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderId.trim()) setSearchId(orderId.trim());
  };

  const normalizedStatus = order
    ? order.status === orderStatus.PENDING
      ? orderStatus.PLACED
      : order.status.toLowerCase()
    : "";

  // ===== Timeline Steps 🐾 =====
  const steps = [
    {
      key: orderStatus.PLACED,
      label: t("userProfile.tracking.steps.placed"),
      icon: <FaPaw />,
    },
    {
      key: orderStatus.SHIPPING,
      label: t("userProfile.tracking.steps.shipping"),
      icon: <FaTruck />,
    },
    {
      key: orderStatus.COMPLETED,
      label: t("userProfile.tracking.steps.completed"),
      icon: <FaCheckCircle />,
    },
    {
      key: orderStatus.CANCELED,
      label: t("userProfile.tracking.steps.canceled"),
      icon: <FaTimesCircle />,
    },
    {
      key: orderStatus.REFUNDED,
      label: t("userProfile.tracking.steps.refund"),
      icon: <FaUndo />,
    },
  ];

  const stepIndex = order
    ? steps.findIndex((s) => s.key === normalizedStatus)
    : -1;

  const getColor = (index: number) => {
    if (!order) return "bg-gray-300 dark:bg-gray-600";

    if (normalizedStatus === orderStatus.CANCELED)
      return "bg-red-500 dark:bg-red-600";

    if (normalizedStatus === orderStatus.REFUNDED)
      return "bg-yellow-500 dark:bg-yellow-600";

    return index <= stepIndex
      ? "bg-[#8B5E35] dark:bg-[var(--color-dark-accent)]"
      : "bg-gray-300 dark:bg-gray-600";
  };
  const progressWidth = (() => {
    if (!order) return 0;

    if (
      normalizedStatus === orderStatus.CANCELED ||
      normalizedStatus === orderStatus.REFUNDED
    ) {
      return 100;
    }

    return stepIndex >= 0 ? ((stepIndex + 1) / steps.length) * 100 : 0;
  })();

  return (
    <>
      <SEO
        title={t("userProfile.tracking.title")}
        description={t("userProfile.seo.description")}
      />
      <div className="max-w-4xl mx-auto mt-12 p-8 rounded-3xl bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] shadow-xl border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-[#8a6038] dark:text-[var(--color-dark-text)] mb-8 flex items-center justify-center gap-3">
          <FaDog className="text-[#e9a66f] dark:text-[var(--color-dark-accent)]" />{" "}
          {t("userProfile.tracking.title")}
        </h2>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <input
            type="text"
            placeholder={t("userProfile.tracking.searchPlaceholder")}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border border-[var(--color-border-medium)] dark:border-[var(--color-dark-border-light)] rounded-xl px-4 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] focus:ring-2 focus:ring-[#b57c48] dark:focus:ring-[var(--color-dark-accent)] transition text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="bg-[#D69560] dark:bg-[var(--color-dark-accent)] text-white px-6 py-2 rounded-xl hover:bg-[#c58a5a] dark:hover:bg-[var(--color-dark-accent)]/80 transition shadow-md font-bold"
          >
            {t("userProfile.common.search")}
          </button>
        </form>

        {isLoading && <LoaderPage />}
        {isError && (
          <p className="text-center text-red-500 dark:text-red-400 text-lg font-semibold">
            {t("userProfile.tracking.error")}
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
                      className={`mt-3 text-sm font-semibold text-center ${
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
                {t("userProfile.orders.idPrefix")}
                {order._id.slice(-6).toUpperCase()}
              </h3>

              <div className="space-y-3 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                <p className="flex items-center gap-2">
                  <span className="font-bold text-[#8B5E35] dark:text-[var(--color-dark-accent)]">
                    {t("userProfile.orders.status")}:
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#8B5E35]/10 text-[#8B5E35] dark:bg-[var(--color-dark-accent)]/20 dark:text-[var(--color-dark-accent)]">
                    {t(
                      `userProfile.tracking.steps.${order.status.toLowerCase()}`
                    ) || order.status.toUpperCase()}
                  </span>
                </p>

                <p>
                  <span className="font-bold text-[#8B5E35] dark:text-[var(--color-dark-accent)] mr-2">
                    {t("userProfile.orders.placedOn")}:
                  </span>
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <p>
                  <span className="font-bold text-[#8B5E35] dark:text-[var(--color-dark-accent)] mr-2">
                    {t("userProfile.orders.address")}:
                  </span>
                  {order.address}
                </p>

                <p>
                  <span className="font-bold text-[#8B5E35] dark:text-[var(--color-dark-accent)] mr-2">
                    {t("userProfile.orders.phone")}:
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
