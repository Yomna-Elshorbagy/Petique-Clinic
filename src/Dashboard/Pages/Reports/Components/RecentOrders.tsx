import React, { useMemo } from "react";
import { useAllOrders } from "../../../../Hooks/Orders/useOrderTracking";
import SharedReportTable from "../Shard/SharedReportTable";

const RecentOrders: React.FC = () => {
  const { data: ordersData, isLoading } = useAllOrders(1, 50); // Get first page with more orders to ensure we have recent ones

  const recentOrders = useMemo(() => {
    if (!ordersData?.data || !Array.isArray(ordersData.data)) return [];
    return ordersData.data
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 9);
  }, [ordersData]);

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
        <span className="text-xs text-(--color-text-muted) font-medium">
          #{value ? value.slice(-3) : "N/A"}
        </span>
      ),
    },
    {
      header: "Customer",
      accessor: "fullName",
      render: (value: string) => (
        <span className="text-(--color-text-primary)">
          {value || "Unknown"}
        </span>
      ),
    },
    {
      header: "Total",
      accessor: "finalPrice",
      render: (value: number) => (
        <span className="font-medium text-(--color-text-primary)">
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
    <div className="bg-(--color-bg-light) rounded-xl border border-(--color-border-light) p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-(--color-text-primary) tracking-wide">
        Recent Orders
      </h2>
      <SharedReportTable
        data={recentOrders}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RecentOrders;
