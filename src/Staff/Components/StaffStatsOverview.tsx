import React from "react";
import { FiCalendar } from "react-icons/fi";
import { FaPaw, FaUserMd, FaSyringe } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAllDoctors } from "../../Hooks/Doctor/useDoctor";
import {
  useStaffPetOwners,
  useStaffTodayReservations,
  useStaffVaccinationOverview,
} from "../../Hooks/Staff/useStaff";
import type { IUser } from "../../Interfaces/IUser";

interface LocalStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string | React.ReactNode;
  subStats?: { label: string; value: number | string; color?: string }[];
  color: string;
  delay?: number;
}

const LocalStatCard: React.FC<LocalStatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  subStats,
  color,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-[var(--color-dark-card)] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow h-full flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] mt-1">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
          <Icon size={20} />
        </div>
      </div>

      <div>
        {description && (
          <div className="text-xs text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] mb-2">
            {description}
          </div>
        )}
        {subStats && subStats.length > 0 && (
          <div className="flex gap-4 mt-2 pt-2 border-t border-gray-50 dark:border-gray-800">
            {subStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  {stat.label}
                </span>
                <span
                  className={`text-sm font-bold ${
                    stat.color || "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StaffStatsOverview: React.FC = () => {
  const { data: doctorsData } = useAllDoctors();
  const { data: petOwnersData } = useStaffPetOwners();
  const { data: vaccinationsOverview } = useStaffVaccinationOverview();
  const { data: todayReservations } = useStaffTodayReservations();

  // 1. Today's Appointments
  const totalToday = Array.isArray(todayReservations)
    ? todayReservations.length
    : 0;
  const completedToday = Array.isArray(todayReservations)
    ? todayReservations.filter((r: any) => r.status === "completed").length
    : 0;
  const remainingToday = totalToday - completedToday;

  // 2. Active Users (Pet Owners where isActive: true)
  const verifiedOwners = Array.isArray(petOwnersData)
    ? petOwnersData.filter((user: IUser) => user.isVerified === true).length
    : 0;
  const activeOwners = Array.isArray(petOwnersData)
    ? petOwnersData.filter((user: IUser) => user.isActive === true).length
    : 0;
  // 3. Active Doctors
  const activeDoctors = Array.isArray(doctorsData) ? doctorsData.length : 0;

  // 4. Pending Vaccinations (from overview)
  const pendingVaccines = Array.isArray(vaccinationsOverview)
    ? vaccinationsOverview.filter((v: any) => v.status === "scheduled").length
    : 0;
  // Vaccinations
  const totalVaccines = Array.isArray(vaccinationsOverview)
    ? vaccinationsOverview.length
    : 0;

  const stats = [
    {
      title: "Today's Appointments",
      value: totalToday,
      icon: FiCalendar,
      color: "bg-[#b6825e]",
      description: (
        <span className="text-green-600">↑ All Doctors Appointments Today</span>
      ),
      subStats: [
        { label: "Completed", value: completedToday, color: "text-green-600" },
        { label: "Remaining", value: remainingToday, color: "text-[#b6825e]" },
      ],
      delay: 0,
    },
    {
      title: "Verified Users",
      value: verifiedOwners,
      icon: FaPaw,
      color: "bg-[#d28b71]",
      description: <span className="text-green-600">↑ All Verified Users</span>,
      subStats: [
        { label: "Role", value: "Pet Owners" },
        { label: "Active", value: activeOwners, color: "text-green-600" },
      ],
      delay: 0.1,
    },
    {
      title: "Active Doctors",
      value: activeDoctors,
      icon: FaUserMd,
      color: "bg-[#7ca87a]",
      description: "Doctors in Different Specialists",
      delay: 0.2,
    },
    {
      title: "Total Pet Vaccines",
      value: totalVaccines,
      icon: FaSyringe,
      color: "bg-[#4f8fd8]",
      description: <span className="text-green-600">Pending in Clinic</span>,
      subStats: [
        { label: "Vaccines", value: pendingVaccines, color: "text-blue-500" },
        { label: "Status", value: "Pending" },
      ],
      delay: 0.3,
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((item, i) => (
        <LocalStatCard
          key={i}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
          description={item.description}
          subStats={item.subStats}
          delay={item.delay}
        />
      ))}
    </div>
  );
};

export default StaffStatsOverview;
