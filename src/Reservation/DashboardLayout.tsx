import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Componenst/NavBar/Navbar";
import Sidebar from "./Componenst/SideBar/Sidebar";

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isCollapsed, setIsCollapsed] = useState(false); 

  const toggleSidebarMobile = () => setIsSidebarOpen((prev) => !prev);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-[var(--color-light-background)]">
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        toggleMobile={toggleSidebarMobile}
        toggleCollapse={toggleCollapse}
      />

      <main className="flex-1">
        <div className={`${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
          <Navbar toggleSidebar={toggleSidebarMobile} />
        </div>
        <div className={`mt-20 p-6 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
