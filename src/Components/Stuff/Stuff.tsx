import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { RxTwitterLogo } from "react-icons/rx";
import { useAllDoctors } from "../../Hooks/Doctor/useDoctor";
import type { IUser } from "../../Interfaces/IUser";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Stuff() {
  const { data: doctorsData, isLoading, isError } = useAllDoctors();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <section className="py-20 bg-[#FAF8F4] text-center">
        <p className="text-xl font-semibold">{t("stuff.loading")}</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-20 bg-[#FAF8F4] text-center text-red-500">
        {t("stuff.error")}
      </section>
    );
  }

  const doctors = doctorsData || [];

  return (
    <motion.section
      className="py-20 bg-[#FAF8F4]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto text-center mb-12"
      >
        <p className="text-(--color-light-accent) font-bold flex justify-center items-center gap-2 mb-2 text-2xl">
          {t("stuff.subtitle")} <span>🐾</span>
        </p>

        <h2 className="text-4xl font-bold text-(--color-light-dark)">
          {t("stuff.title")}
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
        {doctors.slice(0, 3).map((doctor: IUser, index: number) => (
          <motion.div
            key={doctor._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative group rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={doctor.image?.secure_url}
              alt={doctor.userName}
              className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-(--color-extra-4)/70 text-white p-4 flex flex-col gap-2 transition-all duration-300 group-hover:translate-y-0 translate-y-full">
              <h3 className="text-xl font-bold">{doctor.userName}</h3>
              <p className="text-sm">{doctor.doctorSpecialist}</p>

              <div className="flex gap-3 mt-2">
                <FaFacebookF className="w-6 h-6 cursor-pointer hover:text-(--color-light-accent)" />
                <RxTwitterLogo className="w-6 h-6 cursor-pointer hover:text-(--color-light-accent)" />
                <FaInstagram className="w-6 h-6 cursor-pointer hover:text-(--color-light-accent)" />
                <FaLinkedin className="w-6 h-6 cursor-pointer hover:text-(--color-light-accent)" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
