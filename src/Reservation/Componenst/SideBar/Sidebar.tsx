import React from "react";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaPaw,
  FaTags,
  FaUserMd,
  FaSyringe,
  FaClipboardList,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Store/store";
import { clearUserToken } from "../../../Store/Slices/AuthSlice";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  //====> handel logout
  const handleLogout = () => {
    dispatch(clearUserToken());
    navigate("/login");
  };
  const links = [
    { icon: <FaTachometerAlt />, label: "Clinic Board", to: "/resDashboard" },
    {
      icon: <FaCalendarCheck />,
      label: "Reservations",
      to: "/resDashboard/reserv",
    },
    { icon: <FaPaw />, label: "Animals", to: "/resDashboard/animals" },
    {
      icon: <FaTags />,
      label: "Animals Category",
      to: "/resDashboard/animalCategory",
    },
    { icon: <FaUserMd />, label: "Doctors", to: "/resDashboard/doctors" },
    {
      icon: <FaSyringe />,
      label: "Vaccinations",
      to: "/resDashboard/vaccinations",
    },
    {
      icon: <FaClipboardList />,
      label: "Services",
      to: "/resDashboard/service",
    },
    {
      icon: <FaClipboardList />,
      label: "Medical OverView",
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
          bg-[#ECE7E2]
          text-[#86654F]
          shadow-lg flex flex-col p-4
          transition-all duration-300
          border-r border-[#A98770]/20
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
        <div className="flex items-center justify-between mb-8 mt-2">
          <div
            className={`text-2xl font-bold flex items-center gap-3 transition-all 
              ${isCollapsed ? "mx-auto" : ""}
            `}
          >
            <div className="p-2 bg-[#86654F] rounded-lg text-[#ECE7E2]">
              <FaPaw size={20} />
            </div>
            {!isCollapsed && <span className="text-[#86654F]">Petique</span>}
          </div>

          <button
            onClick={toggleCollapse}
            className="hidden md:flex text-[#A98770] hover:text-[#86654F] transition-all duration-300"
          >
            {isCollapsed ? (
              <FaChevronRight size={20} />
            ) : (
              <FaChevronLeft size={20} />
            )}
          </button>
        </div>

        <ul className="space-y-2 text-base flex-1">
          {links.map((item, i) => {
            const isLogout = item.label === "Logout";

            return (
              <NavLink
                key={i}
                to={item.to}
                end={item.to === "/resDashboard"}
                className={({ isActive }) =>
                  `
          flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-medium
          ${
            isActive
              ? "bg-[#86654F] text-[#ECE7E2] shadow-md"
              : "hover:bg-[#A98770]/10 text-[#86654F]"
          }
          ${isCollapsed ? "justify-center" : ""}`
                }
                onClick={() => {
                  if (!isDesktop) toggleMobile();
                  if (isLogout) handleLogout(); // ✅ handle logout
                }}
              >
                <div className="text-lg">{item.icon}</div>
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </ul>

        <div
          className={`mt-auto text-sm text-[#A98770] ${
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
