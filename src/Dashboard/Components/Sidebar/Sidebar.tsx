import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaSignOutAlt,
  FaPaw
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Overview", icon: FaHome, path: "/ecoDashboard" },
    { name: "Products", icon: FaBox, path: "/ecoDashboard/products" },
    { name: "Orders", icon: FaShoppingCart, path: "/ecoDashboard/orders" },
    { name: "Customers", icon: FaUsers, path: "/ecoDashboard/customers" },
    
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-[var(--color-dark-card)] border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 bg-[var(--color-light-accent)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 dark:shadow-none">
            <FaPaw className="text-xl" />
          </div>
          <span className="text-xl font-bold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">Petique</span>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-[var(--color-light-primary)]/20 text-[var(--color-light-accent)] font-semibold" 
                    : "text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)] hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[var(--color-light-dark)] dark:hover:text-[var(--color-dark-text)]"
                  }`}
              >
                <item.icon className={`text-lg ${isActive ? "text-[var(--color-light-accent)]" : "text-gray-400 group-hover:text-[var(--color-light-accent)]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
