import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconBg,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-3xl p-6 shadow-sm flex items-center gap-5 cursor-pointer"
      style={{ background: bgColor }}
      whileHover={{ scale: 1.02 }}
    >
      <div
        className="p-4 rounded-2xl flex items-center justify-center"
        style={{ background: iconBg }}
      >
        {icon}
      </div>

      <div className="flex flex-col">
        <span className="text-gray-600 text-sm font-medium">{title}</span>

        <motion.span
          className="text-3xl font-semibold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.2 }}
        >
          {value}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default StatCard;
