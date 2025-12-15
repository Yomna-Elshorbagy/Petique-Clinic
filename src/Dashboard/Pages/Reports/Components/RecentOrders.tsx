import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../Hooks/useSliceHook";
import { getAllOrders } from "../../../../Store/Slices/OrderSlice";
import SharedReportTable from "../Shard/SharedReportTable";

const RecentOrders: React.FC = () => {
    const dispatch = useAppDispatch();
    const { orders = [], loading } = useAppSelector((state) =>
        // Support both "Order" (current store key) and "order" (older usage)
        (state as any).Order || (state as any).order || { orders: [], loading: false }
    );

    useEffect(() => {
        if (!orders || orders.length === 0) {
            dispatch(getAllOrders());
        }
    }, [dispatch, orders.length]);

    const recentOrders = useMemo(() => {
        if (!orders || !Array.isArray(orders)) return [];
        // Slice copy to avoid mutating state if sort is used (though slice creates shallow copy anyway)
        return orders.slice().reverse().slice(0, 9);
    }, [orders]);

    const getStatusBadge = (status: string) => {
        let classes = "bg-gray-400 text-white";
        switch (status?.toLowerCase()) {
            case "pending":
                classes = "bg-yellow-500 text-black";
                break;
            case "shipping":
            case "shipped":
                classes = "bg-cyan-500 text-white";
                break;
            case "completed":
                classes = "bg-green-500 text-white";
                break;
            case "placed":
                classes = "bg-blue-400 text-white";
                break;
            case "canceled":
            case "cancelled":
                classes = "bg-red-500 text-white";
                break;
        }
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}
            >
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
            </span>
        );
    };

    const columns = [
        {
            header: "ID",
            accessor: "_id",
            render: (value: string) => (
                <span className="text-xs text-[var(--color-text-muted)] font-medium">
                    #{value ? value.slice(-3) : "N/A"}
                </span>
            ),
        },
        {
            header: "Customer",
            accessor: "fullName",
            render: (value: string) => (
                <span className="text-[var(--color-text-primary)]">
                    {value || "Unknown"}
                </span>
            ),
        },
        {
            header: "Total",
            accessor: "finalPrice",
            render: (value: number) => (
                <span className="font-medium text-[var(--color-text-primary)]">
                    {value ? Number(value).toFixed(2) : "0.00"}
                </span>
            ),
        },
        {
            header: "Status",
            accessor: "status",
            render: (value: string) => getStatusBadge(value),
        },
    ];

    return (
        <div className="bg-[var(--color-bg-light)] rounded-xl border border-[var(--color-border-light)] p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text-primary)] tracking-wide">
                Recent Orders
            </h2>
            <SharedReportTable
                data={recentOrders}
                columns={columns}
                isLoading={loading}
            />
        </div>
    );
};

export default RecentOrders;

