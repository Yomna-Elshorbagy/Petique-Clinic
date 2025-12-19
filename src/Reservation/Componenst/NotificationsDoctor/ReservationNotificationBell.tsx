import React, { useRef, useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useReservationsNotifications } from "../../../Hooks/Reservation/useReservationNotification";
import { FaBell } from "react-icons/fa";

const ReservationNotificationBell = () => {
  const { reservations, hasNew, loading, error, clearNew } =
    useReservationsNotifications();

  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    clearNew();
  };

  const latest = reservations
    .slice()
    .sort(
      (a, b) =>
        new Date(b?.createdAt || "").getTime() -
        new Date(a?.createdAt || "").getTime()
    )
    .slice(0, 10);

  return (
    <div className="relative text-[#86654F]" ref={bellRef}>
      <button
        onClick={toggleOpen}
        className="relative p-2 cursor-pointer rounded-xl hover:bg-[#E9A66F]/20 hover:text-[#A98770] transition-colors"
      >
        <FaBell size={22} className="text-[#86654F]" />
        {hasNew && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      
      {open && (
        <div
          className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#3A342F]
         rounded-xl shadow-lg border border-[#A98770]/20 p-4 z-50 animate-slideUp"
        >
          <p className="font-semibold mb-3 text-[#4F3F36] flex items-center gap-1">
            🐾 Latest Reservations
          </p>

          {loading ? (
            <div className="text-sm text-[#7A7067] text-center py-3">
              Loading...
            </div>
          ) : error ? (
            <div className="text-sm text-red-500 bg-red-100 p-2 rounded-md">
              {error}
            </div>
          ) : latest.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {latest.map((res) => (
                <li
                  key={res._id}
                  className="border-b border-[#A98770]/20 py-2 text-sm text-[#4F3F36]"
                >
                  <strong>{res.petOwner?.userName || "Unknown"}</strong> booked{" "}
                  <strong>{res.service?.title || "Service"}</strong>
                  <br />
                  <small className="text-[#7A7067]">
                    {new Date(res.createdAt).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-[#7A7067] text-center">
              No recent reservations
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationNotificationBell;
