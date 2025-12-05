import React from "react";
import type { IProduct } from "../../Interfaces/IProducts";
import { baseURLServer } from "../../Apis/BaseUrl";
import { useNavigate } from "react-router-dom";
import styles from "./product.module.css";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const {
    title,
    imageCover,
    price,
    finalPrice,
    discount,
    stock,
    category,
  } = product;

  const hasDiscount = discount && discount > 0;

  const imageSrc =
    typeof imageCover === "string"
      ? imageCover.startsWith("http")
        ? imageCover
        : `${baseURLServer}/${imageCover.replace(/^\/+/, "")}`
      : imageCover?.url || imageCover?.secure_url || "";

//   return (
//     <article
//       onClick={() => navigate(`/product-details/${product._id}`)}
//       className={`${styles.card} cursor-pointer group`}
//     >
//       {/* IMAGE */}
//       <div className={styles.imageWrapper}>
//         <img src={imageSrc} alt={title} />

//         {/* SALE BADGE */}
//         {hasDiscount && <span className={styles.saleBadge}>Sale!</span>}

//         {/* HOVER BUTTON */}
//         <div className={styles.overlay}>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               console.log("Add To Cart");
//             }}
//             className={styles.cartBtn}
//           >
//             Add to cart
//           </button>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className={styles.content}>
//         <h3>{title}</h3>

//         <div className={styles.price}>
//           {hasDiscount && <span className={styles.old}>${price}</span>}
//           <span className={styles.new}>${finalPrice ?? price}</span>
//         </div>
//       </div>
//     </article>
//   );
// };



 return (
    
<article onClick={() => navigate(`/product-details/${product._id}`)}
      className={styles.card}>
      <div className={styles.imageContainer}>
        {hasDiscount && <span className={styles.saleBadge}>Sale!</span>}
        
        <img
          src={imageSrc}
          alt={title.split(" ").slice(0, 3).join(" ")}
          className={styles.productImage}
        />

        <div className={styles.overlay}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Add To Cart:", product._id);
            }}
            className={styles.addToCartBtn}
          >
            Add to cart
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          {title.split(" ").slice(0, 3).join(" ")}
        </h3>

        <div className={styles.priceContainer}>
          {hasDiscount && (
            <span className={styles.originalPrice}>${price.toFixed(2)}</span>
          )}
          <span className={styles.finalPrice}>
            ${(finalPrice ?? price).toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
