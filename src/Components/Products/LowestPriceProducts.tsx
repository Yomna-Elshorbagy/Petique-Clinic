import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import LoaderPage from "../../Shared/LoaderPage/LoaderPage";
import type { IProduct } from "../../Interfaces/IProducts";
import { getAllProducts } from "../../Apis/ProductApis";

const LowestPriceProducts: React.FC = () => {
  const navigate = useNavigate();
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
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative py-20 bg-[#FAF8F4] px-4 sm:px-6 lg:px-24 overflow-hidden"
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

      {/* Section Header with fade-in animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12 relative z-10"
      >
        <h2 className="font-['Playfair_Display'] text-[#6c5136] uppercase tracking-widest font-semibold text-xl md:text-3xl mb-4">
          Best Value Products
        </h2>
        <p className="text-[#8A7A67] text-sm md:text-base max-w-2xl mx-auto">
          Discover our lowest-priced premium products for your beloved pets
        </p>
      </motion.div>

      {/* Products Grid */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Shop Now Button */}
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
            <span>Shop Now</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default LowestPriceProducts;

