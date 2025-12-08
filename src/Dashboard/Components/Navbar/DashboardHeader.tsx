import React, { type ChangeEvent } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import OrderNotificationBell from "../NotifyAdmin/NotifyAdmin";
import { baseURL } from "../../../Apis/BaseUrl";

const DashboardHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
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
    <header className="bg-white dark:bg-[var(--color-dark-card)] border-b border-gray-200 dark:border-gray-800 h-20 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        {/* ===> import - Export buttons */}
        <label className="action-btn btn-import cursor-pointer animate-soft">
          Import
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </label>

        <button
          onClick={handleExport}
          className="action-btn btn-export animate-soft"
        >
          Export
        </button>

        <OrderNotificationBell />

        {/* ===> userinfo */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[var(--color-light-dark)] dark:text-[var(--color-dark-text)]">
              Admin User
            </p>
            <p className="text-xs text-[var(--color-light-textSecondary)] dark:text-[var(--color-dark-textSecondary)]">
              Manager
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer">
            <FaUserCircle className="w-full h-full text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
