import React from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import OrderNotificationBell from "../NotifyAdmin/NotifyAdmin";

const DashboardHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="bg-white dark:bg-[var(--color-dark-card)] border-b border-gray-200 dark:border-gray-800 h-20 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      <div className="flex items-center gap-4">

        <OrderNotificationBell />

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
              Admin User
            </p>
            <p className="text-xs text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
              Manager
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer">
            <FaUserCircle className="w-full h-full text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
