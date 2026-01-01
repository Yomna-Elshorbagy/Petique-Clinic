import { useState } from "react";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useTranslation } from "react-i18next";
import { FaBoxOpen } from "react-icons/fa";
import { useUserOrders } from "../../Hooks/Orders/useOrderTracking";
import SEO from "../SEO/SEO";
import SharedPagination from "./components/SharedPagination";
import type { Order } from "../../Types/OrderType";

export default function Orders() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;
  const { t } = useTranslation();

  const { data, isLoading, isError } = useUserOrders();

  if (isLoading) return <LoaderPage />;

  if (isError)
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        {t("userProfile.orders.error")}
      </div>
    );

  const orders = data?.data || [];

  if (!orders.length)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        <FaBoxOpen size={40} className="mx-auto mb-3 opacity-60" />
        <p>{t("userProfile.orders.empty")}</p>
      </div>
    );

  // 🔹 Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusColors: Record<string, string> = {
    placed: "from-cyan-400 to-cyan-600",
    shipped: "from-yellow-400 to-yellow-600",
    delivered: "from-green-400 to-green-600",
  };

  return (
    <div className="space-y-10">
      <SEO
        title="Orders History | Pet Clinic"
        description="Manage your personal info, pets, and appointments."
      />

      <h2 className="text-3xl font-bold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] mb-6">
        {t("userProfile.orders.title")}
      </h2>

      {/* Orders */}
      {paginatedOrders.map((order: Order) => (
        <div
          key={order._id}
          className="p-6 rounded-2xl bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-card)] backdrop-blur-lg shadow-lg border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              {t("userProfile.orders.idPrefix")}{order._id}
            </h3>
            <span
              className={`text-white px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${statusColors[order.status.toLowerCase()] || "from-gray-400 to-gray-600"
                }`}
            >
              {t(`userProfile.tracking.steps.${order.status.toLowerCase()}`) || order.status.toUpperCase()}
            </span>
          </div>

          {/* Order Details */}
          <div className="relative border-l-4 border-[#e9a66f] dark:border-[var(--color-dark-accent)] pl-5 mb-6">
            <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              <span className="font-semibold">{t("userProfile.orders.address")}:</span> {order.address}
            </p>
            <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              <span className="font-semibold">{t("userProfile.orders.phone")}:</span> {order.phone}
            </p>
            <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              <span className="font-semibold">{t("userProfile.orders.payment")}:</span> {order.payment}
            </p>
            <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              <span className="font-semibold">{t("userProfile.orders.placedOn")}:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <span className="absolute -left-2 top-0 w-4 h-4 bg-[#e9a66f] dark:bg-[var(--color-dark-accent)] rounded-full"></span>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              {t("userProfile.orders.products")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.products.map((p: any) => (
                <div
                  key={p._id}
                  className="p-4 rounded-xl border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-background)] shadow text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                >
                  {p.productId?.imageCover?.secure_url && (
                    <img
                      src={p.productId.imageCover.secure_url}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <p className="font-semibold">{p.title}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-muted)]">
                      {t("userProfile.orders.qty")}: {p.quantity}
                    </span>
                    <span className="font-bold text-[var(--color-light-accent)]">
                      {t("userProfile.orders.price")}: {p.finalPrice.toLocaleString()} {t("userProfile.common.currency")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              {t("userProfile.orders.total")}:{" "}
              <span className="text-[#e9a66f] dark:text-[var(--color-dark-accent)]">
                {order.finalPrice.toLocaleString()} {t("userProfile.common.currency")}
              </span>
            </p>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <SharedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
