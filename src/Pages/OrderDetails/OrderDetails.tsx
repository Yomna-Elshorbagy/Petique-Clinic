import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaTruck, FaCheckCircle, FaClock, FaBox } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.order?.data;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return <FaClock className="text-yellow-500" />;
      case "shipped":
        return <FaTruck className="text-blue-500" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "shipped":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "delivered":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
            No Order Data Found
          </h1>
          <p className="text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mt-2">
            Please go back and select an order to view its details.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full mt-6 px-6 py-3 bg-[var(--color-light-accent)] hover:bg-[#d69560] text-white font-semibold rounded-lg transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] py-12 px-4 mt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[var(--color-dark-card)] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="max-w-full overflow-hidden">
              <h1 className="text-3xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] mb-2 whitespace-nowrap overflow-x-auto no-scrollbar">
                Order #{orderData._id}
              </h1>
              <p className="text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
                Placed on {new Date(orderData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                  orderData.status
                )}`}
              >
                {getStatusIcon(orderData.status)}
                {orderData.status.charAt(0).toUpperCase() +
                  orderData.status.slice(1).toLowerCase()}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information -------------------------------------------------------------------------*/}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[var(--color-dark-card)] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
            >
              <h2 className="text-xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] mb-6 flex items-center gap-2">
                <FaPaw className="text-[var(--color-light-accent)]" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-1">
                    {orderData.fullName}
                  </p>
                  <p className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                    {orderData.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-1">
                    Phone Number
                  </p>
                  <p className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                    {orderData.phone}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-1">
                    Delivery Address
                  </p>
                  <p className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                    {orderData.address}
                  </p>
                </div>
                {orderData.note && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-1">
                      Special Notes
                    </p>
                    <p className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                      {orderData.note}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Order Items---------------------------------------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[var(--color-dark-card)] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
            >
              <h2 className="text-xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] mb-6">
                Order Items
              </h2>
              <div className="space-y-4">
                {orderData.products && orderData.products.length > 0 ? (
                  orderData.products.map((item: any, index: number) => (
                    <div
                      //   key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[var(--color-dark-background)] rounded-lg border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src=""
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                            {item?.title}
                          </h3>
                          <p className="text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                          EGP {item.price}
                        </p>

                        <p className="text-sm text-green-600 dark:text-green-400">
                          Save: {item.discount} EGP
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] py-8">
                    No items in this order
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar: Order Summary------------------------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
                    Subtotal
                  </span>
                  <span className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                    EGP {orderData.orderPrice}
                  </span>
                </div>

                {orderData.coupon && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Coupon {orderData.coupon.code} </span>
                    <span>- EGP {orderData.coupon.amount}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                  <span className="font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                    Total
                  </span>
                  <span className="font-bold text-lg text-[var(--color-light-accent)]">
                    EGP {orderData.finalPrice}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                <div>
                  <p className="text-xs text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] uppercase mb-1">
                    Payment Method
                  </p>
                  <p className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                    {orderData.payment}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] uppercase mb-1">
                    Order Date
                  </p>
                  <p className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                    {new Date(orderData.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] uppercase mb-1">
                    Status
                  </p>
                  <p className="font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                    {orderData.status}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-6 px-6 py-3 bg-[var(--color-light-accent)] hover:bg-[#d69560] text-white font-semibold rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
