import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../../../Apis/OverView";
import SharedReportTable from "../Shard/SharedReportTable";

interface ProductStats {
  name: string;
  price: number;
  salesCount: number;
  totalRevenue: number;
}

const TopSellingProducts = () => {
  const {
    data: topProducts = [],
    isLoading,
  } = useQuery<ProductStats[], Error>({
    queryKey: ["topProductsManual"],
    queryFn: async () => {
      const response = await getAllOrders(1, 100);
      const orders = response.data || response; 

      const productMap = new Map<string, ProductStats>();

      for (const order of orders) {
        if (order.products && Array.isArray(order.products)) {
          for (const p of order.products) {
            const name = p.title || "Unknown";
            const price = Number(p.price) || 0;
            const qty = Number(p.quantity) || 0;

            if (!productMap.has(name)) {
              productMap.set(name, {
                name,
                price,
                salesCount: qty,
                totalRevenue: qty * price,
              });
            } else {
              const existing = productMap.get(name)!;
              existing.salesCount += qty;
              existing.totalRevenue += qty * price;
            }
          }
        }
      }

      // Sort by sales count, take top 5 and add rank for display
      return Array.from(productMap.values())
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 6);
    },
  });

  const rankedProducts = topProducts.map((product, index) => ({
    ...product,
    rank: index + 1,
  }));

  const maxSales = Math.max(...rankedProducts.map((p) => p.salesCount), 1);

  const getColor = (percentage: number) => {
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const columns = [
    {
      header: "#",
      accessor: "rank",
      className: "w-16",
      render: (value: number) => (
        <span className="font-semibold text-[var(--color-text-primary)]">
          {value}
        </span>
      ),
    },
    {
      header: "Product Name",
      accessor: "name",
      render: (value: string) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          {value}
        </span>
      ),
    },
    {
      header: "Sales Count",
      accessor: "salesCount",
      className: "w-1/3",
      render: (value: number) => {
        const percent = (value / maxSales) * 100;
        return (
          <div className="flex items-center gap-3">
            <span className="w-8 font-bold text-[var(--color-text-primary)]">{value}</span>
            <div className="relative flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getColor(percent)}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Price (EGP)",
      accessor: "price",
      render: (value: number) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Total Revenue (EGP)",
      accessor: "totalRevenue",
      render: (value: number) => (
        <span className="font-bold text-[var(--color-text-primary)]">
          {value.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="mt-8 bg-[var(--color-bg-light)] rounded-xl border border-[var(--color-border-light)] p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text-primary)] tracking-wide">
        Top 6 Selling Products
      </h2>
      <SharedReportTable
        data={rankedProducts}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TopSellingProducts;
