import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AllReservations from "./components/AllReservations";
import UpcomingReservations from "./components/UpcomingReservations";
import PastReservations from "./components/PastReservations";
import SEO from "../SEO/SEO";

type TabType = "all" | "upcoming" | "past";

export default function Appointments() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabs = [
    {
      id: "all" as TabType,
      label: t("userProfile.appointments.tabs.all"),
      count: null,
    },
    {
      id: "upcoming" as TabType,
      label: t("userProfile.appointments.tabs.upcoming"),
      count: null,
    },
    {
      id: "past" as TabType,
      label: t("userProfile.appointments.tabs.past"),
      count: null,
    },
  ];

  return (
    <div className="w-full">
      <SEO
        title={t("userProfile.seo.title")}
        description={t("userProfile.seo.description")}
      />
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          {t("userProfile.appointments.title")}
        </h2>
        <p className="text-[var(--color-text-muted)]">
          {t("userProfile.appointments.subtitle")}
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
                ${activeTab === tab.id
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
