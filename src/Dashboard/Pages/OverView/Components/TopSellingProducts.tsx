import ReactECharts from "echarts-for-react";
import { useTopSellingProducts } from "../../../../Hooks/OverView/useAnalytics";

export default function TopSellingProductsChart() {
  const { data, isLoading } = useTopSellingProducts();

  if (isLoading) return <p>Loading...</p>;
  if (!data?.length) return <p>No top selling products</p>;
  const cssVar = (name: string, fallback: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback;

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
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
    yAxis: {
      type: "category",
      data: data.map((item: any) => item.title),
      axisLabel: {
        color: cssVar("--color-text-muted", "#9a8c81"),
      },
      axisLine: {
        lineStyle: {
          color: cssVar("--color-border-light", "#e6ddd3"),
        },
      },
    },
    series: [
      {
        name: "Units Sold",
        type: "bar",
        data: data.map((item: any) => item.totalSold),
        barWidth: 18,
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: cssVar("--color-accent-dark", "#d69560"),
        },
      },
    ],
  };

  return (
    <div className="w-full h-[340px] bg-[var(--color-bg-light)] rounded-2xl p-4">
      <h2 className="text-xl font-semibold text-center mb-3">
        🏆 Top-Selling Products
      </h2>

      <ReactECharts option={option} style={{ height: "100%" }} />
    </div>
  );
}
