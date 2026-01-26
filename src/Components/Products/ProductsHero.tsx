import { useEffect, useRef } from "react";
import { Bone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import catImg from "../../assets/images/pic-2.png";

const ProductsHero: React.FC = () => {
  const boneRef = useRef<SVGSVGElement | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (boneRef.current) {
      gsap.to(boneRef.current, {
        y: -10,
        x: 10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div
      dir={i18n.dir()}
      className="relative bg-[#86654f] dark:bg-[var(--color-dark-card)] h-auto px-10 py-10 overflow-visible flex flex-col md:flex-row items-center font-serif"
    >
      <div className="max-w-7xl text-center md:text-start md:ps-24">
        <Bone
          ref={boneRef}
          className="
            w-25 h-30
            text-white 
            mx-auto md:mx-0
          "
          strokeWidth={2.5}
          color="#fde5d3"
        />

        <h1 className="text-white text-4xl font-extrabold mt-4">
          {t("productsHero.title")}
        </h1>

        {/* Breadcrumb */}
        <div className="mt-8 flex justify-center md:justify-start gap-4 border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] font-medium text-lg">
          <Link to="/" className="hover:text-white transition-colors">
            {t("breadcrumbs.home")}
          </Link>

          <span className="border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
            {i18n.dir() === "rtl" ? "<" : ">"}
          </span>

          <p className="text-white font-semibold">
            {t("breadcrumbs.shop")}
          </p>
        </div>
      </div>

      <img
        src={catImg}
        alt={t("productsHero.imageAlt")}
        className="hidden md:block absolute md:end-1 md:bottom-[-90px] w-[600px] z-10"
      />
    </div>
  );
};

export default ProductsHero;
