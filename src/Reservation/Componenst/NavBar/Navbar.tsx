import React from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header
      className="
        h-16 shadow-lg px-6 
        bg-[var(--color-light-secondary)] 
        flex items-center justify-between 
        fixed top-0 left-0 right-0 z-20
      "
    >
      <button className="md:hidden text-white" onClick={toggleSidebar}>
        <FaBars size={22} />
      </button>

      <div className="flex items-center gap-6 text-white ml-auto">
        <div className="relative cursor-pointer">
          <FaBell size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <FaUserCircle size={26} />
          <span className="font-semibold">Dr. Yomna</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
