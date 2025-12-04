import { motion } from "framer-motion";
import { PawPrint, QrCode, RefreshCw } from "lucide-react";
import { useQr } from "../../Hooks/QrCode/useQrcode";
import rabbitImg from "../../assets/images/shap-33.jpg";

export default function QrSection() {
  const { data, isLoading, isError, refetch } = useQr();

  return (
    <>
      <div className="w-full max-w-5xl mx-auto mt-16 mb-20 px-6 overflow-visible ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white p-8 rounded-3xl shadow-2xl border border-[#C58D52]/20 overflow-visible"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-4 right-4 opacity-20 pointer-events-none"
          >
            <PawPrint size={120} className="text-[#C58D52]" />
          </motion.div>

          <h2 className="text-3xl font-bold text-[#443935] flex items-center gap-3 mb-6">
            <QrCode className="text-[#C58D52]" />
            Quick Access QR
          </h2>

          <p className="text-[#7A6F69] mb-6 max-w-xl">
            Scan this QR to instantly access pet records, appointments, and fast
            check-in at our clinic.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-[#FCF9F4] p-4 rounded-2xl shadow-lg border border-[#C58D52]/20">
                {isLoading && (
                  <div className="w-40 h-40 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#C58D52] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {!isLoading && isError && (
                  <p className="text-red-500 w-40 text-center">
                    Failed to load QR.
                  </p>
                )}

                {!isLoading && data?.qrCode && (
                  <img
                    src={data.qrCode}
                    alt="QR Code"
                    className="w-40 h-40 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
                  />
                )}
              </div>

              <button
                onClick={() => refetch()}
                className="mt-4 flex items-center gap-2 text-[#C58D52] hover:text-[#A98868] transition"
              >
                <RefreshCw size={18} /> Refresh QR
              </button>
            </div>

            <div className="flex-1 text-[#443935] space-y-3">
              <h3 className="text-xl font-semibold">Why use this QR?</h3>

              <ul className="space-y-2 list-disc list-inside text-[#6D625E]">
                <li>Instant access to pet medical history</li>
                <li>Fast check-in at our clinic</li>
                <li>Secure & expires every hour</li>
                <li>No login required — scan & go</li>
              </ul>

              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm text-[#A98868]"
              >
                Auto-refreshes every hour.
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="relative">
        <motion.img
          src={rabbitImg}
          alt="Cute Rabbit"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-0 right-0 w-40 md:w-52 lg:w-60 pointer-events-none select-none"
          style={{ transform: "translateY(20px)" }}
        />
      </div>
    </>
  );
}
