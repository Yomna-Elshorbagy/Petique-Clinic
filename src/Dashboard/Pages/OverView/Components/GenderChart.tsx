import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useDemographics } from "../../../../Hooks/OverView/useAnalytics";

const GenderPieChart: React.FC = () => {
  const { data, isLoading } = useDemographics();

  const chartData = useMemo(() => {
    if (!data?.data?.gender) return [];

    return Object.entries(data.data.gender).map(([key, value]) => ({
      name: key,
      value,
    }));
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (chartData.length === 0) return <p>No gender data</p>;

  const styles = getComputedStyle(document.documentElement);
  const extraColor =
    styles.getPropertyValue("--color-extra-6").trim() || "#3b82f6";
  const accentColor =
    styles.getPropertyValue("--color-light-accent").trim() || "#1f2937";

  const textColor =  styles.getPropertyValue("--color-light-textSecondary").trim() || "#3b82f6";

  const option = {
    tooltip: { trigger: "item" },
    legend: {
      bottom: 0,
      textStyle: { color: textColor },
    },
    series: [
      {
        type: "pie",
        radius: "70%",
        data: chartData,
        color: [extraColor, accentColor],
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(0,0,0,0.3)",
          },
        },
      },
    ],
  };

  return (
      <div className="w-full h-90 bg-white dark:bg-(--color-dark-card) p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
        <ReactECharts option={option} style={{ height: 280 }} />
      </div>
    );
};

export default GenderPieChart;
