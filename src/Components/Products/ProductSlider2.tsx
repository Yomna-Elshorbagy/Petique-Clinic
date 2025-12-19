import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import type { IProduct } from "../../Interfaces/IProducts";
import { getAllProducts } from "../../Apis/ProductApis";


const AUTOPLAY_DELAY = 3500;

const ProductSlider2: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(4);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [enableTransition, setEnableTransition] = useState<boolean>(true);

  /* =======================
     FETCH PRODUCTS
  ======================== */
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const res = await getAllProducts(1, 50);

        if (Array.isArray(res.data)) {
          const sorted = [...res.data]
            .filter((p: IProduct) => (p.finalPrice ?? p.price) > 0)
            .sort(
              (a: IProduct, b: IProduct) =>
                (a.finalPrice ?? a.price) -
                (b.finalPrice ?? b.price)
            )
            .slice(0, 8);

          setProducts(sorted);
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(
          e instanceof Error ? e.message : t("products.errors.loadFailed")
        );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =======================
     RESPONSIVE
  ======================== */
  useEffect(() => {
    const update = (): void => {
      const w = window.innerWidth;
      if (w < 640) setSlidesPerView(1);
      else if (w < 768) setSlidesPerView(2);
      else if (w < 1024) setSlidesPerView(3);
      else setSlidesPerView(4);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* =======================
     CLONED SLIDES (INFINITE)
  ======================== */
  const extendedProducts = useMemo<IProduct[]>(() => {
    if (!products.length) return [];
    return [...products, ...products.slice(0, slidesPerView)];
  }, [products, slidesPerView]);

  const maxIndex = products.length;

  /* =======================
     AUTOPLAY
  ======================== */
  useEffect(() => {
    if (isPaused) return;

    const timer: ReturnType<typeof setInterval> = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, [isPaused]);

  /* =======================
     RESET WITHOUT ANIMATION
  ======================== */
  useEffect(() => {
    if (currentIndex === maxIndex) {
      const t = setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(0);
      }, 400);

      return () => clearTimeout(t);
    }

    setEnableTransition(true);
  }, [currentIndex, maxIndex]);

  /* =======================
     EARLY RETURNS
  ======================== */
  if (loading) return <LoaderPage />;
  if (error) return <p className="py-20 text-center">{error}</p>;
  if (!products.length) return null;

  const slideWidth = 100 / slidesPerView;
  const translateX = currentIndex * slideWidth * (isRTL ? -1 : -1);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative py-20 px-4 sm:px-6 lg:px-24 overflow-hidden"
    >
      {/* Decorative paw prints with subtle animation */}
            <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="paw-print absolute top-10 left-10 text-6xl"
              >
                🐾
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="paw-print absolute top-40 right-16 text-5xl"
              >
                🐾
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="paw-print absolute bottom-20 left-1/4 text-7xl"
              >
                🐾
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="paw-print absolute bottom-10 right-32 text-6xl"
              >
                🐾
              </motion.div>
            </div>
      {/* ================= Header ================= */}
      <div className="text-center mb-12 relative z-10">
        <h2 className="font-['Playfair_Display'] text-[var(--color-extra-2)] uppercase tracking-widest font-semibold text-xl md:text-3xl mb-4">
          {t("productsSection.bestValue.title")}
        </h2>
        <p className="text-[#8A7A67] dark:text-[#CFC3B5] text-sm md:text-base max-w-2xl mx-auto">
           {t("productsSection.bestValue.subtitle")}
        </p>
      </div>

      {/* ================= Slider ================= */}
      <div
        className="relative overflow-hidden z-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          animate={{ x: `${translateX}%` }}
          transition={
            enableTransition
              ? { duration: 0.7, ease: "easeInOut" }
              : { duration: 0 }
          }
        >
          {extendedProducts.map((product, i) => (
            <div
              key={`${product._id}-${i}`}
              style={{ width: `${slideWidth}%` }}
              className="shrink-0 px-3"
            >
              <motion.div whileHover={{ y: -8 }}
              // className="bg-[var(--color-bg-light)]"
              >
                <ProductCard product={product} />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ================= Dots ================= */}
      <div className="flex justify-center gap-2 mt-6 relative z-10">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentIndex % products.length === i
                ? "bg-[#D98C33] scale-125"
                : "bg-[#CFC3B5]"
            }`}
          />
        ))}
      </div>

      {/* ================= CTA ================= */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <motion.button
            onClick={() => navigate("/products")}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="
              inline-flex
              items-center
              gap-3
              px-8
              py-4
              mt-12
              bg-gradient-to-r
              from-[#E5A85C]
              to-[#D98C33]
              text-white
              font-semibold
              text-lg
              rounded-full
              shadow-lg
              hover:shadow-xl
              transition-all
              duration-300
              group
            "
          >
            <span>{t("productsSection.bestValue.cta")}</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </motion.button>
        </motion.div>
    </motion.section>
  );
};

export default ProductSlider2;
