import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../Store/store";
import { FaTruck, FaShieldAlt, FaHeart, FaCheckCircle, FaTrash } from "react-icons/fa";
import { Tag } from "lucide-react";
import { useDispatch } from "react-redux";
import { getUserCart } from "../../../Store/Slices/CartSlice";
import { useTranslation } from "react-i18next";
import { getCouponByCode } from "../../../Apis/CouponApis";
import type { ICoupon } from "../../../Interfaces/ICoupon";

const useAppDispatch = () => useDispatch<AppDispatch>();

interface OrderSummaryProps {
  onApplyCoupon?: (code: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ onApplyCoupon }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [couponCode, setCouponCode] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | null>(null);
  const { products, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );

  const displayProducts = products;

  const subtotal = totalPrice;
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percentage") {
      return subtotal * (appliedCoupon.discount / 100);
    }
    return appliedCoupon.discount;
  };

  const discountAmount = calculateDiscount();
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + tax;

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;

    try {
      // Verify coupon exists before applying
      const coupon = await getCouponByCode(couponCode); 
      
      if (onApplyCoupon) {
        onApplyCoupon(couponCode);
        setIsApplied(true);
        setAppliedCoupon(coupon);
      }
    } catch (error) {
      console.error("Invalid coupon code", error);
      // Optional: Add UI feedback for invalid coupon here
    }
  };

  const handleRemoveCoupon = () => {
    if (onApplyCoupon) {
      onApplyCoupon("");
    }
    setCouponCode("");
    setIsApplied(false);
    setAppliedCoupon(null);
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-4 mt-10 lg:mt-0"
    >
      <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-lg font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] mb-6 flex items-center gap-2">
          <FaTruck className="text-[var(--color-light-accent)]" />{" "}
          {t("checkout.orderSummary")}
        </h3>

        <div className="space-y-6 mb-8">
          {displayProducts.map((product) => (
            <div key={product._id} className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] p-2 flex items-center justify-center flex-shrink-0">
                <img
                  src={product.productId?.imageCover?.secure_url}
                  alt={product.productId?.title}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] line-clamp-2">
                  {product.productId?.title}
                </h4>
                <p className="text-xs text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mt-1">
                  {product.category?.name || "Item"}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    Qty: {product.quantity}
                  </span>
                  <span className="text-sm font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
                    ${(product.price * product.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* OPTIONAL COUPON SECTION */}
        <div className="mb-6">
          <button
            onClick={() => setShowCoupon(!showCoupon)}
            className="text-sm text-[var(--color-light-accent)] dark:text-[var(--color-dark-accent)] hover:underline flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            {showCoupon ? t("checkout.hideCoupon") : t("checkout.haveCoupon")}
          </button>

          {showCoupon && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              {isApplied ? (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      {couponCode}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-500">
                      (Applied)
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-600 p-1 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t("checkout.enterCoupon")}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[var(--color-dark-background)] text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-light-accent)] dark:focus:ring-[var(--color-dark-accent)]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-[var(--color-light-accent)] dark:bg-[var(--color-dark-accent)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t("checkout.apply")}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
          <div className="flex justify-between text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
            <span>{t("checkout.subtotal")}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
            <span>{t("checkout.tax")}</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {isApplied && appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>
                {t("checkout.discount", "Discount")} ({appliedCoupon.code})
              </span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>{t("checkout.delivery")}</span>
            <span>{t("checkout.free")}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] pt-2 border-t border-gray-100 dark:border-gray-700">
            <span>{t("checkout.total")}</span>
            <span className="text-[var(--color-light-accent)]">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 bg-white dark:bg-[var(--color-dark-card)] rounded-2xl p-4 flex justify-between items-center text-center">
        <div className="flex flex-col items-center gap-1">
          <FaShieldAlt className="text-gray-400 text-lg" />
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            {t("checkout.secure")}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-100 dark:bg-gray-700"></div>
        <div className="flex flex-col items-center gap-1">
          <FaTruck className="text-gray-400 text-lg" />
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            {t("checkout.fastDelivery")}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-100 dark:bg-gray-700"></div>
        <div className="flex flex-col items-center gap-1">
          <FaHeart className="text-gray-400 text-lg" />
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            {t("checkout.petFriendly")}
          </span>
        </div>
      </div>
    </motion.section>
  );
};

export default OrderSummary;
