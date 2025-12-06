import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../Store/store";
import { FaTruck, FaShieldAlt, FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getUserCart } from "../../../Store/Slices/CartSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();

const OrderSummary = () => {
  const dispatch = useAppDispatch();
  const { products, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );

  const displayProducts = products;

  const subtotal = totalPrice > 0 ? totalPrice : 214.97;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-4 mt-10 lg:mt-0"
    >
      <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-lg font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] mb-6 flex items-center gap-2">
          <FaTruck className="text-[var(--color-light-accent)]" /> Order Summary
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

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
          <div className="flex justify-between text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] pt-2 border-t border-gray-100 dark:border-gray-700">
            <span>Total</span>
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
            Secure
          </span>
        </div>
        <div className="w-px h-8 bg-gray-100 dark:bg-gray-700"></div>
        <div className="flex flex-col items-center gap-1">
          <FaTruck className="text-gray-400 text-lg" />
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            Fast Delivery
          </span>
        </div>
        <div className="w-px h-8 bg-gray-100 dark:bg-gray-700"></div>
        <div className="flex flex-col items-center gap-1">
          <FaHeart className="text-gray-400 text-lg" />
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            Pet Friendly
          </span>
        </div>
      </div>
    </motion.section>
  );
};

export default OrderSummary;
