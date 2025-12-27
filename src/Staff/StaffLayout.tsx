import React from 'react';
import { Outlet } from 'react-router-dom';
import StaffSidebar from './Components/Sidebar';
import StaffNavbar from './Components/Navbar/StaffNavbar';

export default function StaffLayout() {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[var(--color-light-background)] via-white to-[var(--color-extra-5)]/30 dark:from-[var(--color-dark-background)] dark:via-[var(--color-dark-bg-deep)] dark:to-[var(--color-dark-background)] overflow-hidden font-['Inter']">
      {/* Sidebar */}
      <aside className="h-full z-20 shadow-xl shrink-0">
        <StaffSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full flex flex-col relative overflow-hidden">
        {/* Navbar */}
        <div className="w-full z-10">
          <StaffNavbar />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 lg:p-10 w-full max-w-7xl mx-auto animate-fadeIn relative z-0">
          <Outlet />
        </div>

        {/* Decorative background elements */}
        <div className="fixed top-20 right-10 w-64 h-64 bg-[var(--color-extra-1)]/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-20 left-10 w-96 h-96 bg-[var(--color-light-accent)]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      </main>
    </div>
  );
}
