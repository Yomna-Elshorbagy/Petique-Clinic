import { Bell, User } from "lucide-react";

export default function StaffNavbar() {
  return (
    <div className="w-full bg-gradient-to-r from-white via-[var(--color-extra-5)]/30 to-white dark:from-[var(--color-dark-card)] dark:via-gray-800/50 dark:to-[var(--color-dark-card)] px-8 py-4 flex items-center justify-between shadow-sm mb-6 sticky top-0 backdrop-blur-sm z-50">
      {/* Left Section: Breadcrumbs / Title */}
      <div>
        <h2 className="text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] text-xl font-bold tracking-wide">
          Staff Dashboard
        </h2>
        <p className="text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-muted)] text-sm">
          Welcome back, Team!
        </p>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-6">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full bg-[var(--color-bg-light)] border border-[var(--color-border-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-extra-5)] transition-all hover:scale-105 active:scale-95 shadow-sm">
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border-medium)]">
            <div className="flex flex-col items-end mr-1 hidden sm:block">
              <span className="text-[var(--color-text-primary)] text-sm font-semibold leading-tight">
                Staff Reservation
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--color-light-accent)]/10 text-[var(--color-light-accent)] flex items-center justify-center border border-[var(--color-border-light)] shadow-inner cursor-pointer hover:scale-105 transition-transform">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
