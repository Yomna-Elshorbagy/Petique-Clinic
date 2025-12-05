import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import type { IProduct } from "../../Interfaces/IProducts";
import { getAllProducts } from "../../Apis/ProductApis";

const LowestPriceProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowestPriceProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
       
        const response = await getAllProducts(1, 50);

        if (response.data && Array.isArray(response.data)) {
          // Filter out products without valid prices, sort by finalPrice (lowest first), and take first 8
          const sortedProducts = [...response.data]
            .filter((product) => {
              const price = product.finalPrice ?? product.price;
              return price != null && price > 0;
            })
            .sort((a, b) => {
              const priceA = a.finalPrice ?? a.price;
              const priceB = b.finalPrice ?? b.price;
              return priceA - priceB;
            })
            .slice(0, 8);
          
          setProducts(sortedProducts);
        } else {
          setProducts([]);
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load products"
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLowestPriceProducts();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    cssEase: "ease-in-out",
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <LoaderPage />;
  }

  if (error) {
    return (
      <div className="py-20 bg-[#FAF8F4] px-4 sm:px-6 lg:px-24">
        <div className="text-center text-stone-600">
          <p className="text-lg font-medium">Error loading products</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative py-20 bg-[#FAF8F4] px-4 sm:px-6 lg:px-24 overflow-hidden">
      {/* Decorative paw prints */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="paw-print absolute top-10 left-10 text-6xl">🐾</div>
        <div className="paw-print absolute top-40 right-16 text-5xl">🐾</div>
        <div className="paw-print absolute bottom-20 left-1/4 text-7xl">🐾</div>
        <div className="paw-print absolute bottom-10 right-32 text-6xl">🐾</div>
      </div>

      {/* Section Header */}
      <div className="text-center mb-12 relative z-10">
        <h2 className="font-['Playfair_Display'] text-[#A88F7B] uppercase tracking-widest font-semibold text-xl md:text-3xl mb-4">
          Best Value Products
        </h2>
        <p className="text-stone-600 text-sm md:text-base max-w-2xl mx-auto">
          Discover our lowest-priced premium products for your beloved pets
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative z-10">
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <div key={product._id} className="px-4 animate-[fadeInUp_0.7s_ease] transform">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>

    <div className="text-center mt-20 relative z-10">
      <button
        onClick={() => window.location.href = '/products'}
        className="px-8 py-3 bg-[#A88F7B] text-white font-semibold rounded-lg hover:bg-[#8B7863] transition-colors duration-300 shadow-md hover:shadow-lg"
      >
        Shop Now
      </button>
    </div>

      {/* Custom Slider Styles */}
      <style>{`
        .slick-dots {
          bottom: -50px;
        }
        .slick-dots li button:before {
          color: #A88F7B;
          font-size: 12px;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          color: #A88F7B;
          opacity: 1;
        }
        .slick-prev,
        .slick-next {
          z-index: 10;
        }
        .slick-prev:before,
        .slick-next:before {
          color: #A88F7B;
          font-size: 30px;
        }
        .slick-prev {
          left: -40px;
        }
        .slick-next {
          right: -40px;
        }
        @media (max-width: 1024px) {
          .slick-prev {
            left: -20px;
          }
          .slick-next {
            right: -20px;
          }
        }
        @media (max-width: 640px) {
          .slick-prev,
          .slick-next {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LowestPriceProducts;

