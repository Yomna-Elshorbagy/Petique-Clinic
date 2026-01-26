import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import styles from "./Quote.module.css";
import quoteImg from "../../assets/images/quote.jpg";

const Quote: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      className={`${styles.hero} flex items-center justify-center text-center`}
      style={{
        backgroundImage:
          `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${quoteImg})`,
      }}
    >
      <div className="px-4 max-w-3xl">
        <h2
          className={`${styles.heading} text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4`}
        >
          “{t("quote.text")}”
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Link to="/blog">
            <button className="bg-[#E5A85C] hover:bg-[#e09e60] text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto transition-all transform hover:-translate-y-1">
              {t("quote.button")} <FaPaw />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Quote;
