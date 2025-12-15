import React from "react";
import { useRevenuePerMonth, useExportOrders } from "../../../Hooks/OverView/useAnalytics";
import SharedReportTable from "./Components/SharedReportTable";

const MonthlyRevenues = () => {
    const { data, isLoading } = useRevenuePerMonth();
    const { exportCSV, exportPDF } = useExportOrders();

    const columns = [
        {
            header: "Month",
            accessor: "_id",
            render: (value: { year: number; month: number }) => {
                if (!value) return "N/A";
                const date = new Date(value.year, value.month - 1); // Month is 0-indexed in JS Date
                return (
                    <span className="font-medium text-[var(--color-text-primary)]">
                        {date.toLocaleString("default", { month: "long", year: "numeric" })}
                    </span>
                );
            },
        },
        {
            header: "Total Revenue",
            accessor: "totalRevenue",
            render: (value: number) => (
                <span className="font-bold text-[var(--color-accent-dark)]">
                    ${value?.toLocaleString() ?? 0}
                </span>
            ),
        },
        {
            header: "Orders Count",
            accessor: "totalOrders",
            render: (value: number) => <span>{value ?? 0}</span>,
        },
    ];

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-end gap-3">
                <button
                    onClick={exportCSV}
                    className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ease-out shadow-sm hover:shadow-md flex items-center gap-2 bg-[#FCF9F4] text-[#4f3f36] border border-[#A98868]/50 hover:bg-[#f3ede6] active:scale-[0.97]"
                >
                    Export CSV
                </button>
                <button
                    onClick={exportPDF}
                    className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ease-out shadow-sm hover:shadow-md flex items-center gap-2 bg-[#C58D52] text-white hover:bg-[#b67e46] active:scale-[0.97]"
                >
                    Export PDF
                </button>
            </div>

            <SharedReportTable
                title="Monthly Revenues"
                data={data || []}
                columns={columns}
                isLoading={isLoading}
            />
        </div>
    );
};

export default MonthlyRevenues;
