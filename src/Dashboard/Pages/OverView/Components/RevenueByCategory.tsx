import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getRevenueDistribution } from "../../../../Apis/CategoryApis";

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;
export default function RevenueByCategoryChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await getRevenueDistribution();
        setData(
          res.map((r: any) => ({
            name: r.category,
            value: r.totalRevenue,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
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
        name: "Revenue",
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
              cssVar("--color-accent-light", "#f4c6a0"),
              cssVar("--color-accent-dark", "#d69560"),
              cssVar("--color-extra-6", "#d4c4b0"),
              cssVar("--color-extra-9", "#6b5a4d"),
              cssVar("--color-extra-8", "#9d8c7a"),
            ][index % 5],
          },
        })),
      },
    ],
  };

  return (
    <div className="bg-[var(--color-bg-light)] p-6 rounded-2xl transition-all">
      <h3 className="text-lg font-semibold mb-4">
        📊 Revenue Distribution by Category
      </h3>

      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}
