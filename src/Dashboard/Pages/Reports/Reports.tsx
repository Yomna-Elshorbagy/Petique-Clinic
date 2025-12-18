import React from "react";
import MonthlyRevenues from "./Components/MonthlyRevenues";
import TopSellingProducts from "./Components/TopSellingProducts";
import OrderStatusOverview from "./Components/OrderStatusOverview";
import RecentOrders from "./Components/RecentOrders";
import UserAnalysis from "./Components/UserAnalysis";
import CategoryDistributionTable from "./Components/CategoryDistributionTable";
import RevenueByCategoryTable from "./Components/RevenueByCategoryTable";
import SEO from "../../../Components/SEO/SEO";

export default function Reports() {
  return (
    <div className="p-4 space-y-6">
      <SEO
        title="Reports | Dashboard Petique Clinic"
        description="Generate and review detailed reports on clinic operations, sales, and veterinary services."
      />

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
        <UserAnalysis />
      </div>
      <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistributionTable />
        <RevenueByCategoryTable />
      </div>
    </div>
  );
}
