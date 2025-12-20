import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getCategoryStats } from "../../../../Apis/CategoryApis";
import type { ICategoryStats } from "../../../../Interfaces/categryInterfaces";

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

export default function CategoryDistributionChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats: ICategoryStats = await getCategoryStats();
        setData(
          stats.productsPerCategory.map((c) => ({
            name: c.categoryName,
            value: c.count,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading chart...</p>;

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
        name: "Products",
        type: "pie",
        radius: ["45%", "70%"],
        label: {
          formatter: "{d}%",
          color: cssVar("--color-text-primary", "#3a2f27"),
        },
        data: data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: [
              cssVar("--color-extra-6", "#d4c4b0"),
              cssVar("--color-accent-dark", "#d69560"),
              cssVar("--color-extra-4", "#86654f"),
              cssVar("--color-extra-7", "#c9b499"),
              cssVar("--color-extra-8", "#9d8c7a"),
            ][index % 5],
          },
        })),
      },
    ],
  };

  return (
    <div className="w-full h-90 bg-[var(--color-bg-light)] dark:bg-(--color-dark-card) p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-4">🛒 Products per Category</h3>

      <ReactECharts option={option} style={{ height: 280 }} />
    </div>
  );
}
