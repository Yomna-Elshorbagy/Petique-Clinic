import React from "react";
import ReactECharts from "echarts-for-react";
import { useMonthlyReservationsTrend } from "../../../../Hooks/Reservation/useanalytics";
import { COLORS } from "../Shared/Colors";
import type {
  MonthlyTrend,
} from "../../../../Hooks/Reservation/Ianalysis";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MonthlyReservationsTrendChart: React.FC = () => {
  const { data } = useMonthlyReservationsTrend();

  const option = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data:
        data?.data.map((m: MonthlyTrend) => MONTHS[m._id - 1]) ?? [],
      axisLabel: { color: COLORS.textDark },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: COLORS.textDark },
    },
    series: [
      {
        name: "Reservations",
        type: "line",
        smooth: true,
        data: data?.data.map((m: MonthlyTrend) => m.total) ?? [],
        itemStyle: { color: COLORS.primary },
        lineStyle: { width: 3 },
        areaStyle: {
          opacity: 0.15,
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#3E2C1C]">
        Monthly Reservations Trend
      </h3>
      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
};

export default MonthlyReservationsTrendChart;
