import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useCategories } from "../../Hooks/Categories/useCategories";
import { useTranslation } from "react-i18next";

export default function CategorySlider() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { categories, loading, error } = useCategories();
  const [slidesPerView, setSlidesPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesPerView(1);
      else if (width < 768) setSlidesPerView(2);
      else if (width < 1024) setSlidesPerView(3);
      else setSlidesPerView(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: categories.length > slidesPerView,
    speed: 800,
    cssEase: "ease-in-out",
    slidesToShow: slidesPerView,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: slidesPerView > 1,
    pauseOnHover: true,
  };

  if (loading) return <LoaderPage />;
  if (error)
    return (
      <p className="text-center py-10 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
        {t("categorySlider.error")}
      </p>
    );

  return (
    <div className="relative py-16 bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)] px-4 sm:px-8 lg:px-16 xl:px-24 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="paw-print absolute top-10 left-10 text-6xl">🐾</div>
        <div className="paw-print absolute top-40 right-16 text-5xl">🐾</div>
        <div className="paw-print absolute bottom-20 left-1/4 text-7xl">🐾</div>
        <div className="paw-print absolute bottom-10 right-32 text-6xl">🐾</div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <h2 className="font-['Playfair_Display'] text-[#A88F7B] dark:text-[var(--color-dark-accent)] uppercase tracking-widest font-semibold text-xl md:text-3xl text-center mb-10 transition-colors duration-300">
          {t("categorySlider.title")}
        </h2>

        <div className="category-slider-wrapper">
          <Slider {...settings}>
            {categories.map((category) => (
              <div
                key={category._id}
                className="px-2 sm:px-4 py-4 animate-[fadeInUp_0.7s_ease] transform"
              >
                <div
                  className="
                    bg-gradient-to-br
                    from-[#E8DED7]
                    to-[#D0C2B9]
                    dark:from-[var(--color-dark-card)]
                    dark:to-[var(--color-dark-background)]
                    rounded-3xl
                    shadow-[0_6px_25px_rgba(0,0,0,0.08)]
                    dark:shadow-[0_6px_25px_rgba(0,0,0,0.3)]
                    overflow-hidden
                    transition-all
                    duration-500
                    cursor-pointer
                    hover:-translate-y-3
                    hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)]
                    dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]
                    relative
                    group
                    h-full
                  "
                  onClick={() =>
                    navigate(
                      `/products?category=${encodeURIComponent(category.name)}`,
                    )
                  }
                >
                  <div
                    className="
                      absolute -top-6 -right-6 
                      w-24 h-24 
                      bg-[#CAB7A5] 
                      dark:bg-[var(--color-dark-accent)]/20
                      rounded-full 
                      blur-xl
                      opacity-40
                      transition-colors duration-300
                    "
                  ></div>

                  <span className="absolute top-3 right-4 opacity-30 text-[28px] group-hover:opacity-50 transition">
                    🐾
                  </span>

                  <div className="h-64 overflow-hidden rounded-t-3xl">
                    <img
                      src={category.image.secure_url}
                      alt={category.name}
                      className="
                        h-full 
                        w-full 
                        object-cover 
                        group-hover:scale-110 
                        transition 
                        duration-700
                      "
                    />
                  </div>

                  <div className="py-6 px-4 text-center">
                    <p className="font-['Playfair_Display'] text-xl font-bold text-[#7C6657] dark:text-[var(--color-dark-text)] transition-colors duration-300">
                      {category.name}
                    </p>

                    <p className="text-sm text-[#8F7A6F] dark:text-gray-400 mt-2 tracking-wide transition-colors duration-300">
                      {t("categorySlider.explore")}{" "}
                      {category.name.toLowerCase()}
                    </p>
                  </div>

                  <span className="absolute bottom-4 left-6 text-[22px] opacity-20">
                    🐾
                  </span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
