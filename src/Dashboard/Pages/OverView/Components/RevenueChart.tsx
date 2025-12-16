import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
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
                    name: `${months[month]} ${year}`,
                    revenue: item.totalRevenue || 0,
                    orders: item.totalOrders || 0,
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
                <h2 className="text-xl font-bold text-(--color-text-primary) mb-2">
                    💰 Total Income per Month
                </h2>
                <p className="text-(--color-text-muted)">
                    No revenue data available to display.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-(--color-bg-light) p-6 rounded-2xl shadow-sm border border-(--color-border-light) transform transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-(--color-text-primary) flex items-center gap-2">
                    💰 Total Income per Month
                </h2>
            </div>

            <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border-light)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) =>
                                `$${value && value.toLocaleString ? value.toLocaleString() : value
                                }`
                            }
                        />
                        <Tooltip
                            cursor={{ fill: "var(--color-bg-lighter)" }}
                            formatter={(value: number | undefined) => [
                                `$${value ? value.toLocaleString() : "0"}`,
                                "Revenue",
                            ]}
                            contentStyle={{
                                backgroundColor: "var(--color-bg-light)",
                                borderRadius: "12px",
                                border: "1px solid var(--color-border-light)",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                color: "var(--color-text-primary)",
                            }}
                        />
                        <Bar
                            dataKey="revenue"
                            fill="#C58D52"
                            radius={[8, 8, 0, 0]}
                            animationDuration={1500}
                            barSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
