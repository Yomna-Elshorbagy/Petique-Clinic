import { AlertCircleIcon, CheckIcon, ClockIcon } from "lucide-react";
import StatCard from "../../../../Shared/StateCard/StatCard";
import React from "react";
import { useVaccinationRecords } from "../../../../Hooks/Pets/UsePets";

interface StatItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  delay?: number;
}

const VaccinationStats: React.FC = () => {
  const { data: records, isLoading } = useVaccinationRecords();

  const completed =
    records?.filter((r: any) => r.status === "completed").length ?? 0;

  const scheduled =
    records?.filter((r: any) => r.status === "scheduled").length ?? 0;

  const overdue =
    records?.filter((r: any) => r.status === "overdue").length ?? 0;

  const statItems: StatItem[] = [
    {
      title: "Completed This Month",
      value: completed,
      icon: <CheckIcon size={20} />,
      bgColor: "#F2F6EB",
      iconBg: "#C9DAB3",
    },
    {
      title: "Scheduled",
      value: scheduled,
      icon: <ClockIcon size={20} />,
      bgColor: "#F8EFE9",
      iconBg: "#E0B9A5",
    },
    {
      title: "Overdue",
      value: overdue,
      icon: <AlertCircleIcon size={20} />,
      bgColor: "#F9E8E8",
      iconBg: "#E8A0A0",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {statItems.map((item, i) => (
        <StatCard key={i} {...item} delay={i * 0.1} />
      ))}
    </div>
  );
};

export default VaccinationStats;
