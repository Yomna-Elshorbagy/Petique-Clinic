import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import { useCategories } from "../../Hooks/Categories/useCategories";

export default function CategorySlider() {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    cssEase: "ease-in-out",
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) return <LoaderPage />;
  if (error) return <p className="text-center py-10">Error loading categories</p>;

  return (
    <div className="relative py-20 bg-[#FAF8F4] px-4 sm:px-6 lg:px-24 overflow-hidden">

      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="paw-print absolute top-10 left-10 text-6xl">🐾</div>
        <div className="paw-print absolute top-40 right-16 text-5xl">🐾</div>
        <div className="paw-print absolute bottom-20 left-1/4 text-7xl">🐾</div>
        <div className="paw-print absolute bottom-10 right-32 text-6xl">🐾</div>
      </div>

      <h2 className="font-['Playfair_Display'] text-[#A88F7B] uppercase tracking-widest font-semibold text-xl md:text-3xl text-center mb-14">
        Shop Popular Categories
      </h2>

      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category._id} className="px-4 animate-[fadeInUp_0.7s_ease] transform">
            <div
              className="
                bg-gradient-to-br
                from-[#E8DED7]
                to-[#D0C2B9]
                rounded-3xl
                shadow-[0_6px_25px_rgba(0,0,0,0.08)]
                overflow-hidden
                transition-all
                duration-500
                cursor-pointer
                hover:-translate-y-3
                hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)]
                relative
                group
              "
              onClick={() =>
                navigate(`/products?category=${encodeURIComponent(category.name)}`)
              }
            >
              <div
                className="
                  absolute -top-6 -right-6 
                  w-24 h-24 
                  bg-[#CAB7A5] 
                  rounded-full 
                  blur-xl
                  opacity-40
                "
              ></div>

              <span className="absolute top-3 right-4 opacity-30 text-[28px] group-hover:opacity-50 transition">
                🐾
              </span>

              <img
                src={category.image.secure_url}
                alt={category.name}
                className="
                  h-64 
                  w-full 
                  object-cover 
                  rounded-t-3xl 
                  group-hover:scale-105 
                  transition 
                  duration-500
                "
              />

              <div className="py-5 text-center">
                <p className="font-['Playfair_Display'] text-xl font-semibold text-[#7C6657]">
                  {category.name}
                </p>

                <p className="text-sm text-[#8F7A6F] mt-1 tracking-wide">
                  Explore all {category.name.toLowerCase()} care
                </p>
              </div>

              <span className="absolute bottom-4 left-6 text-[22px] opacity-20">🐾</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
