import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => {
  return (
    <div className="bg-white dark:bg-[var(--color-dark-card)] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] mt-2">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
          <Icon className="text-lg" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
