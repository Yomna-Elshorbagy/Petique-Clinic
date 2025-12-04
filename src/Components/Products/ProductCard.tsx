import React from "react";
import type { IProduct } from "../../Interfaces/IProducts";
import { baseURL } from "../../Apis/BaseUrl";
import { useNavigate } from "react-router-dom";
import styles from "./product.module.css";
import { useAppDispatch } from "../../Hooks/useSliceHook";
import Swal from "sweetalert2";
import { addProductToCart } from "../../Store/Slices/CartSlice";
import type { AppDispatch } from "../../Store/store";

const handleAddToCart = async (dispatch: AppDispatch, productId: string) => {
  try {
    const res = await dispatch(addProductToCart(productId)).unwrap();

    Swal.fire({
      position: "top-end",
      icon: res.success ? "success" : "error",
      title: res.message || (res.success ? "Added to cart" : "Failed"),
      showConfirmButton: false,
      timer: 1500,
      toast: true,
    });

    return res;
  } catch (err: any) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: err?.message || "Failed to add to cart",
      showConfirmButton: false,
      timer: 1500,
      toast: true,
    });
    throw err;
  }
};

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { title, imageCover, price, finalPrice, discount } = product;

  const hasDiscount = !!discount && discount > 0;

  const imageSrc =
    typeof imageCover === "string"
      ? imageCover.startsWith("http")
        ? imageCover
        : `${baseURL}/${imageCover.replace(/^\/+/, "")}`
      : imageCover?.secure_url || "";

  return (
    <article
      onClick={() => navigate(`/product-details/${product._id}`)}
      className={`${styles.card} cursor-pointer group`}
    >
      <div className={styles.imageWrapper}>
        <img src={imageSrc} alt={title} />

        {hasDiscount && <span className={styles.saleBadge}>Sale!</span>}

        <div className={styles.overlay}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(dispatch, product._id);
            }}
            className={styles.cartBtn}
          >
            Add to cart
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h3>{title}</h3>

        <div className={styles.price}>
          {hasDiscount && <span className={styles.old}>${price}</span>}
          <span className={styles.new}>${finalPrice ?? price}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
