import { motion } from "framer-motion";
import { Sparkles, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Banner() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#f5efe9] rounded-2xl p-4 mb-8 flex items-center gap-4 border border-[#e8d8c4]/50 overflow-hidden relative"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
          repeatDelay: 2,
        }}
      />
      <div className="bg-[#e9a66f]/20 p-2.5 rounded-full text-[#e9a66f]">
        <Stethoscope className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-[#4f3f36] flex items-center gap-2">
          {t("cart.freeConsultation")}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="w-4 h-4 text-[#e9a66f]" />
          </motion.div>
        </h3>
        <p className="text-sm text-[#7a7067]">{t("cart.consultationDesc")}</p>
      </div>
    </motion.div>
  );
}
