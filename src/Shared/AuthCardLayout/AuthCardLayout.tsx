import type { ReactNode } from "react";
import pet from "../../assets/images/dog.jpg";
import { motion } from "motion/react";

interface AuthCardLayoutProps {
  motionKey: string;
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export default function AuthCardLayout({ motionKey, leftContent, rightContent }: AuthCardLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${pet})`,
        }}
      />
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="paw-print absolute top-10 left-10 text-6xl">🐾</div>
      </div>

      <motion.div
        key={motionKey}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl border border-white/10"
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

        <div className="relative grid grid-cols-1 md:grid-cols-2">
          <div className="p-10 flex flex-col justify-center items-start">{leftContent}</div>
          <div className="p-10 bg-black/40">{rightContent}</div>
        </div>
      </motion.div>
    </div>
  );
}
