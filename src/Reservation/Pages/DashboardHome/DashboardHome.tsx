import React from "react";
import OverviewStats from "./Components/OverviewStats";
import AllReservationsPage from "./Components/AllReservationsPage";
import QuickActionsPanel from "./Components/QuickActionsPanel";

export default function DashboardHome() {
  return (
    <div className="p-6">
      <OverviewStats />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        <div className="lg:col-span-4">
          <AllReservationsPage />
        </div>
        <div className="lg:col-span-1">
          <QuickActionsPanel />
        </div>
      </div>
    </div>
  );
}
