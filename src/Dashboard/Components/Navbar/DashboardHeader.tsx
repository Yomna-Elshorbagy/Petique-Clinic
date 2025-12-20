import { type ChangeEvent } from "react";
import { FaBars, FaHome } from "react-icons/fa";
import Swal from "sweetalert2";
import OrderNotificationBell from "../NotifyAdmin/NotifyAdmin";
import { baseURL } from "../../../Apis/BaseUrl";
import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const navigate = useNavigate();
  const handleExport = async () => {
    try {
      const response = await fetch(`${baseURL}/products/export`, {
        headers: {
          authentication: `bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to export products");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "products_export.json";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting products:", err);
    }
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);

        const response = await fetch(`${baseURL}/products/import`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authentication: `bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(json),
        });

        const result = await response.json();

        Swal.fire({
          icon: "success",
          title: "Import Completed",
          text: result.message || "Products imported successfully",
          confirmButtonColor: "#3085d6",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Import Failed",
          text: "Invalid file format or import failed",
          confirmButtonColor: "#d33",
        });
      }
      e.target.value = "";
    };

    reader.readAsText(file);
  };
  return (
    <header className="h-20 px-6 flex items-center justify-between w-full border-b border-[var(--color-extra-3)]/50 dark:border-gray-800 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2.5 rounded-xl hover:bg-[var(--color-extra-1)]/20 dark:hover:bg-gray-800 text-[var(--color-light-dark)] dark:text-gray-400 transition-all duration-200 hover:scale-105"
        >
          <FaBars className="text-xl" />
        </button>

        <div className="hidden md:block">
          <h2 className="text-lg font-bold text-[var(--color-light-dark)] dark:text-white">
            Welcome back! 👋
          </h2>
          <p className="text-xs text-[var(--color-light-textSecondary)] dark:text-gray-400">
            Manage your pet clinic efficiently
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Import - Export buttons */}
        <label className="cursor-pointer group relative">
          <div className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[var(--color-extra-1)] to-[var(--color-accent-light)] text-[var(--color-light-dark)] hover:from-[var(--color-accent-light)] hover:to-[var(--color-extra-1)] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Import
          </div>
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </label>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[var(--color-light-accent)] to-[var(--color-accent-dark)] text-white hover:from-[var(--color-accent-dark)] hover:to-[var(--color-light-accent)] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          Export
        </button>

         <div className="relative">
          <button
            onClick={() => navigate("/home")}
            title="Home"
            className="relative p-2 rounded-lg hover:bg-[var(--color-accent)] transition cursor-pointer"
            >
            <FaHome size={20}/>
          </button>
        </div>

        <OrderNotificationBell />

        {/* User info */}
        <div className="flex items-center gap-3 pl-6 border-l border-[var(--color-extra-3)]/50 dark:border-gray-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[var(--color-light-dark)] dark:text-white">
              Admin User
            </p>
            <p className="text-xs text-[var(--color-light-textSecondary)] dark:text-gray-400 font-medium">
              Manager
            </p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-light-accent)] to-[var(--color-accent-dark)] overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ring-2 ring-white/50 dark:ring-gray-800">
              AU
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
