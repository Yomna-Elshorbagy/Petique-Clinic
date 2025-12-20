import ReactECharts from "echarts-for-react";
import { useOrdersDistribution } from "../../../../Hooks/OverView/useAnalytics";

export default function OrdersDistributionChart() {
  const { data, isLoading } = useOrdersDistribution();

  if (isLoading) return <p>Loading...</p>;
  if (!data?.length) return <p>No orders data</p>;
  const cssVar = (name: string, fallback: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback;

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
      left: "4%",
      right: "4%",
      bottom: "4%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item: any) => item.status),
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
        data: data.map((item: any) => item.count),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: cssVar("--color-success", "#4caf50"),
        },
        itemStyle: {
          color: cssVar("--color-success", "#4caf50"),
        },
        areaStyle: {
          color: cssVar("--color-success-light", "#c8e6c9"),
          opacity: 0.35,
        },
      },
    ],
  };

  return (
    <div className="w-full h-[320px] bg-[var(--color-bg-light)] rounded-2xl p-4">
      <h2 className="text-xl font-semibold text-center mb-3">
        📦 Orders Distribution
      </h2>

      <ReactECharts option={option} style={{ height: "100%" }} />
    </div>
  );
}
