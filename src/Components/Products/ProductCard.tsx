import React, { useState } from "react";
import { ShoppingCart, Star, StarHalf } from "lucide-react";
import type { IProduct } from "../../Interfaces/IProducts";
import { baseURL } from "../../Apis/BaseUrl";
import { useNavigate } from "react-router-dom";
import styles from "./product.module.css";
import { useAppDispatch } from "../../Hooks/useSliceHook";
import Swal from "sweetalert2";
import { addProductToCart } from "../../Store/Slices/CartSlice";
import type { AppDispatch } from "../../Store/store";
import { jwtDecode } from "jwt-decode";

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
      customClass: {
        popup: "swal-toast-custom",
      },
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
      customClass: {
        popup: "swal-toast-custom",
      },
    });
    throw err;
  }
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={styles.ratingWrapper}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={styles.starFilled} />
      ))}
      {hasHalfStar && (
        <span className={styles.starHalfWrapper}>
          <Star className={styles.starEmpty} />
          <StarHalf className={styles.starHalfOverlay} />
        </span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={styles.starEmpty} />
      ))}
      <span className={styles.ratingText}>{rating.toFixed(1)}</span>
    </div>
  );
};

interface ProductCardProps {
  product: IProduct;
}
interface JwtPayload {
  id: string;
  role: "admin" | "doctor" | "owner" | "user";
  iat: number;
  exp: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentSubImageIndex, setCurrentSubImageIndex] = useState(-1);
  const [isHovering, setIsHovering] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { title, imageCover, price, finalPrice, discount, subImages, rate } =
    product;

  const hasDiscount = !!discount && discount > 0;

  const imageSrc =
    typeof imageCover === "string"
      ? imageCover.startsWith("http")
        ? imageCover
        : `${baseURL}/${imageCover.replace(/^\/+/, "")}`
      : imageCover?.secure_url || "";

  const getSubImageSrc = (subImage: any) => {
    if (!subImage) return "";
    return typeof subImage === "string"
      ? subImage.startsWith("http")
        ? subImage
        : `${baseURL}/${subImage.replace(/^\/+/, "")}`
      : subImage?.secure_url || "";
  };

  const validSubImages = subImages?.filter((img) => getSubImageSrc(img)) || [];

  const token = localStorage.getItem("accessToken");

  let role: JwtPayload["role"] | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      role = decoded.role;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }
  const isPrivilegedRole =
    role === "admin" || role === "doctor" || role === "owner";

  const isOutOfStock = product.stock === 0;

  const isButtonDisabled = isPrivilegedRole || isOutOfStock;

  const handleLoginAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Login required",
      text: "You need to login to add products to cart",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Continue shopping",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };

  return (
    <article
      onClick={() => navigate(`/product-details/${product._id}`)}
      className={styles.productCard}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentSubImageIndex(-1);
      }}
    >
      {/* Image Container */}
      <div className={styles.imageContainer}>
        {/* Discount Badge */}
        {hasDiscount && (
          <span className={styles.discountBadge}>-{discount}%</span>
        )}

        {/* Main Product Image */}
        <div className={styles.imageWrapper}>
          <img
            src={
              validSubImages.length > 0 && currentSubImageIndex >= 0
                ? getSubImageSrc(validSubImages[currentSubImageIndex]) ||
                  imageSrc
                : imageSrc
            }
            alt={title}
            className={`${styles.mainImage} ${
              isHovering && validSubImages.length > 0
                ? styles.mainImageHovering
                : ""
            }`}
          />

          {/* Hover Overlay with Sub Images */}
          {validSubImages.length > 0 && (
            <div className={styles.subImagesOverlay}>
              <div className={styles.subImagesContainer}>
                {validSubImages.slice(0, 3).map((subImage, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setCurrentSubImageIndex(index)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSubImageIndex(index);
                    }}
                    className={`${styles.subImageButton} ${
                      index === currentSubImageIndex
                        ? styles.subImageButtonActive
                        : ""
                    }`}
                  >
                    <img
                      src={getSubImageSrc(subImage)}
                      alt={`${title} view ${index + 1}`}
                      className={styles.subImage}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Title */}
        <h3 className={styles.title}>
          {title.split(" ").slice(0, 3).join(" ")}
        </h3>

        {/* Rating */}
        {rate !== undefined && rate > 0 && (
          <div className={styles.ratingContainer}>
            <StarRating rating={rate} />
          </div>
        )}

        {/* Price Section */}
        <div className={styles.priceContainer}>
          {hasDiscount && (
            <span className={styles.originalPrice}>${price.toFixed(2)}</span>
          )}
          <span className={styles.finalPrice}>
            ${(finalPrice ?? price).toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={isButtonDisabled}
          onClick={async (e) => {
            e.stopPropagation();

            if (!token) {
              handleLoginAlert();
              return;
            }

            if (isButtonDisabled) return;

            setIsAddingToCart(true);
            try {
              await handleAddToCart(dispatch, product._id);
            } finally {
              setIsAddingToCart(false);
            }
          }}
          className={`${styles.addToCartButton} ${
            isButtonDisabled ? styles.disabledButton : ""
          }`}
        >
          <ShoppingCart
            className={`${styles.cartIcon} ${
              isAddingToCart ? styles.cartIconBounce : ""
            }`}
          />
          {isOutOfStock
            ? "Out of Stock"
            : isPrivilegedRole
            ? "Not allowed"
            : isAddingToCart
            ? "Adding..."
            : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
