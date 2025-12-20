import ReactECharts from "echarts-for-react";
import { useDeletedUsersAnalysis } from "../../../../Hooks/OverView/useAnalytics";

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim() || fallback;

export default function DeletedUsersChart() {
  const { data, isLoading } = useDeletedUsersAnalysis();

  if (isLoading) return <p>Loading...</p>;
  if (!data?.history?.length) return <p>No deleted users data</p>;

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: cssVar("--color-bg-cream", "#f5f0ea"),
      borderColor: cssVar("--color-border-light", "#e6ddd3"),
      textStyle: {
        color: cssVar("--color-text-primary", "#3a2f27"),
      },
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.history.map((i) => i._id),
      axisLabel: {
        color: cssVar("--color-text-muted", "#9a8c81"),
      },
      axisLine: {
        lineStyle: {
          color: cssVar("--color-border-light", "#e6ddd3"),
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: cssVar("--color-text-muted", "#9a8c81"),
      },
      splitLine: {
        lineStyle: {
          color: cssVar("--color-border-light", "#e6ddd3"),
        },
      },
    },
    series: [
      {
        data: data.history.map((i) => i.count),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: cssVar("--color-accent-dark", "#d69560"),
        },
        itemStyle: {
          color: cssVar("--color-accent-dark", "#d69560"),
        },
        areaStyle: {
          color: cssVar("--color-accent-lighter", "#fde5d3"),
          opacity: 0.4,
        },
      },
    ],
  };

  return (
    <div className="w-full h-90 bg-white dark:bg-(--color-dark-card) p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-center mb-3">
        Deleted Users Over Time
      </h2>

      <ReactECharts option={option} style={{ height: "90%" }} />
    </div>
  );
}
