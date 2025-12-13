import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CartHeaderProps {
  totalItems: number;
  onClearCart: () => void;
}

export default function CartHeader({
  totalItems,
  onClearCart,
}: CartHeaderProps) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-50 bg-[#faf9f6]/80 backdrop-blur-md border-b border-[#e8d8c4]/30">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#7a7067] hover:text-[#4f3f36] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t("cart.continueShopping")}</span>
        </Link>

        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 5, duration: 1 }}
          >
            <ShoppingBag className="w-6 h-6 text-[#e9a66f]" />
          </motion.div>
          <h1 className="text-2xl font-serif font-bold text-[#4f3f36]">
            {t("cart.myCart")}
          </h1>
          <motion.span
            key={totalItems}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="bg-[#e9a66f] text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            {totalItems}
          </motion.span>
        </div>

        <button
          onClick={onClearCart}
          className="text-xs font-medium bg-[#e8d8c4]/30 px-3 py-1.5 rounded-full text-[#7a7067] hover:bg-[#e8d8c4] transition-colors"
        >
          {t("cart.showEmpty")}
        </button>
      </div>
    </header>
  );
}
