import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../Hooks/useSliceHook";
import { getAllOrders } from "../../../../Store/Slices/OrderSlice";
import SharedReportTable from "../Shard/SharedReportTable";

const OrderStatusOverview: React.FC = () => {
    const dispatch = useAppDispatch();
    const { orders = [], loading } = useAppSelector((state) =>
        //===> Support both "Order" 
        (state as any).Order || (state as any).order || { orders: [], loading: false }
    );

    useEffect(() => {
        // ===> dispatch if orders are empty, to ensure data is loaded
        if (!orders || orders.length === 0) {
            dispatch(getAllOrders());
        }
    }, [dispatch, orders.length]);

    const summaryData = useMemo(() => {
        if (!orders || !Array.isArray(orders)) return [];

        const totalOrders = orders.length;

        const statusCount = orders.reduce((acc: Record<string, number>, order: any) => {
            const key = order?.status?.toLowerCase() || "pending";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(statusCount).map(([status, count]) => ({
            status: status.charAt(0).toUpperCase() + status.slice(1),
            count: count,
            percentage: totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : "0.0",
        }));
    }, [orders]);

    const getColor = (percentage: number) => {
        if (percentage >= 70) return "bg-green-500";
        if (percentage >= 30) return "bg-yellow-500";
        return "bg-red-500";
    };

    const columns = [
        {
            header: "Status",
            accessor: "status",
            render: (value: string) => (
                <span className="font-medium text-[var(--color-text-primary)]">
                    {value}
                </span>
            ),
        },
        {
            header: "Count",
            accessor: "count",
            render: (value: number) => (
                <span className="text-[var(--color-text-primary)]">{value}</span>
            ),
        },
        {
            header: "Percentage",
            accessor: "percentage",
            className: "w-1/2",
            render: (value: string, _row: any) => {
                const percentNum = parseFloat(value);
                return (
                    <div className="flex items-center gap-3">
                        <span className="w-12 text-sm text-[var(--color-text-muted)]">
                            {value}%
                        </span>
                        <div className="relative flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getColor(
                                    percentNum
                                )}`}
                                style={{ width: `${percentNum}%` }}
                            />
                        </div>
                    </div>
                )
            },
        },
    ];

    return (
        <div className="bg-[var(--color-bg-light)] rounded-xl border border-[var(--color-border-light)] p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text-primary)] tracking-wide">
                Order Status Overview
            </h2>
            <SharedReportTable
                data={summaryData}
                columns={columns}
                isLoading={loading}
            />
        </div>
    );
};

export default OrderStatusOverview;

