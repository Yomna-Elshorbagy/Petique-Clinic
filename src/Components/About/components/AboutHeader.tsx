import { motion } from "framer-motion";
import { FaPaw } from 'react-icons/fa';

export default function AboutHeader() {
    return (
        <div className='flex self-start gap-3 relative'>
            <p className="font-bold text-2xl text-(--color-light-accent) font-['Playfair_Display']">About Us</p>
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <FaPaw className="w-6 h-6 text-(--color-light-dark)" />
            </motion.div>
        </div>
    )
}
