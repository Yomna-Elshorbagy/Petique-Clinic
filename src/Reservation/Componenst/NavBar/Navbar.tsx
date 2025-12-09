import React from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import type { TokenPayload } from "../../../Interfaces/ITokenPayload";
import { jwtDecode } from "jwt-decode";
import ReservationNotificationBell from "../NotificationsDoctor/ReservationNotificationBell";


interface NavbarProps {
  toggleSidebar: () => void;
}

const token = localStorage.getItem("accessToken");
let user: TokenPayload | null = null;

if (token) {
  try {
    user = jwtDecode<TokenPayload>(token);
  } catch (err) {
    console.error("Invalid token:", err);
  }
}
const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header
      className="
        h-20 px-8 
        bg-[#d0c6be] 
        flex items-center justify-between 
        fixed top-0 right-0 z-20
        transition-all duration-300
        border-b border-[#A98770]/20
        w-full md:w-[calc(100%-16rem)] 
      "
      style={{ width: "calc(100% - var(--sidebar-width, 0px))" }}
    >
      <button className="md:hidden text-[#86654F]" onClick={toggleSidebar}>
        <FaBars size={24} />
      </button>

      <div className="flex items-center gap-6 text-[#86654F]  ml-auto">
          <ReservationNotificationBell />

        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition pl-6 border-l border-[#A98770]/20">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#86654F]">
              {`Dr: ${user?.name ?? "Yomna"}`}
            </p>{" "}
            <p className="text-xs text-[#A98770]">Veterinarian</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#86654F] text-[#ECE7E2] flex items-center justify-center">
            <FaUserCircle size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
