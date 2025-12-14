import { useState } from "react";
import { motion } from "framer-motion";
import AllReservations from "./components/AllReservations";
import UpcomingReservations from "./components/UpcomingReservations";
import PastReservations from "./components/PastReservations";

type TabType = "all" | "upcoming" | "past";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabs = [
    { id: "all" as TabType, label: "All Reservations", count: null },
    { id: "upcoming" as TabType, label: "Upcoming", count: null },
    { id: "past" as TabType, label: "Past", count: null },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          My Appointments
        </h2>
        <p className="text-[var(--color-text-muted)]">
          Manage and track all your pet clinic appointments
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 bg-[var(--color-bg-cream)] dark:bg-[var(--color-dark-bg-elevated)] p-2 rounded-2xl border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "text-white shadow-lg"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-warm)] dark:hover:bg-[var(--color-dark-bg-hover)]"
                }
              `}
              style={{
                backgroundColor:
                  activeTab === tab.id
                    ? "var(--color-light-accent)"
                    : "transparent",
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    backgroundColor: "var(--color-light-accent)",
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "all" && <AllReservations />}
        {activeTab === "upcoming" && <UpcomingReservations />}
        {activeTab === "past" && <PastReservations />}
      </motion.div>
    </div>
  );
}
