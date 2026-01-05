import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  FileText,
  Syringe,
  Menu,
  ChevronLeft,
  LogOut,
  ClipboardCheck,
  MessagesSquare,
} from "lucide-react";
import { useAppDispatch } from "../../../Store/store";
import { clearUserToken } from "../../../Store/Slices/AuthSlice";

const StaffSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUserToken());
    navigate("/login", { replace: true });
  };

  const navItems = [
    { path: "/staff/appointments", label: "Appointments", icon: Calendar },
    { path: "/staff/reservation", label: "Reservation", icon: ClipboardCheck },
    { path: "/staff/clients", label: "Clients", icon: Users },
    { path: "/staff/petRecord", label: "Pet Records", icon: FileText },
    { path: "/staff/chat", label: "Chat Support", icon: MessagesSquare },
    { path: "/staff/vaccinations", label: "Vaccinations", icon: Syringe },
  ];

  return (
    <div
      className={`h-screen bg-[#f7f6f5] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col relative z-30 ${
        isCollapsed ? "w-20" : "w-68"
      }`}
    >
      {/* Subtle Warm Overlay */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[var(--color-extra-5)]/10 to-transparent pointer-events-none" />

      {/* Toggle Button - Premium Style */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3.5 top-12 bg-[#cb946f] text-white p-1.5 rounded-full shadow-[0_4px_12px_rgba(134,101,79,0.2)] hover:scale-110 active:scale-90 transition-all duration-300 z-50 border-2 border-white"
      >
        {isCollapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div className="h-28 flex items-center px-6 border-b border-[#A98868]/10">
        <div
          className={`flex items-center gap-4 transition-all duration-500 ${
            isCollapsed ? "scale-90" : "scale-100"
          }`}
        >
          <div className="w-11 h-11 bg-gradient-to-br from-[#86654f] to-[#cb946f] rounded-2xl flex items-center justify-center shadow-[0_8px_20px_-5px_rgba(134,101,79,0.3)]">
            <span className="text-white font-black text-xl tracking-tighter">
              P
            </span>
          </div>
          <div
            className={`transition-all duration-500 ${
              isCollapsed
                ? "opacity-0 w-0 -translate-x-4"
                : "opacity-100 w-auto translate-x-0"
            }`}
          >
            <h1 className="font-extrabold text-2xl text-[#4f3f36] tracking-tighter leading-none">
              Petique<span className="text-[#e9a66f]">.</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-[#A98770] mt-2">
              Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - High End Warm Style */}
      <nav className="flex-1 overflow-y-auto pt-10 px-4 space-y-2.5 scrollbar-none">
        <div
          className={`text-[10px] uppercase tracking-[0.4em] font-black text-[#A98770]/40 mb-6 px-3 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          Core Modules
        </div>

        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                ${
                  isActive
                    ? "bg-[var(--color-extra-5)]/40 text-[#86654f] shadow-[0_4px_15px_-5px_rgba(134,101,79,0.1)] border border-[#A98868]/10"
                    : "text-[#7a7067] hover:text-[#4f3f36] hover:bg-[#faf7f2]"
                }`}
            >
              <div
                className={`transition-all duration-300 group-hover:scale-110 ${
                  isCollapsed ? "mx-auto" : ""
                } ${isActive ? "text-[#e9a66f]" : ""}`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span
                className={`font-bold text-sm tracking-tight whitespace-nowrap transition-all duration-500 ${
                  isCollapsed
                    ? "opacity-0 w-0 -translate-x-4 overflow-hidden"
                    : "opacity-100 w-auto translate-x-0"
                }`}
              >
                {item.label}
              </span>

              {/* Active Marker */}
              {isActive && !isCollapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-[#e9a66f] rounded-full shadow-[0_0_8px_rgba(233,166,111,0.6)] animate-pulse" />
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-6 px-4 py-2.5 bg-[#4f3f36] text-[#faf7f2] text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-[#A98868]/10 bg-[#faf7f2]/30">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[#A98770] hover:text-red-500 hover:bg-red-50 transition-all duration-300 group active:scale-95 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span
            className={`font-bold text-xs uppercase tracking-widest transition-all duration-500 ${
              isCollapsed
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100 w-auto"
            }`}
          >
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
};

export default StaffSidebar;
