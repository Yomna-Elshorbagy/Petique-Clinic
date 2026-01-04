import React from "react";
import ReactECharts from "echarts-for-react";
import { COLORS } from "../Shared/Colors";
import { useTopVaccinatedCategories } from "../../../../Hooks/Reservation/useanalytics";
import type { TopCategory } from "../../../../Hooks/Reservation/Ianalysis";

const TopVaccinatedCategoriesChart: React.FC = () => {
  const { data } = useTopVaccinatedCategories();

  const option = {
    tooltip: { trigger: "axis" },
    grid: {
      left: "10%",
      right: "5%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        color: COLORS.textDark,
        rotate: 30,
      },
      data: data?.data.map((c: TopCategory) => c._id.name) ?? [],
    },
    yAxis: {
      type: "value",
      axisLabel: { color: COLORS.textDark },
    },
    series: [
      {
        name: "Vaccinations",
        type: "bar",
        barWidth: "45%",
        data: data?.data.map((c: TopCategory) => c.total) ?? [],
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: COLORS.primary,
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#3E2C1C]">
        Top Vaccinated Categories
      </h3>

      <ReactECharts option={option} style={{ height: 340 }} />
    </div>
  );
};

export default TopVaccinatedCategoriesChart;
