import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Componenst/NavBar/Navbar";
import Sidebar from "./Componenst/SideBar/Sidebar";

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebarMobile = () => setIsSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const sidebarWidth = isCollapsed ? "80px" : "260px";

  return (
    <div className="min-h-screen w-full bg-[#ECE7E2] font-['Inter']">
      <div
        className="fixed top-0 left-0 h-full z-30 transition-all duration-300"
        style={{ width: sidebarWidth }}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isCollapsed}
          toggleMobile={toggleSidebarMobile}
          toggleCollapse={toggleCollapse}
        />
      </div>

      <div
        className="fixed top-0 right-0 h-20 bg-[#ECE7E2] z-20 flex items-center transition-all duration-300"
        style={{ left: sidebarWidth }}
      >
        <Navbar toggleSidebar={toggleSidebarMobile} />
      </div>

      <div
        className="pt-24 p-6 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
