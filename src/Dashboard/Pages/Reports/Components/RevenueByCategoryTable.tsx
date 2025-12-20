import React, { useMemo } from "react";
import { useRevenueDistribution } from "../../../../Hooks/OverView/useAnalytics";
import SharedReportTable from "../Shard/SharedReportTable";

const RevenueByCategoryTable: React.FC = () => {
  const {
    data: revenueData = [],
    isLoading,
    isError,
    error,
  } = useRevenueDistribution();

  const columns = useMemo(() => {
    const total = revenueData.reduce((sum, r) => sum + r.totalRevenue, 0);

    return [
      {
        header: "#",
        accessor: "index",
        render: (_: any, __: any, index?: number) => (
          <span className="font-medium text-[var(--color-text-muted)]">
            {_}
          </span>
        ),
      },
      {
        header: "Category",
        accessor: "category",
        render: (val: string) => <span className="font-semibold">{val}</span>,
      },
      {
        header: "Total Revenue ($)",
        accessor: "totalRevenue",
        render: (val: number) => (
          <span className="font-medium text-[var(--color-accent-dark)]">${val.toFixed(2)}</span>
        ),
      },
      {
        header: "% of Total",
        accessor: "percentage", // Calculated field
        render: (val: number) => (
          <span className="text-[var(--color-text-muted)]">
            {val.toFixed(1)}%
          </span>
        ),
      },
    ];
  }, [revenueData]);

  // ===> pre-process data to include index and percentage
  const processedData = useMemo(() => {
    const total = revenueData.reduce((sum, r) => sum + r.totalRevenue, 0);
    return revenueData.map((row, idx) => ({
      ...row,
      index: idx + 1,
      percentage: total > 0 ? (row.totalRevenue / total) * 100 : 0,
    }));
  }, [revenueData]);

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading revenue: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="mt-8 g-(--color-bg-light) rounded-xl border border-(--color-border-light) p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <SharedReportTable
        title="💰 Revenue by Category"
        data={processedData}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RevenueByCategoryTable;
