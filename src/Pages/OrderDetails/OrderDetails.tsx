import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaTruck, FaCheckCircle, FaClock, FaBox } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import SEO from "../../Components/SEO/SEO";

const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const orderData = location.state?.order?.data ?? location.state?.order;

  console.log(orderData);

  /* -------------------- Helpers -------------------- */

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

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return t("orderDetails.statusPlaced");
      case "shipped":
        return t("orderDetails.statusShipped");
      case "delivered":
        return t("orderDetails.statusDelivered");
      default:
        return status;
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

  /* -------------------- No Order Case -------------------- */

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            {t("orderDetails.noOrderDataTitle")}
          </h1>
          <p className="text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
            {t("orderDetails.noOrderDataDesc")}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-[var(--color-light-accent)] text-white rounded-lg"
          >
            {t("orderDetails.goToHomepage")}
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- UI -------------------- */

  return (
    <>
      <SEO
        title="Order Details | Petique Clinic"
        description="Confirm and manage your pet service orders securely with Petique Clinic."
      />

      <div className="min-h-screen bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[var(--color-dark-card)] rounded-3xl p-8 mb-8"
          >
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {t("orderDetails.orderNumber")} {orderData._id}
                </h1>
                <p className="text-sm text-gray-500">
                  {t("orderDetails.placedOn")}{" "}
                  {new Date(orderData.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold ${getStatusColor(
                  orderData.status
                )}`}
              >
                {getStatusIcon(orderData.status)}
                {getStatusText(orderData.status)}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FaPaw />
                  {t("orderDetails.customerInfo")}
                </h2>

                <div className="space-y-4">
                  <p>
                    <strong>{t("orderDetails.fullName")}:</strong>{" "}
                    {orderData.fullName}
                  </p>
                  <p>
                    <strong>{t("orderDetails.phoneNumber")}:</strong>{" "}
                    {orderData.phone}
                  </p>
                  <p>
                    <strong>{t("orderDetails.deliveryAddress")}:</strong>{" "}
                    {orderData.address}
                  </p>

                  {orderData.note && (
                    <p>
                      <strong>{t("orderDetails.specialNotes")}:</strong>{" "}
                      {orderData.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6">
                  {t("orderDetails.orderItems")}
                </h2>

                {orderData.products?.length ? (
                  orderData.products.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center mb-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageCover?.secure_url}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm">
                            {t("orderDetails.qty")} {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">EGP {item.price}</p>
                    </div>
                  ))
                ) : (
                  <p>{t("orderDetails.noItems")}</p>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-2xl p-6 h-fit">
              <h2 className="text-xl font-bold mb-6">
                {t("orderDetails.orderSummary")}
              </h2>

              <p className="flex justify-between mb-2">
                <span>{t("orderDetails.subtotal")}</span>
                <span>EGP {orderData.orderPrice}</span>
              </p>

              <p className="flex justify-between font-bold text-lg">
                <span>{t("orderDetails.total")}</span>
                <span className="text-[var(--color-light-accent)]">
                  EGP {orderData.finalPrice}
                </span>
              </p>

              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-6 px-6 py-3 bg-[var(--color-light-accent)] text-white rounded-lg"
              >
                {t("orderDetails.continueShopping")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
