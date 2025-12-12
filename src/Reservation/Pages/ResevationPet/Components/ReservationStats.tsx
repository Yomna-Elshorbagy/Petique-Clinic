import React from "react";

import { CalendarIcon, ClockIcon, CheckIcon, XCircleIcon } from "lucide-react";
import StatCard from "../../Vaccination/Components/StatCard";
import { useReservationsByStatus, useTodayReservations, useUpcomingReservations } from "../../../../Hooks/Reservation/useReservation";

const ReservationStats: React.FC = () => {
  const { data: today } = useTodayReservations();
  const { data: upcoming } = useUpcomingReservations();
  const { data: completed } = useReservationsByStatus("completed");
  const { data: cancelled } = useReservationsByStatus("cancelled");

  const stats = [
    {
      title: "Total Today",
      value: today?.length ?? 0,
      icon: <CalendarIcon size={22} />,
      bgColor: "#F7F3ED",
      iconBg: "#E9DCCF",
    },
    {
      title: "Upcoming",
      value: upcoming?.length ?? 0,
      icon: <ClockIcon size={22} />,
      bgColor: "#F8EFE9",
      iconBg: "#E0B9A5",
    },
    {
      title: "Completed",
      value: completed?.length ?? 0,
      icon: <CheckIcon size={22} />,
      bgColor: "#EDF4ED",
      iconBg: "#C9DAB3",
    },
    {
      title: "Cancelled",
      value: cancelled?.length ?? 0,
      icon: <XCircleIcon size={22} />,
      bgColor: "#F9E8E8",
      iconBg: "#E8A0A0",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((item, i) => (
        <StatCard key={i} {...item} delay={i * 0.1} />
      ))}
    </div>
  );
};

export default ReservationStats;
