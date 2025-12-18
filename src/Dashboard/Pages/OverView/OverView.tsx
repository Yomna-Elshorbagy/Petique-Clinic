import React from "react";
import RevenueChart from "./Components/RevenueChart";
import TopSellingProducts from "../Reports/Components/TopSellingProducts";
import GenderPieChart from "./Components/GenderChart";
import RolesBarChart from "./Components/RolesChart";
import UsersOverviewChart from "./Components/UsersOverviewChart";
import DeletedUsersChart from "./Components/useDeletedUsersAnalysis ";
import RevenueByCategoryChart from "./Components/RevenueByCategory";
import CategoryDistributionChart from "./Components/CategoryDistributionChart";
import SEO from "../../../Components/SEO/SEO";

const OverView = () => {
  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <SEO
        title="Overview | Dashboard Petique Clinic"
        description="Overview of clinic operations, appointments, orders, and analytics in the Petique Clinic dashboard."
      />

      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Based on Analysis
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Detailed overview of your clinic's performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GenderPieChart />
        <RolesBarChart />
        <UsersOverviewChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DeletedUsersChart />
        <RevenueByCategoryChart />
        <CategoryDistributionChart />
      </div>
      <RevenueChart />
    </div>
  );
};

export default OverView;
