import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaEnvelopeOpenText,
  FaTags,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaHeadset,
} from "react-icons/fa";
import { useAppDispatch } from "../../../Store/store";
import { clearUserToken } from "../../../Store/Slices/AuthSlice";
import logo from "../../../assets/images/logo.jpg";

const Sidebar = ({
  isOpen,
  isCollapsed,
  toggleMobile,
  toggleCollapse,
}: {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleMobile: () => void;
  toggleCollapse: () => void;
}) => {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Listen for window resize to update isDesktop
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //====> handel logout
  const handleLogout = () => {
    dispatch(clearUserToken());
    navigate("/login");
  };

  const menuItems = [
    { name: "Overview", icon: FaHome, path: "/ecoDashboard" },
    { name: "Pet Owners", icon: FaUsers, path: "/ecoDashboard/users" },
    { name: "Categories", icon: FaBox, path: "/ecoDashboard/categories" },
    { name: "Products", icon: FaBox, path: "/ecoDashboard/products" },
    { name: "Coupons", icon: FaTags, path: "/ecoDashboard/coupons" },
    { name: "Orders", icon: FaShoppingCart, path: "/ecoDashboard/orders" },
    { name: "Emails", icon: FaEnvelopeOpenText, path: "/ecoDashboard/emails" },
    { name: "Chat Support", icon: FaHeadset, path: "/ecoDashboard/chat" },
    { name: "Reports", icon: FaChartBar, path: "/ecoDashboard/reports" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-40 
          min-h-screen overflow-hidden                    
          bg-white dark:bg-[var(--color-dark-card)]
          text-[var(--color-light-dark)] dark:text-white
          shadow-lg flex flex-col
          transition-all duration-300
          border-r border-[var(--color-extra-3)]/30 dark:border-gray-800
          ${
            isDesktop
              ? isCollapsed
                ? "w-20 p-4"
                : "w-64 p-4"
              : isOpen
              ? "w-64 p-4"
              : "w-0 p-0"
          }
        `}
      >
        <div className="flex items-center justify-between mb-8 mt-2">
          <div
            className={`text-2xl font-bold flex items-center gap-3 transition-all 
              ${isCollapsed ? "mx-auto" : ""}
            `}
          >
            <img
              src={logo}
              alt="Petique Clinic Logo"
              className="h-11 w-11 object-contain rounded-full border-2 border-[var(--color-light-accent)]/30 shadow-md"
            />
            {!isCollapsed && (
              <span className="text-lg font-bold text-[var(--color-light-dark)] dark:text-white">
                Petique
              </span>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            className="hidden md:flex text-[var(--color-extra-4)] hover:text-[var(--color-light-accent)] transition-all duration-300"
          >
            {isCollapsed ? (
              <FaChevronRight size={20} />
            ) : (
              <FaChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="space-y-1 text-base flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => !isDesktop && toggleMobile()}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-medium
                  ${
                    isActive
                      ? "bg-[var(--color-light-accent)] text-white shadow-sm"
                      : "hover:bg-[var(--color-extra-5)] dark:hover:bg-gray-800 text-[var(--color-light-dark)] dark:text-[var(--color-dark-textSecondary)]"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <item.icon
                  className={`text-lg transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-[var(--color-extra-4)] group-hover:text-[var(--color-light-accent)]"
                  }`}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`mt-auto ${isCollapsed ? "text-center" : ""}}`}>
          <div className={`mt-auto ${isCollapsed ? "text-center" : ""}`}>
            <button
              onClick={() => {
                handleLogout();
                if (!isDesktop) toggleMobile();
              }}
              className={`flex items-center gap-3 p-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 font-medium ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <FaSignOutAlt className="text-lg" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
