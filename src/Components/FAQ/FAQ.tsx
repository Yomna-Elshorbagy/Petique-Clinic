import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PawPrint, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import faqImage from "../../assets/images/faq-vet.jpg";
import styles from "./FAQ.module.css";

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = t("faq.items", { returnObjects: true }) as {
    question: string;
    answer: string;
  }[];

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.container}>
        <motion.div
          className={styles.leftColumn}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className={styles.subtitle}>
            {t("faq.subtitle")}
            <PawPrint size={18} className={styles.pawIcon} />
          </span>

          <h2 className={styles.title}>{t("faq.title")}</h2>

          <motion.div
            className={styles.imageWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.imageInner}>
              <img
                src={faqImage}
                alt={t("faq.imageAlt")}
                className={styles.faqImage}
              />
              <div className={styles.decorBadge}>
                <Heart size={14} /> {t("faq.badge")}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.rightColumn}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`${styles.accordionItem} ${
                openIndex === index ? styles.accordionItemOpen : ""
              }`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <button
                className={styles.accordionHeader}
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span className={styles.accordionNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.accordionQuestion}>
                  {faq.question}
                </span>
                <div
                  className={`${styles.accordionIcon} ${
                    openIndex === index ? styles.accordionIconOpen : ""
                  }`}
                >
                  <ChevronDown size={20} />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className={styles.accordionContent}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <p className={styles.accordionAnswer}>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
