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
    if (!order) return "bg-gray-300";
    const status = order.status;

    if (status === orderStatus.CANCELED) return "bg-red-500";
    if (status === orderStatus.REFUNDED) return "bg-yellow-500";

    return index <= stepIndex ? "bg-[#8B5E35]" : "bg-gray-300";
  };

  const progressWidth =
    stepIndex >= 0 ? ((stepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#FFF8F2] to-[#F2E4D7] shadow-xl border border-[#d3c2ad]">
      <h2 className="text-3xl font-bold text-center text-[#8B5E35] mb-8 flex items-center justify-center gap-3">
        <FaDog /> Track Your Order
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
          className="flex-1 border border-[#BFA98A] rounded-xl px-4 py-2 bg-[#FFFDFB] focus:ring-2 focus:ring-[#8B5E35] transition text-[#5A4634]"
        />
        <button
          type="submit"
          className="bg-[#8B5E35] text-white px-6 py-2 rounded-xl hover:bg-[#734E2F] transition shadow-md"
        >
          Search
        </button>
      </form>

      {isLoading && <LoaderPage />}
      {isError && (
        <p className="text-center text-red-500 text-lg font-semibold">
          Order not found. Please check your ID.
        </p>
      )}

      {order && (
        <>
          {/* Timeline */}
          <div className="relative mb-14 mt-6">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#e2d3c1] -z-10" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#8B5E35] transition-all duration-500 -z-10"
              style={{ width: `${progressWidth}%` }}
            />

            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center w-1/5">
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
                        ? "text-[#8B5E35]"
                        : "text-[#8B5E35]/40"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Info Card */}
          <div className="bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl border border-[#e4d7c6] p-6">
            <h3 className="text-xl font-bold text-[#8B5E35] mb-3">
              Order #{order._id.slice(-6).toUpperCase()}
            </h3>

            <div className="space-y-2 text-[#5A4634]">
              <p>
                <span className="font-semibold text-[#8B5E35] mr-1">
                  Status:
                </span>
                {order.status.toUpperCase()}
              </p>

              <p>
                <span className="font-semibold text-[#8B5E35] mr-1">
                  Placed On:
                </span>
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <p>
                <span className="font-semibold text-[#8B5E35] mr-1">
                  Address:
                </span>
                {order.address}
              </p>

              <p>
                <span className="font-semibold text-[#8B5E35] mr-1">
                  Phone:
                </span>
                {order.phone}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PetOrderTracking;
