import { motion } from "framer-motion";
import { FaPaw, FaDog, FaCat, FaDove } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import petTaxiImg from "../../../assets/images/homeReservation/PetTax.jpg";
import petGroomingImg from "../../../assets/images/homeReservation/PetGromming.jpg";
import petTrainingImg from "../../../assets/images/homeReservation/petTraining.jpg";
import dogServiceImg from "../../../assets/images/homeReservation/dogService.jpg";

const ServicesSection = () => {
  const { t } = useTranslation();

  const serviceCards = [
    {
      type: "card-top",
      title: t("servicesSection.petTaxiTitle"),
      description: t("servicesSection.petTaxiDesc"),
      icon: <FaDog className="w-10 h-10 text-[var(--color-light-accent)]" />,
      image: petTaxiImg,
      imagePos: "bottom",
    },
    {
      type: "card-bottom",
      title: t("servicesSection.petGroomingTitle"),
      description: t("servicesSection.petGroomingDesc"),
      icon: <FaCat className="w-10 h-10 text-[var(--color-light-accent)]" />,
      image: petGroomingImg,
      imagePos: "top",
    },
    {
      type: "card-top",
      title: t("servicesSection.petTrainingTitle"),
      description: t("servicesSection.petTrainingDesc"),
      icon: <FaDove className="w-10 h-10 text-[var(--color-light-accent)]" />,
      image: petTrainingImg,
      imagePos: "bottom",
    },
  ];

  return (
    <section className="relative py-20 bg-[#FAF8F4] overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ===> header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm mb-6"
          >
            <span className="text-[var(--color-light-accent)] font-bold text-sm tracking-wide">
              {t("servicesSection.ourService")}
            </span>
            <FaPaw className="text-[var(--color-light-accent)] text-xs" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-[#3d2e25] leading-tight max-w-3xl mx-auto"
          >
            {t("servicesSection.title")}
          </motion.h2>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-full overflow-hidden">
          {serviceCards.map((card, index) => (
            <div key={index} className="flex flex-col h-full gap-6">
              {/* ===> If Image is Top */}
              {card.imagePos === "top" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative h-64 w-full overflow-hidden shadow-lg rounded-t-[150px] max-w-full"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </motion.div>
              )}

              {/* ===> card content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                className={`flex-1 bg-white p-10 flex flex-col items-center text-center justify-center border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 group
                    ${
                      card.type === "card-top"
                        ? "rounded-t-[150px] border-b-4 border-b-[var(--color-light-accent)]"
                        : "rounded-b-[150px] border-t-4 border-t-[var(--color-light-accent)]"
                    }
                `}
              >
                <div className="mb-6 p-4 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors duration-300">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#3d2e25] mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {card.description}
                </p>
              </motion.div>

              {/* ===> if image is bottom */}
              {card.imagePos === "bottom" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  className="relative h-64 w-full overflow-hidden shadow-lg rounded-b-[150px] max-w-full"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* ===> view services button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <button className="bg-[var(--color-light-accent)] hover:bg-[#e09e60] text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto transition-all transform hover:-translate-y-1">
            {t("servicesSection.viewServices")} <FaPaw />
          </button>
        </motion.div>
      </div>

      {/* dog peeking image - Right Bottom */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-0 right-0 z-0 hidden lg:block"
      >
        <img
          src={dogServiceImg}
          alt="Happy Dog"
          className="w-[155px] h-auto object-contain"
        />
      </motion.div>
    </section>
  );
};

export default ServicesSection;
