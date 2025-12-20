import React from "react";
import { baseURL } from "../../Apis/BaseUrl";
import { Trash2 } from "lucide-react";
import { useAppDispatch } from "../../Hooks/useSliceHook";
import {
  deleteCartItem,
  updateCartQuantity,
} from "../../Store/Slices/CartSlice";
import { useTranslation } from "react-i18next";

interface Props {
  items: any[];
  onUpdateQuantity: (id: string, change: number, currentQty: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItems: React.FC<Props> = ({ items }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  //===> update Quantity
  const handleUpdateQuantity = (
    id: string,
    change: number,
    currentQty: number
  ) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    dispatch(updateCartQuantity({ id, newCount: newQty }));
  };

  //===> remove Single Item
  const handleRemoveItem = (id: string) => {
    dispatch(deleteCartItem(id));
  };

  return (
    <div className="space-y-6">
      {items.map((item) => {
        const product = item.productId;

        const img =
          typeof product.imageCover === "string"
            ? product.imageCover.startsWith("http")
              ? product.imageCover
              : `${baseURL}/${product.imageCover}`
            : product.imageCover?.secure_url || "";

        const itemTotal = (product.price * item.quantity).toFixed(2);

        return (
          <div
            key={item._id}
            className="
              group flex gap-4 bg-white dark:bg-[var(--color-dark-card)] p-4 rounded-2xl border border-gray-200 dark:border-[var(--color-dark-accent)]/20
              shadow-sm hover:shadow-lg transition-all duration-300 ease-out
            "
          >
            <img
              src={img}
              className="w-24 h-24 object-cover rounded-xl"
              alt={product.title}
            />

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-[var(--color-dark-text)] text-lg">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${product.price} {t("cart.each")}
              </p>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.productId._id, -1, item.quantity)
                  }
                  className="
                    w-8 h-8 flex items-center justify-center rounded-full 
                    border border-gray-300 dark:border-[var(--color-dark-accent)]/30 text-gray-600 dark:text-gray-400 transition-all duration-200
                    hover:bg-orange-100 dark:hover:bg-[var(--color-dark-accent)]/20 hover:border-orange-300 dark:hover:border-[var(--color-dark-accent)] hover:text-orange-600 dark:hover:text-[var(--color-dark-accent)]
                    active:scale-95
                  "
                >
                  –
                </button>

                <span className="font-medium text-gray-800 dark:text-[var(--color-dark-text)]">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleUpdateQuantity(item.productId._id, +1, item.quantity)
                  }
                  className="
                    w-8 h-8 flex items-center justify-center rounded-full 
                    border border-gray-300 dark:border-[var(--color-dark-accent)]/30 text-gray-600 dark:text-gray-400 transition-all duration-200
                    hover:bg-orange-100 dark:hover:bg-[var(--color-dark-accent)]/20 hover:border-orange-300 dark:hover:border-[var(--color-dark-accent)] hover:text-orange-600 dark:hover:text-[var(--color-dark-accent)]
                    active:scale-95
                  "
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => handleRemoveItem(item.productId._id)}
                className="
                  text-red-500 hover:text-red-600 p-2 rounded-full
                  hover:bg-red-50 transition-all duration-300 ease-out active:scale-90
                "
              >
                <Trash2
                  size={20}
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
              </button>

              <p className="font-semibold text-gray-800 dark:text-[var(--color-dark-text)] text-lg">
                ${itemTotal}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItems;
