import React from "react";
import { FaStethoscope, FaChartLine, FaCalendarCheck } from "react-icons/fa";
import StatCard from "../../../../Shared/StateCard/StatCard";

interface StatsProps {
  stats: {
    total: number;
    month: number;
    revenue: number;
  };
}

interface StatItem {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  delay?: number;
}

export default function StatsCards({ stats }: StatsProps) {
  const statItems: StatItem[] = [
    {
      title: "Total Services",
      value: stats.total,
      icon: <FaStethoscope size={20} />,
      bgColor: "#F2F6EB",
      iconBg: "#C9DAB3",
      delay: 0,
    },
    {
      title: "This Month",
      value: stats.month,
      icon: <FaCalendarCheck size={20} />,
      bgColor: "#F8EFE9",
      iconBg: "#E0B9A5",
      delay: 0.1,
    },
    {
      title: "Revenue",
      value: `$${(stats.revenue / 1000).toFixed(1)}k`,
      icon: <FaChartLine size={20} />,
      bgColor: "#F9E8E8",
      iconBg: "#E8A0A0",
      delay: 0.2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {statItems.map((item, i) => (
        <StatCard key={i} {...item} delay={item.delay} />
      ))}
    </div>
  );
}
