import { useState } from "react";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import type { Order } from "../../Types/OrderType";
import { useUserOrders } from "../../Hooks/Orders/useOrderTracking";
import SEO from "../SEO/SEO";
import SharedPagination from "./components/SharedPagination";

export default function UserOrders() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;

  const { data, isLoading, isError } = useUserOrders();

  if (isLoading) return <LoaderPage />;

  if (isError)
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        Failed to load orders.
      </div>
    );

  if (!data?.data || data.data.length === 0)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          You have no orders yet.
        </p>
      </div>
    );

  const orders = data.data;

  // 🔹 Pagination logic (same pattern as reservations)
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
        Your Orders
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
              Order #{order._id}
            </h3>
            <span
              className={`text-white px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
                statusColors[order.status] || "from-gray-400 to-gray-600"
              }`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          {/* Order Details */}
          <div className="relative border-l-4 border-[#e9a66f] dark:border-[var(--color-dark-accent)] pl-5 mb-6">
            <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              <span className="font-semibold">Address:</span> {order.address}
            </p>
            <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              <span className="font-semibold">Phone:</span> {order.phone}
            </p>
            <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              <span className="font-semibold">Payment:</span> {order.payment}
            </p>
            <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              <span className="font-semibold">Placed On:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <span className="absolute -left-2 top-0 w-4 h-4 bg-[#e9a66f] dark:bg-[var(--color-dark-accent)] rounded-full"></span>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              Products
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.products.map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-xl border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-background)] shadow text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]"
                >
                  {p.productId.imageCover?.secure_url && (
                    <img
                      src={p.productId.imageCover.secure_url}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm">Qty: {p.quantity}</p>
                  <p className="text-sm">
                    Price:{" "}
                    <span className="font-semibold">
                      {p.finalPrice.toLocaleString()} EGP
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              Total:{" "}
              <span className="text-[#e9a66f] dark:text-[var(--color-dark-accent)]">
                {order.finalPrice.toLocaleString()} EGP
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
