import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { baseURL } from "../../../Apis/BaseUrl";

const OrderNotificationBell: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastIdsRef = useRef<string[]>([]);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");
        if (!token) return; 

        const res = await axios.get(
          `${baseURL}/order/allorders`,
          {
            headers: { authentication: `bearer ${token}` }, 
            timeout: 40000, 
          }
        );

        const data = Array.isArray(res.data?.data) ? res.data.data : [];

        if (!data.length && lastIdsRef.current.length === 0) {
          setOrders([]);
          return;
        }

        const prevIds = lastIdsRef.current;
        const currentIds = data.map((order: any) => order?._id).filter(Boolean);

        const newOnes =
          prevIds.length > 0
            ? data.filter((order: any) => !prevIds.includes(order._id))
            : [];

        if (newOnes.length > 0) {
          setHasNew(true);
        }

        lastIdsRef.current = currentIds;
        setOrders(data);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "An unexpected error occurred while fetching orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ===> handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setHasNew(false);
    setOpen((prev) => !prev);
  };

  // ===> sort + take latest 5 safely
  const latestOrders = Array.isArray(orders)
    ? orders
        .slice()
        .sort(
          (a, b) =>
            new Date(b?.createdAt || "").getTime() -
            new Date(a?.createdAt || "").getTime()
        )
        .slice(0, 10)
    : [];

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-lg hover:bg-[var(--color-accent)] transition cursor-pointer"
      >
        <Bell size={20} />
        {hasNew && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50">
          <p className="font-semibold mb-2 text-gray-800 dark:text-white flex items-center gap-1">
            🛒 Latest Orders
          </p>

          {loading ? (
            <div className="text-sm text-gray-500 text-center py-3">
              Loading orders...
            </div>
          ) : error ? (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 p-2 rounded-md">
              {error}
            </div>
          ) : latestOrders.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {latestOrders.map((order) => (
                <li
                  key={order._id}
                  className="border-b border-gray-200 dark:border-gray-700 py-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <strong>{order.fullName || "Unknown User"}</strong> placed an
                  order
                  <br />
                  <small>
                    Total: ${order.finalPrice || 0} —{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500 text-center">
              No recent orders
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderNotificationBell;
