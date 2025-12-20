import type { productdetails } from "../../Types/ProductDetailsType";
import { useEffect, useState, useTransition } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import {toast,Toaster} from "react-hot-toast";
import {
  subscribeToPriceAlerts,
  unsubscribeFromPriceAlerts,
  getUserPriceAlertSubscriptions,
} from "../../Apis/ProductApis";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
 
type Props = {
  relatedProducts: productdetails[];
};
interface JwtPayload {
  role?: "admin" | "doctor" | "owner" | "petOwner";
  id: string;
  iat: number;
  exp: number;
}

/* ================= SINGLE CARD ================= */
function RelatedProductCard({
  product,
  subscribedProducts,
  setSubscribedProducts,
  loadingSubs,
  setLoadingSubs,
}: any) {
  const [activeImage, setActiveImage] = useState(product.imageCover.secure_url);
  const { t } = useTranslation();
  const token = localStorage.getItem("accessToken");
   const navigate = useNavigate();
// role 
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
    role === "admin" || role === "doctor" ; 

  const isSubscribed = subscribedProducts.includes(product._id);
  const isLoading = loadingSubs === product._id;

   useEffect(() => {
    setActiveImage(product.imageCover.secure_url);
  }, [product._id]);
 // handle login alert

const handleLoginAlert = () => {
    Swal.fire({
      icon: "warning",
      title: t("ProductDetails.loginRequiredTitle"),
      text:  t("ProductDetails.loginRequiredText"),
      showCancelButton: true,
      confirmButtonText: t("ProductDetails.login"),
      cancelButtonText: t("ProductDetails.continueShopping"),
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };


  const handleToggleSubscription = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
// check login
    if (!token) {
      handleLoginAlert();
      return;
    }
    
    setLoadingSubs(product._id);

    try {
      if (isSubscribed) {
        const res = await unsubscribeFromPriceAlerts(product._id);
        if (!res.success) throw new Error(res.message);

        setSubscribedProducts((prev: string[]) =>
          prev.filter((id) => id !== product._id)
        );
        toast.success(t("ProductDetails.unsubscribedToast"));
      } else {
        const res = await subscribeToPriceAlerts(product._id);
        if (!res.success) throw new Error(res.message);

        setSubscribedProducts((prev: string[]) => [...prev, product._id]);
        toast.success(t("ProductDetails.subscribedToast"));
      }
    } catch (error: any) {
      toast.error(error.message || t("ProductDetails.subscriptionFailed"));
    } finally {
      setLoadingSubs(null);
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="group h-full rounded-3xl overflow-hidden bg-[var(--color-bg-cream)] border border-[var(--color-border-light)] shadow-sm hover:shadow-lg transition-all duration-300">
        <Link to={`/product-details/${product._id}`}>
          <div className="relative overflow-hidden bg-[var(--color-bg-warm)] rounded-t-3xl aspect-[4/3]">
            <img
              src={activeImage}
              alt={product.title}
              className="absolute inset-0 w-full h-full  transition-transform duration-500 group-hover:scale-105"
            />

            {product.subImages?.length > 0 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.subImages.slice(0, 4).map((img: any, i: number) => (
                  <button
                    key={i}
                    onMouseEnter={() => setActiveImage(img.secure_url)}
                    className="w-2.5 h-2.5 rounded-full bg-[var(--color-border-medium)] hover:bg-[var(--color-accent-dark)] transition"
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        <div className="px-1 py-1 text-center space-y-1">
          <h3 className="text-base font-semibold text-[15px] text-[var(--color-text-primary)] line-clamp-2">
            {product.title}
          </h3>

          <div className="flex items-center justify-center gap-3">
            {/* Rating */}
            <div className="flex gap-0.5 leading-none ">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-[20px] ${
                    i < product.rate
                      ? "text-[var(--color-accent-dark)]"
                      : "text-[var(--color-border-medium)]"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <span className="text-[var(--color-border-medium)] text-[14px]">
              |
            </span>

            {/* Price */}
            <div className="flex items-end gap-1 leading-none">
              {product.price !== product.finalPrice && (
                <span className="line-through text-text-[20px] text-[var(--color-text-muted)]">
                  ${product.price}
                </span>
              )}
              <span className="text-sm font-bold text-[var(--color-accent-dark)]">
                ${product.finalPrice}
              </span>
            </div>
          </div>

          <p className="text-[14px] text-[var(--color-text-muted)] py-1">
            {t("ProductDetails.priceDropNotification")}
          </p>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={handleToggleSubscription}
            disabled={isLoading || isPrivilegedRole}
            className={`w-[212px]  py-2.5 mx-auto  block rounded-xl font-semibold text-sm transition-all
              ${
                isSubscribed
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-[var(--color-light-accent)] text-[var(--color-light-dark)] hover:bg-[var(--color-accent-dark)] hover:text-white"
              }
              ${isLoading && "opacity-60 cursor-not-allowed"}
            `}
            
          >
            {isPrivilegedRole?
            t("ProductDetails.notallowed") :
            isLoading
              ? t("ProductDetails.update")
              : isSubscribed
              ? t("ProductDetails.unsubscribe")
              : t("ProductDetails.notifyMe")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN SLIDER ================= */
export default function RelatedProductsSlider({ relatedProducts }: Props) {
  const safeProducts = relatedProducts.filter((p: any) => !p.isDeleted);

  const [subscribedProducts, setSubscribedProducts] = useState<string[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<string | null>(null);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const res = await getUserPriceAlertSubscriptions();
        if (res.success) {
          setSubscribedProducts(res.subscribedProductIds);
        }
      } catch {
        console.error("Failed to fetch subscriptions");
      }
    };

    loadSubscriptions();
  }, []);

  return (
    <section className="px-6 md:px-10 lg:px-16 py-8">

       <Toaster 
        position="top-right" 
        reverseOrder={true} 
        toastOptions={{ duration: 3000 }}
      />
    <Slider
      dots={true}
      infinite={true}
      speed={500}
      slidesToShow={4}
      slidesToScroll={1}
      autoplay={true}
      autoplaySpeed={3000}
      responsive={[
        {
          breakpoint: 1024,
          settings: { slidesToShow: 3 },
        },
        {
          breakpoint: 768,
          settings: { slidesToShow: 2 },
        },
        {
          breakpoint: 640,
          settings: { slidesToShow: 1 },
        },
      ]}
    >
      {safeProducts.map((product: any) => (
        <RelatedProductCard
          key={product._id}
          product={product}
          subscribedProducts={subscribedProducts}
          setSubscribedProducts={setSubscribedProducts}
          loadingSubs={loadingSubs}
          setLoadingSubs={setLoadingSubs}
        />
      ))}
    </Slider>
    
    </section>
  );
}
