import React, { useMemo } from "react";
import SharedReportTable from "../Shard/SharedReportTable";
import { useDemographics } from "../../../../Hooks/OverView/useAnalytics";

interface Row {
  category: string;
  label: string;
  count: number;
  percentage: string;
}

const UserAnalysis: React.FC = () => {
  const { data, isLoading } = useDemographics();

  const tableData: Row[] = useMemo(() => {
    if (!data?.data) return [];

    const { gender, roles } = data.data;

    const combined: { label: string; count: number; category: string }[] = [];

    Object.entries(gender || {}).forEach(([key, count]) => {
      combined.push({
        category: "Gender",
        label: key,
        count,
      });
    });

    Object.entries(roles || {}).forEach(([key, count]) => {
      combined.push({
        category: "Role",
        label: key,
        count,
      });
    });

    const total = combined.reduce((sum, r) => sum + r.count, 0);

    return combined.map((item) => ({
      ...item,
      percentage:
        total > 0 ? ((item.count / total) * 100).toFixed(1) : "0.0",
    }));
  }, [data]);

  const getColor = (percentage: number) => {
    if (percentage >= 60) return "bg-green-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const columns = [
    {
      header: "Category",
      accessor: "category",
      render: (value: string) => (
        <span className="font-semibold text-(--color-text-primary)">
          {value}
        </span>
      ),
    },
    {
      header: "Type",
      accessor: "label",
      render: (value: string) => (
        <span className="capitalize text-(--color-text-primary)">
          {value}
        </span>
      ),
    },
    {
      header: "Count",
      accessor: "count",
      render: (value: number) => (
        <span className="font-medium text-(--color-text-primary)">
          {value}
        </span>
      ),
    },
    {
      header: "Percentage",
      accessor: "percentage",
      className: "w-1/2",
      render: (value: string) => {
        const percentNum = parseFloat(value);
        return (
          <div className="flex items-center gap-3">
            <span className="w-14 text-sm text-(--color-text-muted)">
              {value}%
            </span>
            <div className="relative flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getColor(
                  percentNum
                )}`}
                style={{ width: `${percentNum}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-(--color-bg-light) rounded-xl border border-(--color-border-light) p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-(--color-text-primary) tracking-wide">
        Users Analysis Overview
      </h2>

      <SharedReportTable
        data={tableData}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserAnalysis;
