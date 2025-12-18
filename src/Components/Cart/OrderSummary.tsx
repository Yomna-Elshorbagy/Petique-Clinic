import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface OrderSummaryProps {
  totalItems: number;
  subtotal: number;
  total: number;
}

export default function OrderSummary({
  totalItems,
  subtotal,
  total,
}: OrderSummaryProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToCheckout = () => {
    navigate("/Checkout");
  };

  return (
    <div className="sticky top-24">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        className="bg-white dark:bg-[var(--color-dark-card)] rounded-[2rem] p-8 shadow-lg border border-[#e8d8c4]/30 dark:border-[var(--color-dark-accent)]/20 transition-colors duration-300"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#e9a66f] dark:text-[var(--color-dark-accent)]" />
          <h2 className="font-serif text-2xl font-bold text-[#4f3f36] dark:text-[var(--color-dark-text)]">
            {t("cart.orderSummary")}
          </h2>
        </div>

        <p className="text-[#7a7067] dark:text-gray-400 text-sm mb-8">
          {totalItems} items in your cart
        </p>

        {/* PRICE DETAILS */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-[#7a7067] dark:text-gray-400">
            <span>{t("cart.subtotal")}</span>
            <span className="font-bold text-[#4f3f36] dark:text-[var(--color-dark-text)]">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-[#7a7067] dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" /> {t("cart.shipping")}
            </span>
            <span className="text-green-600 dark:text-green-500 font-bold">
              {t("cart.free")}
            </span>
          </div>

          <div className="h-px bg-[#e8d8c4]/50 dark:bg-[var(--color-dark-accent)]/20 my-4"></div>

          <div className="flex justify-between items-end">
            <span className="text-lg font-bold text-[#4f3f36] dark:text-[var(--color-dark-text)]">
              {t("cart.total")}
            </span>
            <span className="text-3xl font-serif font-bold text-[#4f3f36] dark:text-[var(--color-dark-text)]">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* CHECKOUT BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={goToCheckout}
          className="w-full bg-gradient-to-r from-[#e9a66f] to-[#d68f55] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <span className="relative z-10">{t("cart.proceedToCheckout")}</span>

          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>

        {/* BADGES */}
        <div className="mt-6 flex justify-center gap-6 text-[#b89c86]">
          <div className="flex items-center gap-2 text-xs font-medium">
            <ShieldCheck className="w-4 h-4" /> {t("cart.secureCheckout")}
          </div>
          <div className="flex items-center gap-2 text-xs font-medium">
            <Truck className="w-4 h-4" /> {t("cart.fastDelivery")}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
