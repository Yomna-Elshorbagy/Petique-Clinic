import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaPaw } from 'react-icons/fa';

export default function AboutHeader() {
    const { t } = useTranslation();
    return (
        <div className='flex self-start gap-3 relative'>
            <p className="font-bold text-2xl text-(--color-light-accent) font-['Playfair_Display']">{t("about.badge")}</p>
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <FaPaw className="w-6 h-6 text-(--color-light-dark)" />
            </motion.div>
        </div>
    )
}
