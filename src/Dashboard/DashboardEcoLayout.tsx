import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import DashboardHeader from "./Components/Navbar/DashboardHeader";

const DashboardEcoLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const toggleSidebarMobile = () => setIsSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On mobile, sidebar width is 0 (hidden), on desktop it respects collapsed state
  const sidebarWidth = isDesktop ? (isCollapsed ? "80px" : "260px") : "0px";

  return (
    <div
      dir="ltr"
      className="min-h-screen w-full bg-gradient-to-br from-[var(--color-light-background)] via-white to-[var(--color-extra-5)]/30 dark:from-[var(--color-dark-background)] dark:via-[var(--color-dark-bg-deep)] dark:to-[var(--color-dark-background)] font-sans"
    >
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
        className="fixed top-0 right-0 h-20 z-20 flex items-center transition-all duration-300 bg-gradient-to-r from-white via-[var(--color-extra-5)]/30 to-white dark:from-[var(--color-dark-card)] dark:via-gray-800/50 dark:to-[var(--color-dark-card)]"
        style={{ left: sidebarWidth }}
      >
        <DashboardHeader toggleSidebar={toggleSidebarMobile} />
      </div>

      <div
        className="pt-24 p-6 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="animate-fadeIn">
          <Outlet />
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-[var(--color-extra-1)]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-[var(--color-light-accent)]/5 rounded-full blur-3xl pointer-events-none -z-10" />
    </div>
  );
};

export default DashboardEcoLayout;
