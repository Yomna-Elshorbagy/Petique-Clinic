import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useRevenuePerMonth } from "../../../../Hooks/OverView/useAnalytics";

// ===> helper for month names
const months = [
  "",
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

export default function RevenueChart() {
  const { data: apiData, isLoading, error } = useRevenuePerMonth();

  const chartData = useMemo(() => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData
      .map((item: any) => {
        let year, month;

        if (item._id && typeof item._id === "object") {
          year = item._id.year;
          month = item._id.month;
        } else if (item.year && item.month) {
          year = item.year;
          month = item.month;
        }

        if (!year || !month) return null;

        return {
          label: `${months[month]} ${year}`,
          revenue: item.totalRevenue || 0,
        };
      })
      .filter(Boolean);
  }, [apiData]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-(--color-bg-light) rounded-2xl animate-pulse">
        <p className="text-(--color-text-muted)">Loading Chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Failed to load chart data</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full bg-(--color-bg-light) p-8 rounded-2xl border border-(--color-border-light) text-center">
        <h2 className="text-xl font-bold mb-2">💰 Total Income per Month</h2>
        <p className="text-(--color-text-muted)">
          No revenue data available to display.
        </p>
      </div>
    );
  }

  // ===> CSS variables
  const styles = getComputedStyle(document.documentElement);
  const accentColor =
    styles.getPropertyValue("--color-light-accent").trim() || "#C58D52";
  const textColor =
    styles.getPropertyValue("--color-text-primary").trim() || "#111827";
  const gridColor =
    styles.getPropertyValue("--color-border-light").trim() || "#e5e7eb";

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) =>
        `${params[0].axisValue}<br/>💰 $${params[0].value.toLocaleString()}`,
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: chartData.map((d: any) => d.label),
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: textColor },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisLabel: {
        color: textColor,
        formatter: (value: number) => `$${value.toLocaleString()}`,
      },
      splitLine: {
        lineStyle: { type: "dashed", color: gridColor },
      },
    },
    series: [
      {
        name: "Revenue",
        type: "bar",
        data: chartData.map((d: any) => d.revenue),
        barWidth: "45%",
        itemStyle: {
          color: accentColor,
          borderRadius: [8, 8, 0, 0],
        },
        animationDuration: 1500,
      },
    ],
  };

  return (
    <div className="w-full bg-(--color-bg-light) p-6 rounded-2xl shadow-sm border border-(--color-border-light) hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        💰 Total Income per Month
      </h2>

      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
