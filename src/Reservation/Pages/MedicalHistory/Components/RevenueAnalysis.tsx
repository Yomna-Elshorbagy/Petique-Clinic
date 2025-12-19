import React from "react";
import ReactECharts from "echarts-for-react";
import { useRevenueAnalysis } from "../../../../Hooks/Reservation/useanalytics";
import { COLORS } from "../Shared/Colors";

interface MonthlyRevenue {
  month: number;
  totalRevenue: number;
  totalReservations: number;
}

// ===> Map month numbers to names
const MONTH_NAMES = [
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
const barColors = [
  COLORS.primary,
  COLORS.success,
  COLORS.secondary,
  COLORS.accent,
  COLORS.warning,
];

const ReservationRevenueChart: React.FC = () => {
  const { data } = useRevenueAnalysis();

  const sortedData = (data?.data ?? []).sort(
    (a: MonthlyRevenue, b: MonthlyRevenue) => a.month - b.month
  );

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const param = params[0];
        return `${MONTH_NAMES[param.dataIndex]}: $${param.value}`;
      },
    },
    xAxis: {
      type: "category",
      data: sortedData.map((d: any) => MONTH_NAMES[d.month - 1]),
      axisLabel: { color: COLORS.textDark },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: COLORS.textDark },
    },
    series: [
      {
        name: "Revenue",
        type: "bar",
        barWidth: "40%",
        data: sortedData.map((d: MonthlyRevenue, i: number) => ({
          value: d.totalRevenue ?? 0,
          itemStyle: {
            color: barColors[i % barColors.length],
            borderRadius: [8, 8, 0, 0],
          },
        })),
      },
    ],
  };

  return (
    <div className="rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#3E2C1C]">
        Monthly Revenue Analysis
      </h3>

      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
};

export default ReservationRevenueChart;
