import { useState } from "react";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import type { Order } from "../../Types/OrderType";
import { useUserOrders } from "../../Hooks/Orders/useOrderTracking";
import SEO from "../SEO/SEO";

export default function UserOrders() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 2;

  const { data, isLoading, isError } = useUserOrders(
    currentPage,
    ordersPerPage
  );

  if (isLoading) return <LoaderPage />;

  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load orders.
      </div>
    );

  if (!data?.data || data.data.length === 0)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">You have no orders yet.</p>
      </div>
    );

  const { data: orders, totalPages } = data;

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
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Your Orders
      </h2>

      {orders.map((order: Order) => (
        <div
          key={order._id}
          className="
            p-6 rounded-2xl 
            bg-white/40 dark:bg-gray-800/40 
            backdrop-blur-lg shadow-lg border 
            border-gray-200 dark:border-gray-700
          "
        >
          {/* ===> header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Order #{order._id}
            </h3>
            <span
              className={`
                text-white px-4 py-1 rounded-full text-sm font-medium 
                bg-gradient-to-r ${
                  statusColors[order.status] || "from-gray-400 to-gray-600"
                }
                shadow-md
              `}
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          {/* ===> Order Details */}
          <div className="relative border-l-4 border-primary pl-5 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Address:</span> {order.address}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Phone:</span> {order.phone}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Payment:</span> {order.payment}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Placed On:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <span className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></span>
          </div>

          {/* ===> products */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Products
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.products.map((p) => (
                <div
                  key={p._id}
                  className="
                    p-4 rounded-xl 
                    border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-900 shadow
                  "
                >
                  {p.productId.imageCover?.secure_url && (
                    <img
                      src={p.productId.imageCover.secure_url}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {p.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Qty: {p.quantity}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Price:{" "}
                    <span className="font-semibold">
                      {p.finalPrice.toLocaleString()} EGP
                    </span>
                  </p>
                  {p.discount > 0 && (
                    <p className="text-xs font-medium text-primary">
                      Discount: {p.discount}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ===> total */}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold text-gray-700 dark:text-gray-200">
              Total:{" "}
              <span className="text-primary">
                {order.finalPrice.toLocaleString()} EGP
              </span>
            </p>
          </div>
        </div>
      ))}

      {/* ===> pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`
              px-4 py-2 rounded-full transition 
              ${
                currentPage === i + 1
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
