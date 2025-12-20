import {
  FaShoppingBag,
  FaUsers,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import OverView from "../OverView/OverView";
import { useDashboardStats } from "./Components/useDashboaardState";
import StatCard from "./Components/StateCard";

const DashboardEcoHome = () => {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={isLoading ? "..." : `$${data?.totalRevenue.toLocaleString()}`}
          icon={FaDollarSign}
          color="bg-gradient-to-br from-green-400 to-green-600"
        />

        <StatCard
          title="Total Orders"
          value={isLoading ? "..." : data?.totalOrders ?? 0}
          icon={FaShoppingBag}
          color="bg-gradient-to-br from-orange-400 to-orange-600"
        />

        <StatCard
          title="New Customers"
          value={isLoading ? "..." : data?.newCustomers ?? 0}
          icon={FaUsers}
          color="bg-gradient-to-br from-blue-400 to-blue-600"
        />

        <StatCard
          title="Active Users"
          value={isLoading ? "..." : data?.activeUsers ?? 0}
          icon={FaChartLine}
          color="bg-gradient-to-br from-purple-400 to-purple-600"
        />
      </div>

      <OverView />
    </div>
  );
};

export default DashboardEcoHome;
