import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CartHeader from "../../Components/Cart/CartHeader";
import Banner from "../../Components/Cart/Banner";
import CartItems from "../../Components/Cart/CartItems";
import OrderSummary from "../../Components/Cart/OrderSummary";
import { useAppDispatch, useAppSelector } from "../../Hooks/useSliceHook.ts";
import {
  getUserCart,
  updateCartQuantity,
  deleteCartItem,
  clearCartApi,
} from "../../Store/Slices/CartSlice.ts";

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { products, totalPrice, noOfCartItems } = useAppSelector(
    (state) => state.cart
  );

  // load cart on mount
  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  const handleUpdateQuantity = (id: string, change: number) => {
    const item = products.find((p: any) => p._id === id);
    if (!item) return;

    const newCount = Math.max(1, item.quantity + change);
    dispatch(updateCartQuantity({ id, newCount }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(deleteCartItem(id));
  };

  const handleClearCart = () => {
    dispatch(clearCartApi());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[var(--color-light-background)] text-[var(--color-text-primary)] font-sans pb-20 pt-24 transition-colors duration-300"
    >
      <CartHeader totalItems={noOfCartItems} onClearCart={handleClearCart} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Banner />

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-[var(--color-bg-lighter)] p-8 rounded-full shadow-sm mb-6 relative">
              <ShoppingBag className="w-16 h-16 text-[var(--color-light-accent)]" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-0 right-0 bg-[var(--color-text-primary)] w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              >
                0
              </motion.div>
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4 text-[var(--color-text-primary)]">
              {t("cart.emptyTitle")}
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">{t("cart.emptyDesc")}</p>
            <Link
              to="/products"
              className="bg-[var(--color-light-accent)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-accent-dark)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-block"
            >
              {t("cart.startShopping")}
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <CartItems
                items={products}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            <div className="lg:col-span-4">
              <OrderSummary
                totalItems={noOfCartItems}
                subtotal={totalPrice}
                total={totalPrice}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;
