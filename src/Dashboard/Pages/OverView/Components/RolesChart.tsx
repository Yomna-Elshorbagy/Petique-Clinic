import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useDemographics } from "../../../../Hooks/OverView/useAnalytics";

const RolesBarChart: React.FC = () => {
  const { data, isLoading } = useDemographics();

  const chartData = useMemo(() => {
    if (!data?.data?.roles) return [];
    return Object.entries(data.data.roles).map(([key, value]) => ({
      name: key,
      value,
    }));
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (chartData.length === 0) return <div>No role data</div>;

  const styles = getComputedStyle(document.documentElement);
  const accentColor =
    styles.getPropertyValue("--color-light-accent").trim() || "#6366F1";
  const darkColor =
    styles.getPropertyValue("--color-light-dark").trim() || "#1f2937";

  const option = {
    tooltip: { trigger: "axis" },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: chartData.map((d) => d.name),
      axisLine: { lineStyle: { color: darkColor } },
      axisLabel: { color: darkColor },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: darkColor } },
      axisLabel: { color: darkColor },
      splitLine: {
        lineStyle: { type: "dashed", color: "#e5e7eb" },
      },
    },
    series: [
      {
        type: "bar",
        data: chartData.map((d) => d.value),
        barWidth: "50%",
        itemStyle: {
          color: accentColor,
          borderRadius: [6, 6, 0, 0],
        },
      },
    ],
  };

  return (
    <div className="w-full h-90 bg-white dark:bg-(--color-dark-card) p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-4">Roles Distribution</h3>
      <ReactECharts option={option} style={{ height: "90%" }} />
    </div>
  );
};

export default RolesBarChart;
