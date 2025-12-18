import React from "react";
import { COLORS } from "./Colors";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div
      className="rounded-2xl p-6 shadow-sm flex items-center justify-between"
      style={{ backgroundColor: COLORS.surface }}
    >
      <div>
        <p className="text-sm font-medium text-[#6F4E37]">{title}</p>
        <p className="text-3xl font-bold text-[#3E2C1C]">{value}</p>
      </div>

      {icon && (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: COLORS.primary, color: COLORS.textLight }}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
