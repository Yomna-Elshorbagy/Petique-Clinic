import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Tag, Truck } from "lucide-react";

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
  return (
    <div className="sticky top-24">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        className="bg-[#fcfbf9] rounded-[2rem] p-8 shadow-lg border border-[#e8d8c4]/30"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#e9a66f]" />
          <h2 className="font-serif text-2xl font-bold text-[#4f3f36]">
            Order Summary
          </h2>
        </div>
        <p className="text-[#7a7067] text-sm mb-8">
          {totalItems} items in your cart
        </p>

        <div className="mb-8">
          <label className="text-xs font-bold text-[#4f3f36] flex items-center gap-2 mb-2">
            <Tag className="w-3 h-3" /> Promo Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter code"
              className="flex-1 bg-white border border-[#e8d8c4] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e9a66f] transition-colors"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-[#e8d8c4] text-[#4f3f36] font-bold text-sm px-4 rounded-xl hover:bg-[#d6c2a8] transition-colors"
            >
              Apply
            </motion.button>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-[#7a7067]">
            <span>Subtotal</span>
            <span className="font-bold text-[#4f3f36]">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-[#7a7067]">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" /> Shipping
            </span>
            <span className="text-green-600 font-bold">Free</span>
          </div>
          <div className="h-px bg-[#e8d8c4]/50 my-4"></div>
          <div className="flex justify-between items-end">
            <span className="text-lg font-bold text-[#4f3f36]">Total</span>
            <span className="text-3xl font-serif font-bold text-[#4f3f36]">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#e9a66f] to-[#d68f55] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <span className="relative z-10">Proceed to Checkout</span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>

        <div className="mt-6 flex justify-center gap-6 text-[#b89c86]">
          <div className="flex items-center gap-2 text-xs font-medium">
            <ShieldCheck className="w-4 h-4" /> Secure Checkout
          </div>
          <div className="flex items-center gap-2 text-xs font-medium">
            <Truck className="w-4 h-4" /> Fast Delivery
          </div>
        </div>
      </motion.div>
    </div>
  );
}
