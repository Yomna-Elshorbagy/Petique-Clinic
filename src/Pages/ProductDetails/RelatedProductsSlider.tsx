import type { productdetails } from "../../Types/ProductDetailsType";
import { useEffect, useState, useTransition } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  subscribeToPriceAlerts,
  unsubscribeFromPriceAlerts,
  getUserPriceAlertSubscriptions,
} from "../../Apis/ProductApis";
import { useTranslation } from "react-i18next";

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
  const isSubscribed = subscribedProducts.includes(product._id);
  const isLoading = loadingSubs === product._id;

  const handleToggleSubscription = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingSubs(product._id);

    try {
      if (isSubscribed) {
        const res = await unsubscribeFromPriceAlerts(product._id);
        if (!res.success) throw new Error(res.message);

        setSubscribedProducts((prev: string[]) =>
          prev.filter((id) => id !== product._id)
        );
        toast.success("Unsubscribed from price drop alerts");
      } else {
        const res = await subscribeToPriceAlerts(product._id);
        if (!res.success) throw new Error(res.message);

        setSubscribedProducts((prev: string[]) => [...prev, product._id]);
        toast.success("Subscribed to price drop alerts 🔔");
      }
    } catch (error: any) {
      toast.error(error.message || "Subscription failed");
    } finally {
      setLoadingSubs(null);
    }
  };

  return (
    <div className="px-5 py-4">
      <div className="group h-full rounded-3xl overflow-hidden bg-[var(--color-bg-cream)] border border-[var(--color-border-light)] shadow-sm hover:shadow-lg transition-all duration-300">
        <Link to={`/product-details/${product._id}`}>
          <div className="relative overflow-hidden bg-[var(--color-bg-warm)] rounded-t-3xl aspect-[4/3]">
            <img
              src={activeImage}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          <h3 className="text-base font-semibold text-[25px] text-[var(--color-text-primary)] line-clamp-2">
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
            disabled={isLoading}
            className={`w-[200px]  py-2.5 mx-auto  block rounded-xl font-semibold text-sm transition-all
              ${
                isSubscribed
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-[var(--color-light-accent)] text-[var(--color-light-dark)] hover:bg-[var(--color-accent-dark)] hover:text-white"
              }
              ${isLoading && "opacity-60 cursor-not-allowed"}
            `}
          >
            {isLoading
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
export default function RelatedProductsSlider({ relatedProducts }: any) {
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
    // <section className="px-6 md:px-10 lg:px-16 py-8">
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
    // </section>
  );
}
