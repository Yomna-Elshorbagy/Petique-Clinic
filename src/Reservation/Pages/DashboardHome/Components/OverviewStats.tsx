import React from "react";
import { FiCalendar } from "react-icons/fi";
import { FaPaw, FaUserMd, FaSyringe } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAllDoctors } from "../../../../Hooks/Doctor/useDoctor";
import { useAllPets } from "../../../../Hooks/Pets/UsePets";
import { useVaccinations } from "../../../../Hooks/Vaccinations/useVaccinations";
import { useTodayReservations } from "../../../../Hooks/Reservation/useReservation";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  percentage: string;
  data?: string;
  isPositive?: boolean;
  bgColor: string;
  iconBg: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  percentage,
  data,
  isPositive = true,
  bgColor,
  iconBg,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl p-6 shadow-sm flex flex-col gap-3 w-full cursor-pointer"
      style={{ background: bgColor }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div
          className="p-3 rounded-xl text-white"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>

      <motion.div
        className="text-4xl font-bold text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.4 }}
      >
        {value}
      </motion.div>

      {percentage && (
        <div
          className={`text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {percentage} from last week
        </div>
      )}

      {data && (
        <div
          className={`text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {data}
        </div>
      )}
    </motion.div>
  );
};

const OverviewStats: React.FC = () => {
  const { data: doctorsData, isLoading: loadingDoctors } = useAllDoctors();
  const { data: petsData, isLoading: loadingPets } = useAllPets();
  const { data: vaccinesData, isLoading: loadingVaccines } = useVaccinations();
  const { data: todayReservations, isLoading: loadingToday } =
    useTodayReservations();

  const doctorsCount = doctorsData?.length ?? 0;
  const petsCount = petsData?.length ?? 0;
  const vaccinesCount = vaccinesData?.length ?? 0;
  const todayAppointments = todayReservations?.length ?? 0;

  const stats = [
    {
      title: "Today's Appointments",
      value: loadingToday ? 0 : todayAppointments,
      percentage: "↑ 12%",
      isPositive: true,
      icon: <FiCalendar size={22} />,
      bgColor: "#f8f3ef",
      iconBg: "#b6825e",
      delay: 0,
    },
    {
      title: "Total Pets",
      value: loadingPets ? 0 : petsCount,
      percentage: "↑ 8%",
      isPositive: true,
      icon: <FaPaw size={22} />,
      bgColor: "#f7eee9",
      iconBg: "#d28b71",
      delay: 0.1,
    },
    {
      title: "Active Doctors",
      value: loadingDoctors ? 0 : doctorsCount,
      percentage: "",
      data: "Doctors in Different Specialists",
      isPositive: true,
      icon: <FaUserMd size={22} />,
      bgColor: "#ebf3ed",
      iconBg: "#7ca87a",
      delay: 0.2,
    },
    {
      title: "Total Vaccines",
      value: loadingVaccines ? 0 : vaccinesCount,
      percentage: "",
      data: "Available in Clinic",
      isPositive: true,
      icon: <FaSyringe size={22} />,
      bgColor: "#e7f1ff",
      iconBg: "#4a8fd1",
      delay: 0.3,
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item, i) => (
        <StatCard key={i} {...item} />
      ))}
    </div>
  );
};

export default OverviewStats;
