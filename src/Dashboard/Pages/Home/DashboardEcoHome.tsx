import React from "react";
import { FaShoppingBag, FaUsers, FaDollarSign, FaChartLine } from "react-icons/fa";
import OverView from "../OverView/OverView";

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-[var(--color-dark-card)] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">{title}</p>
        <h3 className="text-2xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)] mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
        <Icon className="text-lg" />
      </div>
    </div>
   
  </div>
);

const DashboardEcoHome = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">Dashboard Overview</h1>
         </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value="$24,500" 
          
          icon={FaDollarSign} 
          color="bg-gradient-to-br from-green-400 to-green-600"
        />
        <StatCard 
          title="Total Orders" 
          value="1,240" 
         
          icon={FaShoppingBag} 
          color="bg-gradient-to-br from-[var(--color-light-accent)] to-orange-500"
        />
        <StatCard 
          title="New Customers" 
          value="350" 
          
          icon={FaUsers} 
          color="bg-gradient-to-br from-blue-400 to-blue-600"
        />
        <StatCard 
          title="Revenue" 
          value="$12,200" 
           
          icon={FaChartLine} 
          color="bg-gradient-to-br from-purple-400 to-purple-600"
        />
      </div>
      <OverView/>
     
    </div>
  );
};

export default DashboardEcoHome;
