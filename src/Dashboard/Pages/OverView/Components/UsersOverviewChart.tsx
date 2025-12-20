import ReactECharts from "echarts-for-react";
import { useUsersOverview } from "../../../../Hooks/OverView/useAnalytics";

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim() || fallback;

export default function UsersOverviewChart() {
  const { data, isLoading } = useUsersOverview();

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No data found.</p>;

  const option = {
    tooltip: {
      trigger: "item",
      backgroundColor: cssVar("--color-bg-cream", "#f5f0ea"),
      borderColor: cssVar("--color-border-light", "#e6ddd3"),
      textStyle: {
        color: cssVar("--color-text-primary", "#3a2f27"),
      },
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: cssVar("--color-text-muted", "#9a8c81"),
      },
    },
    series: [
      {
        name: "Users",
        type: "pie",
        radius: ["45%", "70%"],
        label: {
          color: cssVar("--color-text-primary", "#3a2f27"),
        },
        data: [
          {
            value: data.pendingUsers,
            name: "Pending",
            itemStyle: { color: cssVar("--color-extra-6", "#d4c4b0") },
          },
          {
            value: data.verifiedUsers,
            name: "Verified",
            itemStyle: { color: cssVar("--color-accent-dark", "#d69560") },
          },
          {
            value: data.blockedUsers,
            name: "Blocked",
            itemStyle: { color: cssVar("--color-extra-4", "#86654f") },
          },
          {
            value: data.deletedUsers,
            name: "Deleted",
            itemStyle: { color: cssVar("--color-text-muted", "#9a8c81") },
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full h-90 bg-white dark:bg-(--color-dark-card) p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-center mb-3">
        Users Overview
      </h2>

      <ReactECharts option={option} style={{ height: "90%" }} />
    </div>
  );
}
