import bunny from "../../assets/images/shap-33.jpg";
import pet from "../../assets/images/pet3.jpg";
import AboutHeader from "./components/AboutHeader";
import Card from './components/Card';
import FeaturesList from "./components/FeaturesList";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

export default function About() {
    const { t } = useTranslation();
    const isRTL = i18n.language === "ar";
    return (
        <>
            <section className='relative px-6 py-20 bg-[var(--color-light-background)]'>

                <motion.img
                    src={bunny}
                    alt={t("about.images.bunnyAlt")}
                    initial={{ opacity: 0,  x: isRTL ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className={`absolute top-118 w-33 pointer-events-none hidden md:block
                        ${isRTL ? "-right-1" : "-left-1"}
                        `}
                />

                <div  className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center
                        ${isRTL ? "md:pr-35" : "md:pl-35"}
                    `}>
                    {/* about us column */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col space-y-4"
                    >
                        <AboutHeader />

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="font-bold text-(--color-light-dark) text-4xl font-['Playfair_Display']"
                        >
                            {t("about.title")}
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                        <Card />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <FeaturesList />
                        </motion.div>
                    </motion.div>

                    {/* RIGHT IMAGE */}
                    <motion.img
                        src={pet}
                        alt={t("about.images.petAlt")}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="rounded-xl shadow-lg w-3/4 h-4/5 mx-auto"
                    />
                </div>
            </section>
        </>
    );
}
