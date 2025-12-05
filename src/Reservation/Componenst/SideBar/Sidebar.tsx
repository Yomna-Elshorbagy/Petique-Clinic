import React from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaPaw,
  FaUserMd,
  FaStethoscope,
  FaClipboardList,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleMobile: () => void;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  toggleMobile,
  toggleCollapse,
}) => {
  const isDesktop = window.innerWidth >= 768;

  const links = [
    { icon: <FaHome />, label: "Clinic Board", to: "/resDashboard" },
    {
      icon: <FaCalendarAlt />,
      label: "Reservations",
      to: "/resDashboard/reservations",
    },
    { icon: <FaPaw />, label: "Animals", to: "/resDashboard/animals" },
    { icon: <FaPaw />, label: "Animals Category", to: "/resDashboard/animalCategory" },
    { icon: <FaUserMd />, label: "Doctors", to: "/resDashboard/doctors" },
    {
      icon: <FaStethoscope />,
      label: "Vaccinations",
      to: "/resDashboard/vaccinations",
    },
    {
      icon: <FaClipboardList />,
      label: "Medical History",
      to: "/resDashboard/medical",
    },
    { icon: <FaSignOutAlt />, label: "Logout", to: "/login" },
  ];

  return (
    <>
      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={toggleMobile}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 z-40 
          min-h-screen                     
          bg-[var(--color-light-primary)]
          text-[var(--color-light-dark)]
          shadow-lg flex flex-col p-4
          transition-all duration-300
          ${
            isDesktop
              ? isCollapsed
                ? "w-20"
                : "w-64"
              : isOpen
              ? "w-64"
              : "w-0"
          }
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className={`text-3xl font-bold flex items-center gap-3 transition-all 
              ${isCollapsed ? "mx-auto" : ""}
            `}
          >
            <FaPaw className="text-[var(--color-light-accent)]" />
            {!isCollapsed && <span>Petique</span>}
          </div>

          <button
            onClick={toggleCollapse}
            className="hidden md:flex text-[var(--color-light-accent)] hover:text-white transition-all duration-300"
          >
            {isCollapsed ? (
              <FaChevronRight size={20} />
            ) : (
              <FaChevronLeft size={20} />
            )}
          </button>
        </div>

        <ul className="space-y-4 text-lg flex-1">
          {links.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              className={({ isActive }) =>
                `
                flex items-center gap-3 p-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-[var(--color-light-secondary)] text-white"
                    : "hover:bg-[var(--color-light-secondary)] hover:text-white"
                }
                ${isCollapsed ? "justify-center" : ""}
              `
              }
              onClick={() => !isDesktop && toggleMobile()}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </ul>

        <div
          className={`mt-auto text-sm text-[var(--color-light-textSecondary)] ${
            isCollapsed ? "text-center" : ""
          }`}
        >
          {!isCollapsed && "© 2025 Petique"}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
