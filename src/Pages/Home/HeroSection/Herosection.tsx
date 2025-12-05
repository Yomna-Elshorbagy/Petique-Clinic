import React from "react";
import { motion } from "framer-motion";
import { FaPaw } from "react-icons/fa";

const HeroSection = () => {
  // Grid configuration for the image reveal
  const rows = 6;
  const cols = 10;
  const totalTiles = rows * cols;

  // Generate array of tiles
  const tiles = Array.from({ length: totalTiles }, (_, i) => i);

  return (
    <div className="relative w-full h-[90vh] md:h-screen overflow-hidden flex items-center">
      {/* Grid Image Reveal Container */}
      <div
        className="absolute inset-0 grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {tiles.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{
              opacity: 1,
              scale: 1,
              borderWidth: 0,
            }}
            transition={{
              duration: 1.5,
              delay: (index % cols) * 0.07 + Math.floor(index / cols) * 0.07,
              ease: "easeOut",
            }}
            className="w-full h-full relative border-2 border-white/60"
          >
            <div
              className="absolute inset-0 w-[100vw] h-[90vh] md:h-screen"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=2000&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",

                left: `-${(index % cols) * (100 / cols)}vw`,
                top: `-${Math.floor(index / cols) * (90 / rows)}vh`,
                width: "100vw",
                height: "90vh",
              }}
            />

           
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="bg-[var(--color-light-accent)] text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              Welcome to Petique <FaPaw />
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              Taking Care of
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0 }}
            >
              <span className="text-[var(--color-light-accent)]">Pets</span> as
              if they
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              were Our Own
            </motion.div>
          </h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="text-lg text-gray-200 mb-10 max-w-lg leading-relaxed"
          >
            We provide the best medical services for your beloved pets. From
            grooming to surgeries, we have everything your furry friend needs.
          </motion.p>

          {/* Button */}
          {/* <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.5, delay: 2.8 }}
            className="bg-[var(--color-light-accent)] hover:bg-[#d69560] text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-3 transition-all"
          >
            CONTACT US <FaPaw />
          </motion.button> */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
