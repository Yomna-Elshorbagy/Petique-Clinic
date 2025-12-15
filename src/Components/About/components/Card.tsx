import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPaw } from 'react-icons/fa';
import { useTranslation } from "react-i18next";

export default function Card() {
    const { t } = useTranslation();
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = 1980;
        const duration = 2000;
        const step = 50;

        const stepsCount = Math.ceil(end / step);
        const stepTime = duration / stepsCount;

        const timer = setInterval(() => {
            start += step;

            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, []);
    return (
        <>
            {/* card */}
            <motion.div className="bg-(--color-light-background) p-6 rounded-lg shadow-md flex items-start justify-between group" whileHover="hover">
                <div className="max-w-[80%]">
                    <p className="text-(--color-light-dark) font-bold font-['Playfair_Display']">{t("about.card.title")}</p>
                    <p className="text-2xl font-bold text-(--color-light-accent) font-['Playfair_Display']">{count}+</p>
                    <p className="text-(--color-light-textSecondary) text-sm font-['Playfair_Display']">
                        {t("about.card.description")}
                    </p>
                </div>
                <motion.div
                    variants={{
                        hover: {
                            y: [-5, -15, -5],
                            scale: [1, 1.1, 1],
                            transition: { duration: 0.6, ease: "easeInOut" }
                        }
                    }}
                    className="w-12 h-12 rounded-full bg-(--color-light-dark) flex items-center justify-center text-(--color-light-accent) cursor-pointer group-hover:bg-(--color-light-accent)"
                >
                    <FaPaw className="text-2xl group-hover:text-(--color-light-background)" />
                </motion.div>
            </motion.div>
        </>
    )
}
