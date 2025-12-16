import React from "react";
import MonthlyRevenues from "./Components/MonthlyRevenues";
import TopSellingProducts from "./Components/TopSellingProducts";
import OrderStatusOverview from "./Components/OrderStatusOverview";
import RecentOrders from "./Components/RecentOrders";
import CategoryDistributionTable from "./Components/CategoryDistributionTable";
import RevenueByCategoryTable from "./Components/RevenueByCategoryTable";

export default function Reports() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
        Reports & Analytics
      </h1>
      <MonthlyRevenues />
      <div className="lg:col-span-3">
        <TopSellingProducts />
      </div>
      <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusOverview />
        <RecentOrders />
      </div>
         <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistributionTable />
        <RevenueByCategoryTable />
      </div>
    </div>
  );
}
