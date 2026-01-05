import { Outlet } from "react-router-dom";
import StaffSidebar from "./Components/Sidebar/Sidebar";
import StaffNavbar from "./Components/Navbar/StaffNavbar";

export default function StaffLayout() {
  return (
    <div className="flex h-screen w-full bg-[var(--color-light-background)] text-[var(--color-light-dark)] overflow-hidden font-['Inter']">
      {/* Soft Warm Gradient Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(233,166,111,0.05),transparent_70%)] pointer-events-none" />

      {/* Sidebar - Warm Elevation */}
      <aside className="h-full z-20 shadow-[10px_0_40px_-15px_rgba(79,63,54,0.08)] shrink-0 border-r border-[#A98868]/10 bg-white">
        <StaffSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full flex flex-col relative overflow-hidden backdrop-blur-[1px]">
        {/* Navbar */}
        <div className="w-full z-10 border-b border-[#A98868]/10 bg-white/80 backdrop-blur-md">
          <StaffNavbar />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 lg:p-10 w-full max-w-7xl mx-auto animate-fadeIn relative z-0 custom-scrollbar">
          <Outlet />
        </div>

        {/* Decorative background elements - Premium Warm Style */}
        <div className="fixed top-[-100px] right-[-100px] w-[600px] h-[600px] bg-[var(--color-extra-5)]/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[var(--color-light-accent)]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      </main>
    </div>
  );
}
