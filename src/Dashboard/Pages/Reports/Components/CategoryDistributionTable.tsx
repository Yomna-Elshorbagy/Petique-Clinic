import React, { useMemo } from "react";
import { useCategoryStats } from "../../../../Hooks/OverView/useAnalytics";
import SharedReportTable from "../Shard/SharedReportTable";

const CategoryDistributionTable: React.FC = () => {
  const { data, isLoading, isError, error } = useCategoryStats();

  // ===> helper to ensure data availability
  const productsPerCategory = data?.productsPerCategory || [];

  const processedData = useMemo(() => {
    const totalProducts = productsPerCategory.reduce(
      (acc, c) => acc + c.count,
      0
    );

    return productsPerCategory.map((cat) => ({
      ...cat,
      percentage: totalProducts > 0 ? (cat.count / totalProducts) * 100 : 0,
    }));
  }, [productsPerCategory]);

  const columns = useMemo(
    () => [
      {
        header: "Category",
        accessor: "categoryName",
        render: (val: string) => (
          <span className="font-medium text-[var(--color-text)]">{val}</span>
        ),
      },
      {
        header: "Products",
        accessor: "count",
        render: (val: number) => <span className="font-semibold">{val}</span>,
      },
      {
        header: "Share",
        accessor: "percentage",
        render: (val: number) => (
          <span className="font-medium text-[var(--color-accent-dark)]">
            {val.toFixed(1)}%
          </span>
        ),
      },
    ],
    []
  );

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading categories: {(error as Error)?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="mt-8 g-(--color-bg-light) rounded-xl border border-(--color-border-light) p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <SharedReportTable
        title="🛒 Products per Category"
        data={processedData}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CategoryDistributionTable;
