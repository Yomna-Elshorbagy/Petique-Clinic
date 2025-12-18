import React from "react";
import ReactECharts from "echarts-for-react";
import { useRevenueAnalysis } from "../../../../Hooks/Reservation/useanalytics";
import { COLORS } from "../Shared/Colors";

const RevenueChart: React.FC = () => {
  const { data } = useRevenueAnalysis();

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: "Revenue: {c}",
    },
    xAxis: {
      type: "category",
      data: ["Total Revenue"],
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
        data: [data?.data.totalRevenue ?? 0],
        itemStyle: {
          color: COLORS.success,
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#3E2C1C]">
        Revenue Analysis
      </h3>

      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
};

export default RevenueChart;
